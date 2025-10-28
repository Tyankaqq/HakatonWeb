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

class AssignTaskJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    public $timeout = 30;

    public function __construct(public array $taskData) {}

    public function handle(TaskAssignmentService $assignmentService): void
    {
        $taskId = $this->taskData['task_id'];
        $startTime = microtime(true);

        try {
            $task = new Task([
                'task_id' => $taskId,
                'title' => $this->taskData['title'],
                'priority' => $this->taskData['priority'],
                'weight' => $this->taskData['weight'],
                'parameters' => $this->taskData['parameters'],
            ]);

            $assignedUser = $assignmentService->findUserForTask($task);
            $executionTime = round((microtime(true) - $startTime) * 1000, 2);

            DB::table('tasks')->insert([
                'task_id' => $taskId,
                'title' => $this->taskData['title'],
                'priority' => $this->taskData['priority'],
                'weight' => $this->taskData['weight'],
                'user_id' => $assignedUser->id,
                'parameters' => json_encode($this->taskData['parameters']),
                'assigned_at' => now(),
                'execution_time_ms' => $executionTime,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('users')
                ->where('id', $assignedUser->id)
                ->increment('count');

        } catch (\Exception $e) {
            throw $e;
        }
    }
}
