<?php

namespace App\Jobs;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessTaskDistributionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 120;
    public $tries = 3;

    public function __construct(
        public string $taskId
    ) {}

    public function handle(): void
    {
        // ШАГ 1: Читаем из Redis
        $taskJson = Redis::get("task:{$this->taskId}:data");

        if (!$taskJson) {
            return;
        }

        $taskData = json_decode($taskJson, true);
        $parameters = $taskData['parameters'];

        // ШАГ 2: Блокировка
        $lockKey = "task:lock:{$this->taskId}";
        if (!Redis::set($lockKey, 1, 'EX', 60, 'NX')) {
            return;
        }

        try {
            // ШАГ 3: Находим исполнителя (с актуальными данными из БД)
            $executor = $this->findBestExecutor($parameters);

            if (!$executor) {
                Log::warning("No executor for task {$this->taskId}");
                Redis::incr('tasks:no_executor:total');
                Redis::lrem('tasks:pending', 1, $this->taskId);
                Redis::del("task:{$this->taskId}:data");
                return;
            }

            // ШАГ 4: Назначаем → записываем в Postgres
            DB::beginTransaction();

            $task = Task::create([
                'parameters' => $parameters, // ← Сохраняем в БД
                'assigned_user_id' => $executor->id
            ]);

            // Обновляем счетчики
            Redis::incr("executor:{$executor->id}:current_tasks");
            Redis::incr('tasks:processed:total');

            DB::commit();

            // ШАГ 5: Удаляем из Redis
            Redis::lrem('tasks:pending', 1, $this->taskId);
            Redis::del("task:{$this->taskId}:data");

            Log::info("Task {$this->taskId} → Executor {$executor->id}");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error: " . $e->getMessage());
            throw $e;
        } finally {
            Redis::del($lockKey);
        }
    }

    /**
     * Найти лучшего исполнителя по параметрам
     */
    private function findBestExecutor(array $parameters): ?User
    {
        // ПРАВИЛО 1: Только активные
        $query = User::where('status', 'active');

        // ПРАВИЛО 4: Соответствие параметрам
        foreach ($parameters as $key => $value) {
            if (in_array($key, ['region', 'category', 'priority'])) {
                $query->whereHas('flags', function ($q) use ($key, $value) {
                    $q->where('key', $key)
                        ->whereRaw('flag_user.value::jsonb = ?', [json_encode($value)]);
                });
            }
        }

        $candidates = $query->with('flags')->get();

        if ($candidates->isEmpty()) {
            return null;
        }

        // ПРАВИЛО 2: Наименьшая нагрузка
        $bestExecutor = null;
        $minLoad = PHP_INT_MAX;

        foreach ($candidates as $candidate) {
            $currentLoad = (int) (Redis::get("executor:{$candidate->id}:current_tasks") ?? 0);
            $maxTasks = (int) ($candidate->getFlagValue('max_tasks') ?? 10);

            if ($currentLoad >= $maxTasks) {
                continue;
            }

            if ($currentLoad < $minLoad) {
                $minLoad = $currentLoad;
                $bestExecutor = $candidate;
            }
        }

        return $bestExecutor;
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Task {$this->taskId} failed: " . $exception->getMessage());
        Redis::incr('tasks:failed:total');
    }
}
