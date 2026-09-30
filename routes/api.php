<?php

use App\Http\Controllers\Api\Fake9jaController;
use Illuminate\Support\Facades\Route;

// Public Citizen Intelligence Endpoints (100% Free)
Route::get('/reports', [Fake9jaController::class, 'getReports']);
Route::post('/reports', [Fake9jaController::class, 'storeReport']);
Route::get('/reports/track/{referenceId}', [Fake9jaController::class, 'trackReport']);
Route::post('/brand-watches', [Fake9jaController::class, 'storeBrandWatch']);
Route::post('/coupons/validate', [Fake9jaController::class, 'validateCoupon']);
Route::get('/hotspots', [Fake9jaController::class, 'getHotspots']);
Route::get('/public-stats', [Fake9jaController::class, 'getPublicStats']);

// Admin / Review Desk Endpoints
Route::post('/admin/login', [Fake9jaController::class, 'adminLogin']);
Route::get('/admin/stats', [Fake9jaController::class, 'getAdminStats']);
Route::patch('/admin/reports/{id}/status', [Fake9jaController::class, 'updateReportStatus']);
Route::delete('/admin/reports/{id}', [Fake9jaController::class, 'deleteReport']);
Route::get('/admin/brand-watches', [Fake9jaController::class, 'getBrandWatches']);
Route::post('/admin/hotspots', [Fake9jaController::class, 'storeHotspot']);
Route::delete('/admin/hotspots/{id}', [Fake9jaController::class, 'deleteHotspot']);
// Video Testimonies Endpoints (Multi-source: YouTube, Instagram, TikTok, Facebook, Organic)
Route::get('/video-testimonies', [Fake9jaController::class, 'getVideoTestimonies']);
Route::post('/admin/video-testimonies', [Fake9jaController::class, 'storeVideoTestimony']);
Route::put('/admin/video-testimonies/{id}', [Fake9jaController::class, 'updateVideoTestimony']);
Route::delete('/admin/video-testimonies/{id}', [Fake9jaController::class, 'deleteVideoTestimony']);
