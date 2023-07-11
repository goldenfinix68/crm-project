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


Route::resource('/users', 'App\Http\Controllers\Api\UsersController');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/telnyx/call/webhook', function(Request $request) {
    \Log::info('INCOMING CALL SUCCESS');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::info($json);
});
Route::post('/telnyx/call/webhook/fail', function(Request $request) {
    \Log::error('INCOMING CALL FAIL');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::info($json);
});

Route::post('/telnyx/sms/webhook', function(Request $request) {
    \Log::info('INCOMING SMS SUCCESS');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::info($json);
});
Route::post('/telnyx/sms/webhook/fail', function(Request $request) {
    \Log::error('INCOMING SMS FAIL');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::error($json);
});