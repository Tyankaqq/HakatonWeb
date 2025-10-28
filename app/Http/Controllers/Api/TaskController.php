<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {}

    /**
     * Получить список задач
     * GET /api/v1/tasks
     */
    public function index(Request $request): JsonResponse
    {
        return $this->taskService->getTasks($request);
    }

    /**
     * Создать задачу и отправить в очередь
     * POST /api/v1/tasks
     */
    public function store(Request $request): JsonResponse
    {
        return $this->taskService->create($request);
    }

    /**
     * Получить задачу по task_id
     * GET /api/v1/tasks/{taskId}
     */
    public function show(string $taskId): JsonResponse
    {
        return $this->taskService->getTaskByTaskId($taskId);
    }

    /**
     * Перераспределить задачу
     * POST /api/v1/tasks/{taskId}/reassign
     */
    public function reassign(string $taskId): JsonResponse
    {
        return $this->taskService->reassignTask($taskId);
    }

    /**
     * Получить статистику очереди
     * GET /api/v1/tasks/queue/stats
     */
    public function queueStats(): JsonResponse
    {
        return $this->taskService->getQueueStats();
    }
}
