<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserService
{
    public function getUser(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }


        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ILIKE', "%{$search}%")
                    ->orWhere('last_name', 'ILIKE', "%{$search}%");
            });
        }

        $users = $query->with('flags')->get();

        return response()->json($users);
    }

    public function create(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive'
        ]);

        $user = User::create($validated);

        return response()->json([
            'message' => 'Пользователь успешно создан',
            'user' => $user
        ], 201);
    }

    public function getUserById(User $user): JsonResponse
    {
        return response()->json([
            'user' => $user->load('flags'),
            'flags_array' => $user->getFlagsArray()
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'status' => 'sometimes|in:active,inactive'
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Пользователь успешно обновлен',
            'user' => $user->fresh()
        ]);
    }

    public function delete(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'Пользователь успешно удален'
        ]);
    }

    public function getFlags(User $user): JsonResponse
    {
        return response()->json([
            'user_id' => $user->id,
            'flags' => $user->flags,
            'flags_array' => $user->getFlagsArray()
        ]);
    }

    public function attachFlag(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'flag_id' => 'required|exists:flags,id',
            'value' => 'required'
        ]);

        $user->setFlag($validated['flag_id'], $validated['value']);

        return response()->json([
            'message' => 'Флаг успешно прикреплен',
            'flags' => $user->fresh()->flags
        ]);
    }

    public function detachFlag(User $user, int $flagId): JsonResponse
    {
        $user->flags()->detach($flagId);

        return response()->json([
            'message' => 'Флаг успешно откреплен',
            'flags' => $user->fresh()->flags
        ]);
    }

    public function updateFlag(Request $request, User $user, int $flagId): JsonResponse
    {
        $validated = $request->validate([
            'value' => 'required|string|max:255'
        ]);

        $user->flags()->updateExistingPivot($flagId, [
            'value' => $validated['value']
        ]);

        return response()->json([
            'message' => 'Значение флага успешно обновлено',
            'flags' => $user->fresh()->flags
        ]);
    }
}
