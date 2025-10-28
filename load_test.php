<?php

$baseUrl = 'http://localhost/api/v1';
$totalRequests = 10000;
$concurrency = 500; // Увеличили параллелизм

echo "🚀 Нагрузочное тестирование: {$totalRequests} запросов\n";
echo "⚡ Параллельных запросов: {$concurrency}\n\n";

$stringParams = [
    80 => ['Russian', 'English', 'German', 'French', 'Spanish'],
    82 => ['Support', 'Technical', 'Sales', 'VIP', 'Billing'],
    83 => ['Junior', 'Middle', 'Senior', 'Lead', 'Expert'],
    85 => ['Basic', 'Advanced', 'Professional', 'Expert', 'Master'],
    86 => ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
    87 => ['Morning', 'Day', 'Evening', 'Night', 'Flexible'],
    88 => ['Moscow', 'SPb', 'Kazan', 'Remote', 'Office'],
    90 => ['Hardware', 'Software', 'Network', 'Security', 'Database'],
    91 => ['Yes', 'No'],
    92 => ['Yes', 'No'],
    93 => ['Product_A', 'Product_B', 'Product_C', 'All'],
    95 => ['UTC+3', 'UTC+5', 'UTC+0', 'UTC+8'],
    96 => ['Formal', 'Casual', 'Technical', 'Friendly'],
    97 => ['Bug', 'Feature', 'Question', 'Complaint', 'Emergency'],
    98 => ['IT', 'Finance', 'Healthcare', 'Retail', 'Education'],
];

$integerParams = [81, 84, 89, 94, 99];
$priorities = ['low', 'medium', 'high'];
$titles = [
    'Вопрос клиента',
    'Техническая проблема',
    'Критическая ошибка',
    'Запрос',
    'Жалоба',
    'Вопрос',
    'Настройка',
    'Проблема',
];

// ========================================
// ОПТИМИЗАЦИЯ 1: Генерируем JSON заранее
// ========================================
echo "⏳ Генерация задач...\n";
$jsonPayloads = [];
$allParamIds = array_merge(array_keys($stringParams), $integerParams);

for ($i = 1; $i <= $totalRequests; $i++) {
    $numParams = rand(3, 5);
    shuffle($allParamIds);
    $selectedParams = array_slice($allParamIds, 0, $numParams);

    $parameters = [];
    foreach ($selectedParams as $paramId) {
        if (in_array($paramId, $integerParams)) {
            $parameters[] = [
                'parameter_id' => $paramId,
                'value' => rand(1, 10),
                'comparison_operator' => '>='
            ];
        } else {
            $values = $stringParams[$paramId];
            $parameters[] = [
                'parameter_id' => $paramId,
                'value' => $values[array_rand($values)],
                'comparison_operator' => '='
            ];
        }
    }

    // Сразу кодируем в JSON
    $jsonPayloads[] = json_encode([
        'title' => $titles[array_rand($titles)] . " #{$i}",
        'priority' => $priorities[array_rand($priorities)],
        'weight' => rand(1, 10),
        'parameters' => $parameters
    ]);
}

echo "✓ Сгенерировано {$totalRequests} задач\n";
echo "🚀 Отправка запросов...\n\n";

$successful = 0;
$failed = 0;
$startTime = microtime(true);

// ========================================
// ОПТИМИЗАЦИЯ 2: Отправляем все сразу
// ========================================
$chunks = array_chunk($jsonPayloads, $concurrency);

foreach ($chunks as $chunkIndex => $chunk) {
    $multiHandle = curl_multi_init();

    // ОПТИМИЗАЦИЯ 3: Настройки curl_multi для максимальной скорости
    curl_multi_setopt($multiHandle, CURLMOPT_PIPELINING, CURLPIPE_MULTIPLEX);
    curl_multi_setopt($multiHandle, CURLMOPT_MAX_TOTAL_CONNECTIONS, $concurrency);

    $handles = [];

    // Добавляем все запросы
    foreach ($chunk as $jsonPayload) {
        $ch = curl_init("$baseUrl/tasks");

        // ОПТИМИЗАЦИЯ 4: Минимальные опции curl
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Connection: keep-alive'],
            CURLOPT_POSTFIELDS => $jsonPayload,
            CURLOPT_TIMEOUT => 10, // Снизили timeout
            CURLOPT_CONNECTTIMEOUT => 2, // Снизили connect timeout
            CURLOPT_TCP_NODELAY => true, // Отключаем Nagle's algorithm
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1, // HTTP/1.1 для keep-alive
        ]);

        curl_multi_add_handle($multiHandle, $ch);
        $handles[] = $ch;
    }

    // ОПТИМИЗАЦИЯ 5: Более эффективное выполнение
    $active = null;
    do {
        $mrc = curl_multi_exec($multiHandle, $active);
    } while ($mrc == CURLM_CALL_MULTI_PERFORM);

    while ($active && $mrc == CURLM_OK) {
        if (curl_multi_select($multiHandle, 0.01) == -1) {
            usleep(1);
        }
        do {
            $mrc = curl_multi_exec($multiHandle, $active);
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);
    }

    // Подсчет результатов
    foreach ($handles as $ch) {
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($httpCode >= 200 && $httpCode < 300) {
            $successful++;
        } else {
            $failed++;
        }
        curl_multi_remove_handle($multiHandle, $ch);
        curl_close($ch);
    }

    curl_multi_close($multiHandle);

    // Прогресс
    $completed = min(($chunkIndex + 1) * $concurrency, $totalRequests);
    $percentage = round(($completed / $totalRequests) * 100, 1);
    $elapsed = round(microtime(true) - $startTime, 2);
    $rps = $completed > 0 ? round($completed / $elapsed, 2) : 0;

    $bar = str_repeat('█', (int)($percentage / 2)) . str_repeat('░', 50 - (int)($percentage / 2));
    echo "\r[{$bar}] {$percentage}% | {$completed}/{$totalRequests} | ✓{$successful} ✗{$failed} | {$rps} RPS | {$elapsed}s  ";
}

$endTime = microtime(true);
$duration = round($endTime - $startTime, 2);
$rps = round($totalRequests / $duration, 2);

echo "\n\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "✅ Нагрузочное тестирование завершено!\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "📊 Результаты:\n";
echo "   Всего запросов:      {$totalRequests}\n";
echo "   Успешных:            {$successful}\n";
echo "   Неудачных:           {$failed}\n";
echo "   Время выполнения:    {$duration} сек\n";
echo "   Запросов в секунду:  {$rps}\n";
echo "   Успешность:          " . round(($successful / $totalRequests) * 100, 2) . "%\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
