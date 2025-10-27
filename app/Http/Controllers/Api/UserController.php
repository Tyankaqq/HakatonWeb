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
        return $this->userService->getUser($request);
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
     * Получить флаги пользователя
     * GET /api/v1/users/{user}/flags
     */
    public function getFlags(User $user): JsonResponse
    {
        return $this->userService->getFlags($user);
    }

    /**
     * Прикрепить флаг к пользователю
     * POST /api/v1/users/{user}/flags
     */
    public function attachFlag(Request $request, User $user): JsonResponse
    {
        return $this->userService->attachFlag($request, $user);
    }

    /**
     * Обновить значение флага
     * PUT /api/v1/users/{user}/flags/{flag}
     */
    public function updateFlag(Request $request, User $user, int $flag): JsonResponse
    {
        return $this->userService->updateFlag($request, $user, $flag);
    }

    /**
     * Открепить флаг от пользователя
     * DELETE /api/v1/users/{user}/flags/{flag}
     */
    public function detachFlag(User $user, int $flag): JsonResponse
    {
        return $this->userService->detachFlag($user, $flag);
    }
}
