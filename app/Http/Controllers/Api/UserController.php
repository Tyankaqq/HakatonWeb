<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Services\UserService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    /**
     * Получить список пользователей
     */
    public function index(Request $request): JsonResponse
    {
        return $this->userService->getUsers($request);
    }

    /**
     * Получить активных пользователей с количеством заявок в работе
     */
    public function getActiveUsersWithWorkload(Request $request): JsonResponse
    {
        $users = User::all()
            ->map(function ($user) {
                return [
                    'full_name' => trim("{$user->first_name} {$user->last_name} " . ($user->middle_name ?? '')),
                    'open_tasks_count' => $user->getOpenTasksCount(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $users
        ], 200);
    }

    /**
     * Создать пользователя
     */
    public function store(Request $request): JsonResponse
    {
        return $this->userService->create($request);
    }

    /**
     * Получить конкретного пользователя
     */
    public function show(User $user): JsonResponse
    {
        return $this->userService->getUserById($user);
    }

    /**
     * Обновить пользователя
     */
    public function update(Request $request, User $user): JsonResponse
    {
        return $this->userService->update($request, $user);
    }

    /**
     * Удалить пользователя
     */
    public function destroy(User $user): JsonResponse
    {
        return $this->userService->delete($user);
    }

    /**
     * Получить статистику пользователя
     */
    public function stats(User $user): JsonResponse
    {
        return $this->userService->getUserStats($user);
    }
}
