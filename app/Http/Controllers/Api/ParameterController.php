<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Services\ParameterService;
use App\Models\Parameter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParameterController extends Controller
{
    public function __construct(
        private ParameterService $parameterService
    ) {}

    /**
     * Получить список параметров
     * GET /api/v1/parameters
     */
    public function index(Request $request): JsonResponse
    {
        return $this->parameterService->getParameters($request);
    }

    /**
     * Создать параметр
     * POST /api/v1/parameters
     */
    public function store(Request $request): JsonResponse
    {
        return $this->parameterService->create($request);
    }

    /**
     * Получить конкретный параметр
     * GET /api/v1/parameters/{parameter}
     */
    public function show(Parameter $parameter): JsonResponse
    {
        return $this->parameterService->getParameterById($parameter);
    }

    /**
     * Обновить параметр
     * PUT/PATCH /api/v1/parameters/{parameter}
     */
    public function update(Request $request, Parameter $parameter): JsonResponse
    {
        return $this->parameterService->update($request, $parameter);
    }

    /**
     * Удалить параметр
     * DELETE /api/v1/parameters/{parameter}
     */
    public function destroy(Parameter $parameter): JsonResponse
    {
        return $this->parameterService->delete($parameter);
    }
}
