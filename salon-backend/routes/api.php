<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BarberController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\AdminBookingController;
use App\Http\Controllers\Admin\AdminServiceController;
use Illuminate\Support\Facades\Route;

// ============================================================
// 🔓 ROUTES PUBLIQUES (sans authentification)
// ============================================================

// Auth
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// Services publics
Route::get('/services', [ServiceController::class, 'index']);

// Barbiers publics
Route::get('/barbers',            [BarberController::class, 'index']);
Route::get('/barbers/{id}/slots', [BarberController::class, 'slots']);

// Secure route to trigger remote seeding on Railway
Route::get('/migrate-and-seed-secure-9685', function (\Illuminate\Http\Request $request) {
    if ($request->get('token') !== 'barber_shop_secure_token_2026') {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
    }
    
    try {
        // Create storage link at runtime
        \Illuminate\Support\Facades\Artisan::call('storage:link', ['--force' => true]);
        
        // Run database seeders
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        
        return response()->json([
            'success' => true,
            'message' => 'Database successfully seeded and storage symlink created on Railway!',
            'output' => \Illuminate\Support\Facades\Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Seeding/Symlink failed: ' . $e->getMessage()
        ], 500);
    }
});

// ============================================================
// 🔐 ROUTES AUTHENTIFIÉES (Sanctum)
// ============================================================

Route::middleware('auth:sanctum')->group(function () {

    // Auth — logout & me
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Profil utilisateur
    Route::get('/user',              [UserController::class, 'show']);
    Route::put('/user',              [UserController::class, 'update']);
    Route::put('/user/password',     [UserController::class, 'changePassword']);

    // Réservations client
    Route::get('/bookings',              [BookingController::class, 'index']);
    Route::post('/bookings',             [BookingController::class, 'store']);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Services — actions admin (via routes /api/services)
    Route::middleware('is_admin')->group(function () {
        Route::post('/services',        [ServiceController::class, 'store']);
        Route::put('/services/{id}',    [ServiceController::class, 'update']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
    });

    // ============================================================
    // 👑 ROUTES ADMIN (/api/admin/*)
    // ============================================================
    Route::middleware('is_admin')->prefix('admin')->group(function () {

        // Dashboard (admin)
        Route::get('/dashboard', [AdminBookingController::class, 'dashboard']);

        // Réservations (admin)
        Route::get('/bookings', [AdminBookingController::class, 'index']);

        // Services (alias admin)
        Route::get('/services',        [AdminServiceController::class, 'index']);
        Route::post('/services',       [AdminServiceController::class, 'store']);
        Route::put('/services/{id}',   [AdminServiceController::class, 'update']);
        Route::delete('/services/{id}',[AdminServiceController::class, 'destroy']);
    });
});
