<?php

namespace App\Http\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TaskAssignmentService
{
    // Кеш пользователей на уровне процесса
    private static $cachedUsers = null;
    private static $cacheTime = null;

    public function findUserForTask(Task $task): ?User
    {
        // Находим подходящих пользователей
        $matches = $this->findSuitableUsers($task);

        if ($matches->isNotEmpty()) {
            // Выбираем с минимальным count
            return $matches->sortBy('count')->first();
        }

        // Fallback: любой активный с минимальным count
        return User::where('status', true)
            ->orderBy('count', 'asc')
            ->first() ?? User::orderBy('count', 'asc')->first();
    }

    private function findSuitableUsers(Task $task)
    {
        $now = time();

        // Кеширование на 10 секунд
        if (self::$cachedUsers === null || (self::$cacheTime + 10) < $now) {
            self::$cachedUsers = User::where('status', true)
                ->with(['parameters' => function ($query) {
                    $query->select('parameters.id', 'user_id', 'parameter_id', 'value');
                }])
                ->select('id', 'weight', 'count', 'status')
                ->get();
            self::$cacheTime = $now;
        }

        $users = self::$cachedUsers;

        return $users->filter(function ($user) use ($task) {
            // Проверка веса
            $requiredWeight = (int) ceil($task->weight * 0.6);
            if ($user->weight < $requiredWeight) {
                return false;
            }

            // Проверка параметров
            $taskParameters = $task->parameters;
            if (empty($taskParameters)) {
                return true; // Нет параметров = подходит
            }

            $userParameters = $user->parameters->keyBy('parameter_id');

            // Все параметры должны совпадать
            foreach ($taskParameters as $taskParam) {
                $parameterId = $taskParam['parameter_id'];

                if (!$userParameters->has($parameterId)) {
                    return false; // Нет параметра = не подходит
                }

                $userParam = $userParameters->get($parameterId);
                $userValue = json_decode($userParam->pivot->value, true);
                $requiredValue = $taskParam['value'];
                $operator = $taskParam['comparison_operator'] ?? '=';

                if (!$this->compareValues($userValue, $requiredValue, $operator)) {
                    return false; // Параметр не совпадает = не подходит
                }
            }

            return true; // Все параметры совпали + вес подходит
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

        DB::transaction(function () use ($task, $user) {
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
        });

        self::$cachedUsers = null;

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

        self::$cachedUsers = null;

        return $this->assignTaskToUser($task);
    }
}
