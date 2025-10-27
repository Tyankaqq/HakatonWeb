<?php

namespace App\Http\Services;

use App\Models\Flag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FlagService
{
    public function getAllFlag(Request $request)
    {
        $query = Flag::query();

        if ($request->has('key')) {
            $query->where('key', $request->key);
        }

        if ($request->has('active')) {
            $query->where('is_active', true);
        }

        if ($request->has('grouped') && $request->grouped == 'true') {
            $flags = $query->get()->groupBy('key');
            return response()->json($flags);
        }

        $flags = $query->get();

        return response()->json($flags);
    }

    public function create(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        // Проверка уникальности комбинации key+value
        if (Flag::where('key', $validated['key'])
            ->where('value', $validated['value'])
            ->exists()) {
            return response()->json([
                'error' => 'Флаг с таким ключом и значением уже существует'
            ], 422);
        }

        $flag = Flag::create($validated);

        return response()->json([
            'message' => 'Флаг успешно создан',
            'flag' => $flag
        ], 201);
    }

    public function getFlagById(Flag $flag): JsonResponse
    {
        return response()->json([
            'flag' => $flag->load('users')
        ]);
    }

    public function update(Request $request, Flag $flag): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'sometimes|string|max:255',
            'value' => 'sometimes|string|max:255',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $flag->update($validated);

        return response()->json([
            'message' => 'Флаг успешно обновлен',
            'flag' => $flag->fresh()
        ]);
    }

    public function delete(Flag $flag): JsonResponse
    {
        if ($flag->users()->count() > 0) {
            return response()->json([
                'error' => 'Невозомжно удалить, т.к. этот флаг прикреплен к пользователю(-ям)',
                'users_count' => $flag->users()->count()
            ], 422);
        }

        $flag->delete();

        return response()->json([
            'message' => 'Флаг успешно удален'
        ]);
    }

    public function getUsers(Flag $flag): JsonResponse
    {
        return response()->json([
            'flag' => $flag,
            'users' => $flag->users
        ]);
    }

    public function deactivate(Flag $flag): JsonResponse
    {
        $flag->update(['is_active' => false]);

        return response()->json([
            'message' => 'Флаг успешно отключен',
            'flag' => $flag
        ]);
    }

    public function activate(Flag $flag): JsonResponse
    {
        $flag->update(['is_active' => true]);

        return response()->json([
            'message' => 'Флаг успешно включен',
            'flag' => $flag
        ]);
    }
}
