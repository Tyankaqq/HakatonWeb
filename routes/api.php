<?php

use App\Http\Controllers\Api\ParameterController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware([\App\Http\Middleware\Cors::class])->group(function () {

    // Users routes
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::get('users/{user}/stats', [UserController::class, 'stats']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::patch('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);


    Route::prefix('reports')->group(function () {
        Route::get('/active-users-workload', [UserController::class, 'getActiveUsersWithWorkload']);
    });

    // Parameters routes
    Route::get('parameters', [ParameterController::class, 'index']);
    Route::post('parameters', [ParameterController::class, 'store']);
    Route::get('parameters/{parameter}', [ParameterController::class, 'show']);
    Route::put('parameters/{parameter}', [ParameterController::class, 'update']);
    Route::patch('parameters/{parameter}', [ParameterController::class, 'update']);
    Route::delete('parameters/{parameter}', [ParameterController::class, 'destroy']);

    // Tasks routes
    Route::get('tasks/queue/stats', [TaskController::class, 'queueStats']);
    Route::get('tasks', [TaskController::class, 'index']);
    Route::post('tasks', [TaskController::class, 'store']);
    Route::get('tasks/{taskId}', [TaskController::class, 'show']);
    Route::post('tasks/{taskId}/reassign', [TaskController::class, 'reassign']);
});
