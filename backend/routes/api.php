<?php

use App\Http\Controllers\Api\Authentication\AuthController;
use App\Http\Controllers\Api\Authentication\EmailVerificationController;
use App\Http\Controllers\Api\Authentication\PasswordResetController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [EmailVerificationController::class, 'register'])->middleware('throttle:5,1');
Route::post('/email/verify', [EmailVerificationController::class, 'verify'])->middleware('throttle:10,1');
Route::post('/email/resend', [EmailVerificationController::class, 'resend'])->middleware('throttle:3,1');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
