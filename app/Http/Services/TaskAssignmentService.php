<?php

namespace App\Http\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaskAssignmentService
{
    // Кеш пользователей на уровне процесса (живет пока работает worker)
    private static $cachedUsers = null;
    private static $cacheTime = null;
    private static $userTaskCounts = []; // Кеш счетчика задач

    public function findUserForTask(Task $task): ?User
    {
        // Уровни поиска с ранним выходом
        foreach (['perfect', 'good', 'partial', 'active_only'] as $level) {
            $matches = $this->findSuitableUsers($task, $level);
            if ($matches->isNotEmpty()) {
                return $this->selectBestCandidate($matches);
            }
        }

        // Fallback: любой активный
        return User::where('status', true)->first() ?? User::first();
    }

    private function findSuitableUsers(Task $task, string $matchLevel = 'perfect')
    {
        $now = time();

        // ОПТИМИЗАЦИЯ 1: Кеширование на 10 секунд вместо 5
        if (self::$cachedUsers === null || (self::$cacheTime + 10) < $now) {
            // ОПТИМИЗАЦИЯ 2: Загружаем только нужные поля
            self::$cachedUsers = User::where('status', true)
                ->with(['parameters' => function ($query) {
                    $query->select('parameters.id', 'user_id', 'parameter_id', 'value');
                }])
                ->select('id', 'weight', 'daily_limit', 'status')
                ->get();
            self::$cacheTime = $now;

            // Сбрасываем счетчик задач при обновлении кеша
            self::$userTaskCounts = [];
        }

        $users = self::$cachedUsers;

        // ОПТИМИЗАЦИЯ 3: Early return для active_only
        if ($matchLevel === 'active_only') {
            return $users;
        }

        return $users->filter(function ($user) use ($task, $matchLevel) {
            // ОПТИМИЗАЦИЯ 4: Проверка лимита с кешированием
            if (!in_array($matchLevel, ['active_only', 'emergency'])) {
                if ($this->hasReachedDailyLimitCached($user)) {
                    return false;
                }
            }

            // Проверка веса только для perfect
            if ($matchLevel === 'perfect') {
                $requiredWeight = (int) ceil($task->weight * 0.6);
                if ($user->weight < $requiredWeight) {
                    return false;
                }
            }

            // ОПТИМИЗАЦИЯ 5: Предварительное извлечение параметров
            $taskParameters = $task->parameters;
            if (empty($taskParameters)) {
                return true; // Нет параметров = подходит всем
            }

            $userParameters = $user->parameters->keyBy('parameter_id');
            $matchedParams = 0;
            $totalParams = count($taskParameters);

            // ОПТИМИЗАЦИЯ 6: Ранний выход из цикла
            $requiredMatches = match($matchLevel) {
                'perfect' => $totalParams,
                'good' => (int) ceil($totalParams * 0.7),
                'partial' => (int) ceil($totalParams * 0.5),
                default => 0
            };

            foreach ($taskParameters as $taskParam) {
                $parameterId = $taskParam['parameter_id'];

                if ($userParameters->has($parameterId)) {
                    $userParam = $userParameters->get($parameterId);
                    $userValue = json_decode($userParam->pivot->value, true);
                    $requiredValue = $taskParam['value'];
                    $operator = $taskParam['comparison_operator'] ?? '=';

                    if ($this->compareValues($userValue, $requiredValue, $operator)) {
                        $matchedParams++;

                        // ОПТИМИЗАЦИЯ 7: Если уже невозможно достичь perfect match - выходим
                        if ($matchLevel === 'perfect' &&
                            ($matchedParams + ($totalParams - array_search($taskParam, $taskParameters) - 1)) < $requiredMatches) {
                            return false;
                        }
                    }
                }
            }

            return $matchedParams >= $requiredMatches;
        });
    }

    // ОПТИМИЗАЦИЯ 8: Кешированная проверка лимита
    private function hasReachedDailyLimitCached(User $user): bool
    {
        $userId = $user->id;

        // Проверяем кеш (обновляется каждые 2 секунды)
        if (!isset(self::$userTaskCounts[$userId]) ||
            (self::$userTaskCounts[$userId]['time'] + 2) < time()) {

            self::$userTaskCounts[$userId] = [
                'count' => DB::table('tasks')
                    ->where('user_id', $userId)
                    ->whereDate('assigned_at', today())
                    ->count(),
                'time' => time()
            ];
        }

        return self::$userTaskCounts[$userId]['count'] >= $user->daily_limit;
    }

    private function selectBestCandidate($candidates)
    {
        // ОПТИМИЗАЦИЯ 9: Round-robin вместо сортировки
        static $lastUserId = 0;

        // Находим следующего после последнего использованного
        $candidatesArray = $candidates->toArray();
        $count = count($candidatesArray);

        if ($count === 1) {
            return $candidates->first();
        }

        // Простая ротация
        foreach ($candidatesArray as $candidate) {
            if ($candidate['id'] > $lastUserId) {
                $lastUserId = $candidate['id'];
                return $candidates->where('id', $candidate['id'])->first();
            }
        }

        // Если дошли до конца - начинаем сначала
        $lastUserId = $candidatesArray[0]['id'];
        return $candidates->first();
    }

    private function compareValues($userValue, $requiredValue, string $operator): bool
    {
        // ОПТИМИЗАЦИЯ 10: Убрали match (немного быстрее)
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

        // ОПТИМИЗАЦИЯ 11: Используем Query Builder вместо Eloquent
        DB::table('tasks')
            ->where('id', $task->id)
            ->update([
                'user_id' => $user->id,
                'assigned_at' => now(),
                'updated_at' => now(),
            ]);

        return $user;
    }

    public function canUserHandleTask(User $user, Task $task, bool $skipDailyLimit = false): bool
    {
        if (!$user->status) {
            return false;
        }

        if (!$skipDailyLimit && $this->hasReachedDailyLimitCached($user)) {
            return false;
        }

        $requiredWeight = (int) ceil($task->weight * 0.6);
        if ($user->weight < $requiredWeight) {
            return false;
        }

        $taskParameters = $task->parameters;
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
    }

    public function reassignTask(Task $task): ?User
    {
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
