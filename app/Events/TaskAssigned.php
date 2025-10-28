<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskAssigned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Task $task
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel('tasks');
    }

    public function broadcastAs(): string
    {
        return 'task.assigned';
    }
    public function broadcastWith(): array
    {
        return [
            'task_id' => $this->task->task_id,
            'title' => $this->task->title,
            'priority' => $this->task->priority,
            'weight' => $this->task->weight,
            'user_id' => $this->task->user_id,
            'parameters' => $this->task->parameters,
            'assigned_at' => $this->task->assigned_at->toISOString(),
        ];
    }
}
