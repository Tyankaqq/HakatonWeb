<?php

namespace App\Http\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TaskAssignmentService
{
    public function findUserForTask(Task $task): ?User
    {
        $matchesByParameters = $this->findUsersByParameters($task);

        if ($matchesByParameters->isEmpty()) {
            return User::where('status', true)
                ->orderBy('count', 'asc')
                ->first() ?? User::orderBy('count', 'asc')->first();
        }

        $matchesByWeight = $this->filterByWeightRange($matchesByParameters, $task);

        if ($matchesByWeight->isNotEmpty()) {
            return $matchesByWeight->sortBy('count')->first();
        }

        return null;
    }

    private function filterByWeightRange($users, Task $task)
    {
        $taskWeight = $task->weight;

        // Определяем диапазон задачи
        if ($taskWeight >= 0 && $taskWeight <= 3) {
            $minWeight = 0;
            $maxWeight = 3;
        } elseif ($taskWeight >= 4 && $taskWeight <= 6) {
            $minWeight = 4;
            $maxWeight = 6;
        } else { // 7-10
            $minWeight = 7;
            $maxWeight = 10;
        }

        // Фильтруем пользователей по диапазону
        return $users->filter(function ($user) use ($minWeight, $maxWeight) {
            return $user->weight >= $minWeight && $user->weight <= $maxWeight;
        });
    }

    private function selectBestCandidate($candidates, Task $task)
    {
        $taskWeight = $task->weight;

        return $candidates
            ->map(function ($user) use ($taskWeight) {
                $user->weight_distance = abs($user->weight - $taskWeight);
                return $user;
            })
            ->sortBy([
                ['weight_distance', 'asc'],
                ['count', 'asc'],
                ['id', 'asc'],
            ])
            ->first();
    }

    private function findUsersByParameters(Task $task)
    {
        $users = User::where('status', true)
            ->with(['parameters' => function ($query) {
                $query->select('parameters.id', 'user_id', 'parameter_id', 'value');
            }])
            ->select('id', 'weight', 'count', 'status')
            ->get();

        return $users->filter(function ($user) use ($task) {
            $taskParameters = $task->parameters;

            if (empty($taskParameters)) {
                return true;
            }

            $userParameters = $user->parameters->keyBy('parameter_id');

            foreach ($taskParameters as $taskParam) {
                $parameterId = $taskParam['parameter_id'];

                if (!$userParameters->has($parameterId)) {
                    return false;
                }

                $userParam = $userParameters->get($parameterId);
                $userValue = json_decode($userParam->pivot->value, true);
                $requiredValue = $taskParam['value'];
                $operator = $taskParam['comparison_operator'] ?? '=';

                if (!$this->compareValues($userValue, $requiredValue, $operator)) {
                    return false;
                }
            }

            return true;
        });
    }

    private function compareValues($userValue, $requiredValue, string $operator): bool
    {
        switch ($operator) {
            case '=': return $userValue == $requiredValue;
            case '!=': return $userValue != $requiredValue;
            case '>': return $userValue > $requiredValue;
            case '<': return $userValue < $requiredValue;
            case '>=': return $userValue >= $requiredValue;
            case '<=': return $userValue <= $requiredValue;
            default: return false;
        }
    }

    public function assignTaskToUser(Task $task): ?User
    {
        $user = $this->findUserForTask($task);

        if (!$user) {
            return null;
        }

        DB::table('tasks')
            ->where('id', $task->id)
            ->update([
                'user_id' => $user->id,
                'assigned_at' => now(),
                'updated_at' => now(),
            ]);

        DB::table('users')
            ->where('id', $user->id)
            ->increment('count');

        return $user;
    }

    public function reassignTask(Task $task): ?User
    {
        if ($task->user_id) {
            DB::table('users')
                ->where('id', $task->user_id)
                ->decrement('count');
        }

        DB::table('tasks')
            ->where('id', $task->id)
            ->update([
                'user_id' => null,
                'assigned_at' => null,
                'updated_at' => now(),
            ]);

        return $this->assignTaskToUser($task);
    }
}
