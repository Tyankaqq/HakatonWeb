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
     */
    public function index(Request $request): JsonResponse
    {
        return $this->parameterService->getParameters($request);
    }

    /**
     * Создать параметр
     */
    public function store(Request $request): JsonResponse
    {
        return $this->parameterService->create($request);
    }

    /**
     * Получить конкретный параметр
     */
    public function show(Parameter $parameter): JsonResponse
    {
        return $this->parameterService->getParameterById($parameter);
    }

    /**
     * Обновить параметр
     */
    public function update(Request $request, Parameter $parameter): JsonResponse
    {
        return $this->parameterService->update($request, $parameter);
    }

    /**
     * Удалить параметр
     */
    public function destroy(Parameter $parameter): JsonResponse
    {
        return $this->parameterService->delete($parameter);
    }
}
