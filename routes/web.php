<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BrandProtectionController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TrackController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Fake9ja Web Routes (100% Free Public Citizen Intelligence)
|--------------------------------------------------------------------------
*/

// Home Page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Citizen Incident Reporting Wizard (100% Free)
Route::get('/report', [ReportController::class, 'create'])->name('report.create');
Route::post('/report', [ReportController::class, 'store'])->name('report.store');
Route::get('/report/success/{reference}', [ReportController::class, 'success'])->name('report.success');

// Community Incidents & Hotspots Radar
Route::get('/community', [CommunityController::class, 'index'])->name('community.index');

// Case Status Pipeline & Tracking
Route::get('/track/{reference?}', [TrackController::class, 'index'])->name('track.index');

// Free Brand Protection & Manufacturer Sentinel
Route::get('/brand-protection', [BrandProtectionController::class, 'index'])->name('brand-protection.index');
Route::post('/brand-protection', [BrandProtectionController::class, 'store'])->name('brand-protection.store');

// Inspection Triage & Admin Desk (Strictly Protected by Authentication)
Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
Route::post('/admin/login', [AdminController::class, 'login'])->name('admin.login.submit');
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');
Route::post('/admin/reports/{id}/status', [AdminController::class, 'updateStatus'])->name('admin.reports.status');
Route::post('/admin/publish-fake', [AdminController::class, 'publishFake'])->name('admin.publish.fake');
Route::post('/admin/products', [AdminController::class, 'storeProduct'])->name('admin.products.store');
Route::post('/admin/products/{id}/update', [AdminController::class, 'updateProduct'])->name('admin.products.update');
Route::post('/admin/products/{id}/delete', [AdminController::class, 'destroyProduct'])->name('admin.products.destroy');
Route::post('/admin/media/{id}/delete', [AdminController::class, 'deleteMedia'])->name('admin.media.destroy');
Route::post('/admin/testimonies', [AdminController::class, 'storeTestimony'])->name('admin.testimonies.store');
Route::post('/admin/testimonies/{id}/delete', [AdminController::class, 'destroyTestimony'])->name('admin.testimonies.destroy');

// Direct Storage Media Delivery (Cross-platform evidence serving with CORS)
Route::get('/storage/{path}', function ($path) {
    $cleanPath = ltrim(preg_replace('#^storage/#', '', $path), '/');
    $filePath = storage_path('app/public/' . $cleanPath);

    if (!file_exists($filePath)) {
        $publicFallback = public_path('storage/' . $cleanPath);
        if (file_exists($publicFallback)) {
            $filePath = $publicFallback;
        } else {
            abort(404, 'Evidence file not found');
        }
    }

    $mime = mime_content_type($filePath) ?: 'application/octet-stream';

    return response()->file($filePath, [
        'Content-Type' => $mime,
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
        'Cache-Control' => 'public, max-age=604800, immutable',
    ]);
})->where('path', '.*');

