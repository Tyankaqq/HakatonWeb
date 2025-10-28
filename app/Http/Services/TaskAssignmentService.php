<?php

namespace App\Http\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TaskAssignmentService
{
    /**
     * Назначить задачу подходящему исполнителю
     */
    public function assignTaskToUser(Task $task): ?User
    {
        // Находим всех подходящих кандидатов
        $candidates = $this->findSuitableUsers($task);

        if ($candidates->isEmpty()) {
            return null;
        }

        // Выбираем лучшего кандидата с минимальной загрузкой
        $bestCandidate = $this->selectBestCandidate($candidates);

        return $this->assignUser($task, $bestCandidate);
    }

    /**
     * Найти всех подходящих пользователей
     */
    private function findSuitableUsers(Task $task)
    {
        // Получаем всех активных пользователей
        $users = User::where('status', true)
            ->with('parameters')
            ->get();

        // Фильтруем пользователей по критериям
        $suitableUsers = $users->filter(function ($user) use ($task) {
            return $this->canUserHandleTask($user, $task, false);
        });

        return $suitableUsers;
    }

    /**
     * Проверить, может ли пользователь обработать задачу
     */
    public function canUserHandleTask(User $user, Task $task, bool $skipDailyLimit = false): bool
    {
        // 1. Проверка активности
        if (!$user->status) {
            return false;
        }

        // 2. Проверка суточного лимита (пропускаем для дочерних задач от родителя)
        if (!$skipDailyLimit && $user->hasReachedDailyLimit()) {
            return false;
        }

        // 3. Проверка веса (сложности)
        // Исполнитель должен быть достаточно опытным для сложной задачи
        // Формула: weight пользователя >= 60% от веса задачи
        $requiredWeight = ceil($task->weight * 0.6);
        if ($user->weight < $requiredWeight) {
            return false;
        }

        // 4. Проверка соответствия параметрам
        $taskParameters = $task->parameters;
        $userParameters = $user->parameters->keyBy('id');

        foreach ($taskParameters as $taskParam) {
            $parameterId = $taskParam['parameter_id'];
            $requiredValue = $taskParam['value'];
            $operator = $taskParam['comparison_operator'] ?? '=';

            // Проверяем, есть ли у пользователя этот параметр
            if (!$userParameters->has($parameterId)) {
                return false;
            }

            $userParam = $userParameters->get($parameterId);
            $userValue = json_decode($userParam->pivot->value, true);

            // Сравниваем значения
            if (!$this->compareValues($userValue, $requiredValue, $operator)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Выбрать лучшего кандидата (с минимальной загрузкой)
     * КЛЮЧЕВАЯ ЛОГИКА: Балансировка нагрузки
     */
    private function selectBestCandidate($candidates)
    {
        // Сортируем по количеству открытых задач (от меньшего к большему)
        return $candidates->sortBy(function ($user) {
            return $user->getOpenTasksCount();
        })->first();
    }

    /**
     * Назначить пользователя на задачу
     */
    private function assignUser(Task $task, User $user): User
    {
        $task->update([
            'user_id' => $user->id,
            'assigned_at' => now(),
        ]);

        return $user;
    }

    /**
     * Сравнить значения параметров
     */
    private function compareValues($userValue, $requiredValue, string $operator): bool
    {
        return match($operator) {
            '=' => $userValue == $requiredValue,
            '!=' => $userValue != $requiredValue,
            '>' => $userValue > $requiredValue,
            '<' => $userValue < $requiredValue,
            '>=' => $userValue >= $requiredValue,
            '<=' => $userValue <= $requiredValue,
            default => false,
        };
    }

    /**
     * Перераспределить задачу
     */
    public function reassignTask(Task $task): ?User
    {
        // Снимаем текущего исполнителя
        $task->update([
            'user_id' => null,
            'assigned_at' => null,
        ]);

        // Назначаем нового
        return $this->assignTaskToUser($task);
    }

    public function findUserForTask(Task $task): ?User
    {
        // Находим всех подходящих кандидатов
        $candidates = $this->findSuitableUsers($task);

        if ($candidates->isEmpty()) {
            return null;
        }

        // Выбираем лучшего кандидата с минимальной загрузкой
        return $this->selectBestCandidate($candidates);
    }
}
