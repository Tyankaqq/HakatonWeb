<?php

namespace App\Http\Services;

use App\Models\Parameter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ParameterService
{
    /**
     * Получить список параметров
     */
    public function getParameters(Request $request): JsonResponse
    {
        $isActive = $request->input('is_active');

        $query = Parameter::query();

        // Фильтрация по активности
        if ($isActive !== null) {
            $query->where('is_active', (bool) $isActive);
        }

        // Опционально: загрузка пользователей
        if ($request->has('with_users')) {
            $query->withCount('users');
        }

        $parameters = $query->get();

        return response()->json([
            'success' => true,
            'data' => $parameters
        ], 200);
    }

    /**
     * Создать параметр
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:255|unique:parameters,key',
            'value_type' => ['required', Rule::in([
                'string',
                'integer',
                'float',
                'boolean',
                'array',
                'date',
                'datetime',
                'timestamp',
                'json'
            ])],
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $parameter = Parameter::create($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $parameter,
            'message' => 'Parameter created successfully'
        ], 201);
    }

    /**
     * Получить параметр по ID
     */
    public function getParameterById(Parameter $parameter): JsonResponse
    {
        // Загружаем связанных пользователей с pivot данными
        $parameter->load(['users' => function ($query) {
            $query->select('users.id', 'first_name', 'last_name', 'middle_name', 'status')
                ->withPivot('value', 'comparison_operator');
        }]);

        return response()->json([
            'success' => true,
            'data' => $parameter
        ], 200);
    }

    /**
     * Обновить параметр
     */
    public function update(Request $request, Parameter $parameter): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'key' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('parameters', 'key')->ignore($parameter->id)
            ],
            'value_type' => ['sometimes', 'required', Rule::in([
                'string',
                'integer',
                'float',
                'boolean',
                'array',
                'date',
                'datetime',
                'timestamp',
                'json'
            ])],
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $parameter->update($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $parameter,
            'message' => 'Parameter updated successfully'
        ], 200);
    }

    /**
     * Удалить параметр
     */
    public function delete(Parameter $parameter): JsonResponse
    {
        // Проверка: есть ли пользователи с этим параметром
        $usersCount = $parameter->users()->count();

        if ($usersCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete parameter. It is used by {$usersCount} user(s)"
            ], 409);
        }

        $parameter->delete();

        return response()->json([
            'success' => true,
            'message' => 'Parameter deleted successfully'
        ], 200);
    }
}
