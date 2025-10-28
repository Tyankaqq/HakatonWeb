<?php

namespace App\Console\Commands;

use App\Jobs\AssignTaskJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class QueueBenchmark extends Command
{
    protected $signature = 'queue:benchmark {count=10000}';
    protected $description = 'Тест скорости обработки очереди';

    public function handle()
    {
        $count = (int) $this->argument('count');

        $this->info("🚀 Начинаем тест производительности очереди");
        $this->info("📊 Количество задач: {$count}");
        $this->newLine();

        // ========================================
        // ШАГ 1: Быстро генерируем и добавляем в очередь
        // ========================================
        $this->info("⏳ Заполнение очереди...");
        $startFill = microtime(true);

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
        $titles = ['Задача', 'Проблема', 'Вопрос', 'Запрос', 'Жалоба'];

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        $taskIds = [];

        for ($i = 1; $i <= $count; $i++) {
            $taskId = 'TASK-' . strtoupper(Str::random(10));
            $taskIds[] = $taskId;

            // Генерируем параметры
            $numParams = rand(3, 5);
            $allParamIds = array_merge(array_keys($stringParams), $integerParams);
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

            $taskData = [
                'task_id' => $taskId,
                'title' => $titles[array_rand($titles)] . " #{$i}",
                'priority' => $priorities[array_rand($priorities)],
                'weight' => rand(1, 10),
                'parameters' => $parameters,
                'created_at' => now()->toISOString(),
            ];

            // Добавляем в Redis очередь
            AssignTaskJob::dispatch($taskData)->onQueue('task-assignment');

            $bar->advance();
        }

        $bar->finish();
        $fillDuration = round(microtime(true) - $startFill, 2);

        $this->newLine(2);
        $this->info("✅ Очередь заполнена за {$fillDuration} сек");

        // Сохраняем метаданные теста
        Redis::set('benchmark:task_ids', json_encode($taskIds));
        Redis::set('benchmark:start_time', now()->timestamp);
        Redis::set('benchmark:total_count', $count);
        Redis::set('benchmark:processed_count', 0);

        $this->newLine();
        $this->info("🔄 Запускаем мониторинг обработки...");
        $this->info("💡 Откройте другой терминал и запустите: sail artisan queue:monitor");
        $this->newLine();

        // ========================================
        // ШАГ 2: Мониторим обработку
        // ========================================
        $this->monitorProcessing($count);
    }

    private function monitorProcessing($totalCount)
    {
        $startTime = microtime(true);
        $lastProcessed = 0;

        while (true) {
            // Проверяем сколько задач в очереди осталось
            $queueSize = Redis::llen('queues:task-assignment');
            $processed = $totalCount - $queueSize;

            if ($processed >= $totalCount) {
                break;
            }

            // Обновляем прогресс каждые 0.5 секунды
            if ($processed > $lastProcessed) {
                $elapsed = round(microtime(true) - $startTime, 2);
                $rps = $elapsed > 0 ? round($processed / $elapsed, 2) : 0;
                $percentage = round(($processed / $totalCount) * 100, 1);
                $remaining = $totalCount - $processed;
                $eta = $rps > 0 ? round($remaining / $rps, 1) : 0;

                $bar = str_repeat('█', (int)($percentage / 2)) . str_repeat('░', 50 - (int)($percentage / 2));

                echo "\r[{$bar}] {$percentage}% | Обработано: {$processed}/{$totalCount} | {$rps} jobs/sec | ETA: {$eta}s  ";

                $lastProcessed = $processed;
            }

            usleep(100000); // 0.1 секунды
        }

        $totalDuration = round(microtime(true) - $startTime, 2);
        $avgRps = round($totalCount / $totalDuration, 2);

        $this->newLine(2);
        $this->info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        $this->info("✅ Обработка завершена!");
        $this->info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        $this->table(
            ['Метрика', 'Значение'],
            [
                ['Всего задач', $totalCount],
                ['Время обработки', "{$totalDuration} сек"],
                ['Средняя скорость', "{$avgRps} jobs/sec"],
                ['Среднее время на задачу', round(1000 / $avgRps, 2) . ' мс'],
            ]
        );

        // Очищаем метаданные
        Redis::del('benchmark:task_ids', 'benchmark:start_time', 'benchmark:total_count', 'benchmark:processed_count');
    }
}
