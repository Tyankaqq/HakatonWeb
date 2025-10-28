<?php

namespace App\Http\Services;

use App\Models\User;
use App\Models\Parameter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserService
{
    /**
     * Получить список пользователей
     */
    public function getUsers(Request $request): JsonResponse
    {
        $status = $request->input('status');

        $query = User::query()->with('parameters');

        // Фильтрация по статусу
        if ($status !== null) {
            $query->where('status', (bool) $status);
        }

        // Добавляем количество открытых задач
        if ($request->has('with_tasks_count')) {
            $query->withCount([
                'tasks as open_tasks_count' => function ($query) {
                    $query->whereIn('status', ['assigned', 'in_progress']);
                },
                'tasks as today_tasks_count' => function ($query) {
                    $query->whereDate('created_at', today());
                }
            ]);
        }

        $users = $query->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ], 200);
    }


    /**
     * Создать пользователя с параметрами
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'status' => 'nullable|boolean',
            'daily_limit' => 'nullable|integer|min:1',
            'weight' => 'nullable|integer|min:1|max:10',
            'parameters' => 'nullable|array',
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

        DB::beginTransaction();

        try {
            $userData = $validator->validated();
            $parameters = $userData['parameters'] ?? [];
            unset($userData['parameters']);

            // Создаем пользователя
            $user = User::create($userData);

            // Прикрепляем параметры
            if (!empty($parameters)) {
                $this->syncParameters($user, $parameters);
            }

            DB::commit();

            $user->load('parameters');

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Получить пользователя по ID
     */
    public function getUserById(User $user): JsonResponse
    {
        $user->load('parameters');

        // Добавляем статистику
        $user->open_tasks_count = $user->getOpenTasksCount();
        $user->today_tasks_count = $user->getTodayTasksCount();

        return response()->json([
            'success' => true,
            'data' => $user
        ], 200);
    }

    /**
     * Обновить пользователя с параметрами
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'status' => 'nullable|boolean',
            'daily_limit' => 'nullable|integer|min:1',
            'weight' => 'nullable|integer|min:1|max:10',
            'parameters' => 'nullable|array',
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

        DB::beginTransaction();

        try {
            $userData = $validator->validated();
            $parameters = $userData['parameters'] ?? null;
            unset($userData['parameters']);

            // Обновляем основные данные пользователя
            if (!empty($userData)) {
                $user->update($userData);
            }

            // Обновляем параметры (если переданы)
            if ($parameters !== null) {
                // Полная синхронизация - удаляем старые, добавляем новые
                $this->syncParameters($user, $parameters);
            }

            DB::commit();

            $user->load('parameters');

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User updated successfully'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Удалить пользователя
     */
    public function delete(User $user): JsonResponse
    {
        // Проверяем, есть ли у пользователя активные задачи
        $activeTasks = $user->tasks()
            ->whereIn('status', ['assigned', 'in_progress'])
            ->count();

        if ($activeTasks > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete user. User has {$activeTasks} active task(s)"
            ], 409);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ], 200);
    }

    /**
     * Получить статистику пользователя
     */
    public function getUserStats(User $user): JsonResponse
    {
        $stats = [
            'user_id' => $user->id,
            'full_name' => trim("{$user->first_name} {$user->last_name} {$user->middle_name}"),
            'status' => $user->status,
            'daily_limit' => $user->daily_limit,
            'weight' => $user->weight,
            'open_tasks_count' => $user->getOpenTasksCount(),
            'today_tasks_count' => $user->getTodayTasksCount(),
            'daily_limit_reached' => $user->hasReachedDailyLimit(),
            'tasks_by_status' => $user->tasks()
                ->select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status'),
            'tasks_by_priority' => $user->tasks()
                ->select('priority', DB::raw('count(*) as count'))
                ->groupBy('priority')
                ->pluck('count', 'priority'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ], 200);
    }

    /**
     * Синхронизация параметров пользователя
     * (приватный метод для внутреннего использования)
     */
    private function syncParameters(User $user, array $parameters): void
    {
        // Формируем массив для sync
        $syncData = [];

        foreach ($parameters as $param) {
            $syncData[$param['parameter_id']] = [
                'value' => json_encode($param['value']),
                'comparison_operator' => $param['comparison_operator'] ?? '='
            ];
        }

        // sync() автоматически удалит старые и добавит новые связи
        $user->parameters()->sync($syncData);
    }
}
