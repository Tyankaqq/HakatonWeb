<?php

namespace App\Http\Services;

use App\Jobs\AssignTaskJob;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TaskService
{
    public function __construct(
        private TaskAssignmentService $assignmentService
    ) {}

    /**
     * Получить список задач
     */
    public function getTasks(): JsonResponse
    {
        $tasks = Task::query()
            ->select('id', 'task_id', 'title', 'priority', 'user_id', 'created_at', 'execution_time_ms')
            ->with('user:id,first_name,last_name')
            ->latest('created_at')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tasks
        ], 200);
    }

    /**
     * Создать задачу и отправить в Redis очередь
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'priority' => ['nullable', Rule::in(['low', 'medium', 'high'])],
            'weight' => 'nullable|integer|min:1|max:10',
            'parameters' => 'required|array',
            'parameters.*.parameter_id' => 'required|exists:parameters,id',
            'parameters.*.value' => 'required',
            'parameters.*.comparison_operator' => ['nullable', Rule::in(['>', '<', '>=', '<=', '=', '!='])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        $taskId = 'TASK-' . strtoupper(Str::random(10));
        $priority = $data['priority'] ?? 'medium';

        $taskData = [
            'task_id' => $taskId,
            'title' => $data['title'],
            'priority' => $priority,
            'weight' => $data['weight'] ?? 1,
            'parameters' => $data['parameters'],
            'created_at' => now()->toISOString(),
        ];

        // Сохраняем метаданные задачи в Redis для отслеживания
        Redis::setex(
            "task:pending:{$taskId}",
            3600, // TTL 1 час
            json_encode($taskData)
        );

        // Увеличиваем счетчик задач в очереди
        Redis::incr('tasks:queue:count');

        // Отправляем в Redis очередь
        AssignTaskJob::dispatch($taskData)
            ->onQueue('task-assignment');

        return response()->json([
            'success' => true,
            'message' => 'Task queued for assignment in Redis',
            'data' => [
                'task_id' => $taskId,
                'priority' => $priority,
                'queue_position' => Redis::llen('queues:task-assignment')
            ]
        ], 202);
    }

    /**
     * Получить задачу по task_id
     */
    public function getTaskByTaskId(string $taskId): JsonResponse
    {
        // Сначала проверяем в PostgreSQL
        $task = Task::where('task_id', $taskId)->first();

        if ($task) {
            $task->load(['user:id,first_name,last_name,weight', 'parent:id,task_id,title']);

            return response()->json([
                'success' => true,
                'status' => 'completed',
                'data' => $task
            ], 200);
        }

        // Проверяем, обрабатывается ли задача
        $processing = Redis::get("task:processing:{$taskId}");
        if ($processing) {
            return response()->json([
                'success' => true,
                'status' => 'processing',
                'message' => 'Task is being processed',
                'data' => [
                    'task_id' => $taskId,
                    'started_at' => $processing
                ]
            ], 200);
        }

        // Проверяем, в очереди ли задача
        $pending = Redis::get("task:pending:{$taskId}");
        if ($pending) {
            return response()->json([
                'success' => true,
                'status' => 'pending',
                'message' => 'Task is waiting in queue',
                'data' => json_decode($pending, true)
            ], 200);
        }

        // Проверяем, упала ли задача
        $failed = Redis::get("task:failed:{$taskId}");
        if ($failed) {
            return response()->json([
                'success' => false,
                'status' => 'failed',
                'data' => json_decode($failed, true)
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Task not found'
        ], 404);
    }

    /**
     * Перераспределить задачу
     */
    public function reassignTask(string $taskId): JsonResponse
    {
        $task = Task::where('task_id', $taskId)->first();

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $assignedUser = $this->assignmentService->reassignTask($task);

        if (!$assignedUser) {
            return response()->json([
                'success' => false,
                'message' => 'No suitable user found for reassignment'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Task reassigned successfully',
            'data' => $task->fresh()->load('user:id,first_name,last_name')
        ], 200);
    }

    /**
     * Получить статистику очереди
     */
    public function getQueueStats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'pending_tasks' => Redis::llen('queues:task-assignment'),
                'total_queued' => Redis::get('tasks:queue:count') ?? 0,
                'processing_tasks' => Redis::keys('task:processing:*') ? count(Redis::keys('task:processing:*')) : 0,
            ]
        ], 200);
    }
}
