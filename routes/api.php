<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FlagController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ============================================
    // USERS
    // ============================================
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::patch('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    // Флаги пользователя
    Route::get('/users/{user}/flags', [UserController::class, 'getFlags']);
    Route::post('/users/{user}/flags', [UserController::class, 'attachFlag']);
    Route::put('/users/{user}/flags/{flag}', [UserController::class, 'updateFlag']);
    Route::delete('/users/{user}/flags/{flag}', [UserController::class, 'detachFlag']);

    // ============================================
    // FLAGS
    // ============================================
    Route::get('/flags', [FlagController::class, 'index']);
    Route::post('/flags', [FlagController::class, 'store']);
    Route::get('/flags/{flag}', [FlagController::class, 'show']);
    Route::put('/flags/{flag}', [FlagController::class, 'update']);
    Route::patch('/flags/{flag}', [FlagController::class, 'update']);
    Route::delete('/flags/{flag}', [FlagController::class, 'destroy']);

    Route::get('/flags/{flag}/users', [FlagController::class, 'getUsers']);
    Route::post('/flags/{flag}/activate', [FlagController::class, 'activate']);
    Route::post('/flags/{flag}/deactivate', [FlagController::class, 'deactivate']);
});
