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
     * GET /api/v1/users
     */
    public function index(Request $request): JsonResponse
    {
        return $this->userService->getUsers($request);
    }

    /**
     * Создать пользователя
     * POST /api/v1/users
     */
    public function store(Request $request): JsonResponse
    {
        return $this->userService->create($request);
    }

    /**
     * Получить конкретного пользователя
     * GET /api/v1/users/{user}
     */
    public function show(User $user): JsonResponse
    {
        return $this->userService->getUserById($user);
    }

    /**
     * Обновить пользователя
     * PUT/PATCH /api/v1/users/{user}
     */
    public function update(Request $request, User $user): JsonResponse
    {
        return $this->userService->update($request, $user);
    }

    /**
     * Удалить пользователя
     * DELETE /api/v1/users/{user}
     */
    public function destroy(User $user): JsonResponse
    {
        return $this->userService->delete($user);
    }

    /**
     * Получить статистику пользователя
     * GET /api/v1/users/{user}/stats
     */
    public function stats(User $user): JsonResponse
    {
        return $this->userService->getUserStats($user);
    }
}
