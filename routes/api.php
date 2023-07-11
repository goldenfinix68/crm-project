<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/login', 'App\Http\Controllers\Api\AuthController@login');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('api')->group(function () {
    Route::post('/telnyx/call/webhook', function(Request $request) {
        \Log::error('INCOMING CALL SUCCESS');
        \Log::error($request);
    });
    Route::post('/telnyx/call/webhook/fail', function(Request $request) {
        \Log::error('INCOMING CALL FAIL');
        \Log::error($request);
    });

    Route::post('/telnyx/sms/webhook', function(Request $request) {
        \Log::error('INCOMING SMS SUCCESS');
        \Log::error($request);
    });
    Route::post('/telnyx/sms/webhook/fail', function(Request $request) {
        \Log::error('INCOMING SMS FAIL');
        \Log::error($request);
    });
});