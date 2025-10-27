<?php

namespace App\Http\Services;

use App\Models\Task;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class TaskService
{
    /**
     * Принять задачу и закинуть в Redis
     * Принимает ТОЛЬКО параметры
     */
    public function acceptTask(array $parameters): array
    {
        // Генерируем UUID для задачи
        $taskId = Str::uuid()->toString();

        $taskData = [
            'id' => $taskId,
            'parameters' => $parameters,
            'status' => 'pending',
            'received_at' => now()->toIso8601String()
        ];

        try {

            Redis::setex(
                "task:{$taskId}:data",
                3600,
                json_encode($taskData)
            );

            Redis::rpush('tasks:pending', $taskId);

            Redis::incr('tasks:received:total');

            ProcessTaskDistributionJob::dispatch($taskId)
                ->onQueue('distribution');

            Log::info("Task {$taskId} queued", ['parameters' => $parameters]);

            // TODO: WebSocket broadcast (TaskCreatedEvent)
            // broadcast(new TaskCreatedEvent($taskData))->toOthers();

            return [
                'status' => 'accepted',
                'task_id' => $taskId,
                'queue_position' => Redis::llen('tasks:pending')
            ];

        } catch (\Exception $e) {
            Log::error("Error accepting task: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Получить задачу из Redis
     */
    public function getTask(string $taskId): ?array
    {
        $taskJson = Redis::get("task:{$taskId}:data");

        if (!$taskJson) {
            // Попробуем в Postgres (история)
            $task = Task::find($taskId);
            return $task ? $task->toArray() : null;
        }

        return json_decode($taskJson, true);
    }

    /**
     * Получить очередь (первые N задач)
     */
    public function getPendingQueue(int $limit = 20): array
    {
        $taskIds = Redis::lrange('tasks:pending', 0, $limit - 1);

        $tasks = [];
        foreach ($taskIds as $taskId) {
            $task = $this->getTask($taskId);
            if ($task) {
                $tasks[] = $task;
            }
        }

        return $tasks;
    }

    /**
     * Статистика системы
     */
    public function getStats(): array
    {
        return [
            'queue' => [
                'pending' => (int) Redis::llen('tasks:pending'),
            ],
            'total' => [
                'received' => (int) (Redis::get('tasks:received:total') ?? 0),
                'processed' => (int) (Redis::get('tasks:processed:total') ?? 0),
                'failed' => (int) (Redis::get('tasks:failed:total') ?? 0),
                'no_executor' => (int) (Redis::get('tasks:no_executor:total') ?? 0),
            ]
        ];
    }

    /**
     * История из Postgres (для отчетов)
     */
    public function getHistory(array $filters = []): array
    {
        $query = Task::query()->with('assignedUser');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['user_id'])) {
            $query->where('assigned_user_id', $filters['user_id']);
        }

        if (isset($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate(50)
            ->toArray();
    }
}

