<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;

class QueueMonitor extends Command
{
    protected $signature = 'queue:monitor {--interval=1}';
    protected $description = 'Мониторинг очереди в реальном времени';

    public function handle()
    {
        $interval = (int) $this->option('interval');

        $this->info("🔍 Мониторинг очереди Redis (обновление каждые {$interval} сек)");
        $this->info("Нажмите Ctrl+C для остановки");
        $this->newLine();

        $startTime = now();
        $previousQueueSize = 0;
        $previousProcessed = 0;

        while (true) {
            // Получаем данные из Redis
            $queueSize = Redis::llen('queues:task-assignment');
            $failedCount = Redis::llen('queues:task-assignment:failed');
            $delayedCount = Redis::zcard('queues:task-assignment:delayed');

            // Получаем общее количество обработанных задач из БД
            $totalProcessed = DB::table('tasks')->count();
            $processedToday = DB::table('tasks')
                ->whereDate('assigned_at', today())
                ->count();

            // Вычисляем скорость обработки
            $processed = $totalProcessed - $previousProcessed;
            $rps = $processed / $interval;

            // Определяем тренд очереди
            $trend = '';
            if ($queueSize > $previousQueueSize) {
                $trend = '📈 Растет';
            } elseif ($queueSize < $previousQueueSize) {
                $trend = '📉 Уменьшается';
            } else {
                $trend = '➡️ Стабильно';
            }

            // Время работы
            $uptime = $startTime->diffForHumans(null, true);

            // Очищаем экран и выводим статистику
            $this->clearScreen();

            $this->info("🔄 Мониторинг очереди - {$uptime}");
            $this->newLine();

            $this->table(
                ['Метрика', 'Значение'],
                [
                    ['📦 Задач в очереди', number_format($queueSize) . " {$trend}"],
                    ['⚡ Скорость обработки', round($rps, 2) . ' jobs/sec'],
                    ['✅ Обработано всего', number_format($totalProcessed)],
                    ['📅 Обработано сегодня', number_format($processedToday)],
                    ['❌ Неудачных', number_format($failedCount)],
                    ['⏰ Отложенных', number_format($delayedCount)],
                    ['📊 ETA (при текущей скорости)', $this->calculateETA($queueSize, $rps)],
                ]
            );

            // Воркеры (попробуем определить)
            $this->newLine();
            $this->info("👷 Активные воркеры:");
            $this->showWorkers();

            // Последние обработанные задачи
            $this->newLine();
            $this->info("📋 Последние 5 обработанных задач:");
            $this->showRecentTasks();

            $previousQueueSize = $queueSize;
            $previousProcessed = $totalProcessed;

            sleep($interval);
        }
    }

    private function calculateETA($queueSize, $rps): string
    {
        if ($rps <= 0 || $queueSize <= 0) {
            return 'N/A';
        }

        $seconds = (int) ($queueSize / $rps);

        if ($seconds < 60) {
            return "{$seconds} сек";
        } elseif ($seconds < 3600) {
            $minutes = (int) ($seconds / 60);
            return "{$minutes} мин";
        } else {
            $hours = (int) ($seconds / 3600);
            $minutes = (int) (($seconds % 3600) / 60);
            return "{$hours} ч {$minutes} мин";
        }
    }

    private function showWorkers()
    {
        // Пытаемся получить список воркеров из Redis
        $workers = Redis::smembers('workers');

        if (empty($workers)) {
            $this->line("  Информация о воркерах недоступна");
            $this->line("  💡 Запущено воркеров в docker-compose: проверьте sail ps");
            return;
        }

        foreach ($workers as $worker) {
            $this->line("  • {$worker}");
        }
    }

    private function showRecentTasks()
    {
        $recentTasks = DB::table('tasks')
            ->orderBy('assigned_at', 'desc')
            ->limit(5)
            ->get(['task_id', 'title', 'user_id', 'assigned_at']);

        if ($recentTasks->isEmpty()) {
            $this->line("  Нет обработанных задач");
            return;
        }

        foreach ($recentTasks as $task) {
            $time = \Carbon\Carbon::parse($task->assigned_at)->diffForHumans();
            $this->line("  • [{$task->task_id}] {$task->title} → User #{$task->user_id} ({$time})");
        }
    }

    private function clearScreen()
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            system('cls');
        } else {
            system('clear');
        }
    }
}
