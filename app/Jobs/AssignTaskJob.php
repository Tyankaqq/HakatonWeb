<?php

namespace App\Jobs;

use App\Http\Services\TaskAssignmentService;
use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class AssignTaskJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1; // Уменьшили попытки
    public $timeout = 30; // Уменьшили timeout

    public function __construct(public array $taskData) {}

    public function handle(TaskAssignmentService $assignmentService): void
    {
        $taskId = $this->taskData['task_id'];

        try {
            // БЕЗ transaction
            $task = new Task([
                'task_id' => $taskId,
                'title' => $this->taskData['title'],
                'priority' => $this->taskData['priority'],
                'weight' => $this->taskData['weight'],
                'parameters' => $this->taskData['parameters'],
            ]);

            $assignedUser = $assignmentService->findUserForTask($task);

            // Используйте Query Builder вместо Eloquent
            DB::table('tasks')->insert([
                'task_id' => $taskId,
                'title' => $this->taskData['title'],
                'priority' => $this->taskData['priority'],
                'weight' => $this->taskData['weight'],
                'user_id' => $assignedUser->id,
                'parameters' => json_encode($this->taskData['parameters']),
                'assigned_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        } catch (\Exception $e) {
            throw $e;
        }
    }

}
