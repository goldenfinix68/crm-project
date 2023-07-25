<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use ElephantIO\Client;
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
Route::post('/logout', 'App\Http\Controllers\Api\AuthController@logout')->middleware('auth:api');


Route::middleware('auth:api')->group(function () {
    Route::resource('/users', 'App\Http\Controllers\Api\UsersController');
    Route::resource('/contacts', 'App\Http\Controllers\Api\ContactsController');
    Route::resource('/contact-types', 'App\Http\Controllers\Api\ContactTypesController');
    Route::resource('/deals', 'App\Http\Controllers\Api\DealsController');
    Route::resource('/notes', 'App\Http\Controllers\Api\NotesController');
    Route::resource('/texts', 'App\Http\Controllers\Api\TextsController');
    Route::post('/deals/useDealUpdateBoardMutation', 'App\Http\Controllers\Api\DealsController@useDealUpdateBoardMutation');
    Route::resource('/activities', 'App\Http\Controllers\Api\ActivityController');
    Route::get('/activities_users', 'App\Http\Controllers\Api\ActivityController@get_user');

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::post('/telnyx/call/webhook', function (Request $request) {
    \Log::info('INCOMING CALL SUCCESS');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::info($json);
});
Route::post('/telnyx/call/webhook/fail', function (Request $request) {
    \Log::error('INCOMING CALL FAIL');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::info($json);
});

Route::post('/telnyx/sms/webhook', function (Request $request) {
    \Log::info('INCOMING SMS SUCCESS');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::info($json);
});
Route::post('/telnyx/sms/webhook/fail', function (Request $request) {
    \Log::error('INCOMING SMS FAIL');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::error($json);
});
Route::get('/telnyx/call/webhook', function (Request $request) {
    \Log::info('INCOMING CALL SUCCESS');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::info($json);
});
Route::get('/telnyx/call/webhook/fail', function (Request $request) {
    \Log::error('INCOMING CALL FAIL');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::info($json);
});

Route::get('/telnyx/sms/webhook', function (Request $request) {
    \Log::info('INCOMING SMS SUCCESS');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::info($json);
});
Route::get('/telnyx/sms/webhook/fail', function (Request $request) {
    \Log::error('INCOMING SMS FAIL');
    $json = json_decode(file_get_contents("php://input"), true);
    \Log::error($json);
});
Route::get('/telnyx/call/dial', function (Request $request) {
    // $url = 'https://crm-jesse.test:4001';
    // $client = new Client(Client::engine(Client::CLIENT_4X, $url));
    // $client->initialize();
    // $client->of('/');

    // // emit an event to the server
    // $data = ['username' => 'my-user'];
    // $client->emit('message', $data);

    /**
     * Requires libcurl
     */

    $curl = curl_init();

    $payload = array(
        "to" => "+16062221172",
        "from" => "+17024720013",
        "from_display_name" => "JESSE CRM",
        "connection_id" => "7267xxxxxxxxxxxxxx",
        "webhook_url" => "https://speedlead.click/api/telnyx/call/webhook",
        "webhook_url_method" => "POST",
        "stream_url" => "wss://speedlead.click:4001",
        "stream_track" => "both_tracks",
    );

    curl_setopt_array($curl, [
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer KEY01863E241D4044AE34F1747FEB8D276B_DG8X9WGM116zWgnL9ETUlu",
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_URL => "https://api.telnyx.com/v2/calls",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => "POST",
    ]);

    $response = curl_exec($curl);
    $error = curl_error($curl);

    curl_close($curl);

    if ($error) {
        echo "cURL Error #:" . $error;
    } else {
        echo $response;
    }
});
