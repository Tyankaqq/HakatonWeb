<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Services\FlagService;
use App\Http\Services\UserService;
use App\Models\Flag;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FlagController extends Controller
{
    public function __construct(
        private FlagService $flagService
    ) {}

    /**
     * Получить список флагов
     * GET /api/v1/flags
     */
    public function index(Request $request): JsonResponse
    {
        return $this->flagService->getAllFlag($request);
    }

    /**
     * Создать флаг
     * POST /api/v1/flags
     */
    public function store(Request $request): JsonResponse
    {
        return $this->flagService->create($request);
    }

    /**
     * Получить конкретный флаг
     * GET /api/v1/flags/{flag}
     */
    public function show(Flag $flag): JsonResponse
    {
        return $this->flagService->getFlagById($flag);
    }

    /**
     * Обновить флаг
     * PUT/PATCH /api/v1/flags/{flag}
     */
    public function update(Request $request, Flag $flag): JsonResponse
    {
        return $this->flagService->update($request, $flag);
    }

    /**
     * Удалить флаг
     * DELETE /api/v1/flags/{flag}
     */
    public function destroy(Flag $flag): JsonResponse
    {
        return $this->flagService->delete($flag);
    }

    /**
     * Получить пользователей с этим флагом
     * GET /api/v1/flags/{flag}/users
     */
    public function getUsers(Flag $flag): JsonResponse
    {
        return $this->flagService->getUsers($flag);
    }

    /**
     * Активировать флаг
     * POST /api/v1/flags/{flag}/activate
     */
    public function activate(Flag $flag): JsonResponse
    {
        return $this->flagService->activate($flag);
    }

    /**
     * Деактивировать флаг
     * POST /api/v1/flags/{flag}/deactivate
     */
    public function deactivate(Flag $flag): JsonResponse
    {
        return $this->flagService->deactivate($flag);
    }
}
