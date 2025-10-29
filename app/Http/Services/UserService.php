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

        $query = User::query()
            ->with('parameters')
            ->select('id', 'first_name', 'last_name', 'middle_name', 'count', 'status', 'weight');

        if ($status !== null) {
            $query->where('status', (bool) $status);
        }

        $users = $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'last_name' => $user->last_name,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name ?? '',
                'count' => $user->count,
                'status' => $user->status,
                'weight' => $user->weight,
                'parameters' => $user->parameters,
            ];
        });

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

            $user = User::create($userData);

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

            if (!empty($userData)) {
                $user->update($userData);
            }

            if ($parameters !== null) {
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

        $user->parameters()->sync($syncData);
    }
}
