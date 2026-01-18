<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('/products', ProductController::class);

Route::prefix('/user')->group(function () {
    Route::middleware('auth:sanctum')->post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);

    Route::middleware(['auth:sanctum'])->post('/logout', [UserController::class, 'logout']);

    Route::middleware(['auth:sanctum'])->delete('/{id}', [UserController::class, 'deleteUser']);
});

Route::middleware('auth:sanctum')->apiResource('/carts', CartController::class);
