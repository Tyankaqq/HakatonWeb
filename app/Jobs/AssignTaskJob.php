<?php

namespace App\Jobs;

use App\Events\TaskAssigned;
use App\Http\Services\TaskAssignmentService;
use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class AssignTaskJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 120;

    public function __construct(
        public array $taskData
    ) {}

    /**
     * Обработка задачи из Redis:
     * 1. Берем задачу из Redis
     * 2. Ищем подходящего исполнителя
     * 3. ТОЛЬКО после нахождения сохраняем в PostgreSQL
     */
    public function handle(TaskAssignmentService $assignmentService): void
    {
        $taskId = $this->taskData['task_id'];

        // Отмечаем, что worker начал обработку
        Redis::setex("task:processing:{$taskId}", 300, now()->toISOString());

        Log::info("Processing task from Redis queue: {$taskId}");

        try {
            // ШАГ 1: Создаем временный объект (НЕ сохраняем в БД)
            $tempTask = new Task([
                'task_id' => $taskId,
                'title' => $this->taskData['title'],
                'priority' => $this->taskData['priority'],
                'weight' => $this->taskData['weight'],
                'parameters' => $this->taskData['parameters'],
            ]);

            Log::info("Looking for suitable executor for task {$taskId}");

            // ШАГ 2: Ищем исполнителя
            $assignedUser = $assignmentService->findUserForTask($tempTask);

            if (!$assignedUser) {
                Log::warning("No suitable user found for task {$taskId}. Task will be retried.");
                throw new \Exception("No suitable user available");
            }

            Log::info("Found executor: User {$assignedUser->id} (weight: {$assignedUser->weight}, open tasks: {$assignedUser->getOpenTasksCount()})");

            // ШАГ 3: ТОЛЬКО ТЕПЕРЬ сохраняем в PostgreSQL
            $task = Task::create([
                'task_id' => $taskId,
                'title' => $this->taskData['title'],
                'priority' => $this->taskData['priority'],
                'weight' => $this->taskData['weight'],
                'user_id' => $assignedUser->id,
                'parameters' => $this->taskData['parameters'],
                'assigned_at' => now(),
            ]);

            event(new TaskAssigned($task));

            // Удаляем из Redis после успешной обработки
            Redis::del("task:pending:{$taskId}");
            Redis::del("task:processing:{$taskId}");

            Log::info("✓ Task {$taskId} successfully assigned to user {$assignedUser->id} and saved to PostgreSQL");

        } catch (\Exception $e) {
            Redis::del("task:processing:{$taskId}");

            Log::error("✗ Failed to process task: {$taskId} - " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Обработка неудачного выполнения
     */
    public function failed(\Throwable $exception): void
    {
        $taskId = $this->taskData['task_id'];

        // Сохраняем информацию об ошибке в Redis
        Redis::setex(
            "task:failed:{$taskId}",
            86400,
            json_encode([
                'task_id' => $taskId,
                'error' => $exception->getMessage(),
                'failed_at' => now()->toISOString()
            ])
        );

        Redis::del("task:pending:{$taskId}");
        Redis::del("task:processing:{$taskId}");

        Log::error("Task {$taskId} FAILED after {$this->tries} attempts: " . $exception->getMessage());
    }
}
