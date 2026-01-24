<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Authenticated user info - limit: userRate
Route::middleware(['auth:sanctum', 'throttle:userRate'])->get('/user', function (Request $request) {
    return $request->user();
});


// Products - limit: productRate
Route::middleware('throttle:productRate')->apiResource('/products', ProductController::class);


// User routes - limit: userRate
Route::prefix('/user')->middleware('throttle:userRate')->group(function () {
    Route::middleware('auth:sanctum')->post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);

    Route::middleware(['auth:sanctum'])->post('/logout', [UserController::class, 'logout']);

    Route::middleware(['auth:sanctum'])->delete('/{id}', [UserController::class, 'deleteUser']);
});


// Carts - limit: cartRate
Route::middleware(['auth:sanctum', 'throttle:cartRate'])->apiResource('/carts', CartController::class);


// Orders & Checkout - limit: checkoutRate
Route::prefix('/orders')->middleware(['auth:sanctum', 'throttle:checkoutRate'])->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/summary', [OrderController::class, 'orderSummary']);

    // url for payment gateway
    Route::prefix('/checkout')->group(function () {
        // Cash payment
        Route::post('/cash', [OrderController::class, 'cashCheckout']);

        // KHQR payment
        Route::prefix('/qr')->group(function () {
            Route::post('/', [PaymentController::class, 'qrCheckout']);
            Route::post('/verify', [PaymentController::class, 'verifyTransaction']);
        });
    });
});
