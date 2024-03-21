<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use ElephantIO\Client;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\UsersController;

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
Route::post('/forgotpassword', 'App\Http\Controllers\Api\AuthController@forgotpassword');


Route::middleware('auth:api')->group(function () {
    
    Route::get('/user', function (Request $request) {

        $user = Auth::user();

        if(!empty($user)){
            $user = App\Models\User::find($request->user()->id);
            if(!empty($user)){
                $userController = new UsersController();
                return $userController->show($user->id);
            }
        }

        return [];
    });



    Route::post('/user-impersonate', 'App\Http\Controllers\Api\AuthController@impersonate');

    Route::post('/forgotpassword_verify', 'App\Http\Controllers\Api\AuthController@forgotpassword_verify');
    Route::post('/forgot_password_set_password', 'App\Http\Controllers\Api\AuthController@forgot_password_set_password');
    Route::get('/contacts/get_favorite', 'App\Http\Controllers\Api\ContactsController@get_favorite');
    Route::get('/contacts/get_contacts_table_column', 'App\Http\Controllers\Api\ContactsController@get_contacts_table_column');
    Route::post('/contacts/delete_contacts_table_column', 'App\Http\Controllers\Api\ContactsController@delete_contacts_table_column');

    Route::post('/user-settings', 'App\Http\Controllers\Api\UsersController@saveSettings');
    Route::get('/users/tags', 'App\Http\Controllers\Api\UsersController@usedTags');
    Route::post('/users/call-forwarding', 'App\Http\Controllers\Api\UsersController@callForwarding');
    Route::resource('/users', 'App\Http\Controllers\Api\UsersController');

    Route::post('/contacts/delete', 'App\Http\Controllers\Api\ContactsController@delete_contacts');
    Route::post('/contacts/clone', 'App\Http\Controllers\Api\ContactsController@cloneContact');

    Route::get('/contacts/global-search', 'App\Http\Controllers\Api\ContactsController@globalSearch');
    Route::post('/contacts/mergeContacts', 'App\Http\Controllers\Api\ContactsController@merge_contacts');
    Route::post('/contacts/favorite', 'App\Http\Controllers\Api\ContactsController@favorite');
    Route::post('/contacts/del_favorite', 'App\Http\Controllers\Api\ContactsController@del_favorite');
    Route::post('/contacts/activity_log', 'App\Http\Controllers\Api\ContactsController@activity_log');
    Route::post('/contacts/add_files', 'App\Http\Controllers\Api\ContactsController@add_files');
    Route::post('/contacts/save_column_setting', 'App\Http\Controllers\Api\ContactsController@save_column_setting');
    Route::post('/contacts/bulk-contact-import-csv', 'App\Http\Controllers\Api\ContactsController@bulkContactImportCsv');
    Route::post('/contacts/bulk-contact-import-gsheet', 'App\Http\Controllers\Api\ContactsController@bulkContactImportGSheet');
    Route::post('/contacts/bulk-update-field', 'App\Http\Controllers\Api\ContactsController@bulkUpdateField');
    Route::get('/contacts/filtered', 'App\Http\Controllers\Api\ContactsController@filteredContacts');
    Route::resource('/contacts', 'App\Http\Controllers\Api\ContactsController');



    Route::resource('/contact-types', 'App\Http\Controllers\Api\ContactTypesController');
    Route::resource('/deals', 'App\Http\Controllers\Api\DealsController');
    Route::post('/deals/add_notes', 'App\Http\Controllers\Api\DealsController@add_notes');
    Route::post('/deals/move-data-across-lane', 'App\Http\Controllers\Api\DealsController@moveCardAcrossLanes');
    Route::post('/deals/add_files', 'App\Http\Controllers\Api\DealsController@add_files');
    Route::post('/deals/won', 'App\Http\Controllers\Api\DealsController@won');
    Route::post('/deals/delete_notes', 'App\Http\Controllers\Api\DealsController@delete_notes');
    Route::post('/deals/delete_activity', 'App\Http\Controllers\Api\DealsController@delete_activity');
    Route::post('/deals/delete_file', 'App\Http\Controllers\Api\DealsController@delete_file');
    Route::post('/deals/add_participant', 'App\Http\Controllers\Api\DealsController@add_participant');
    Route::post('/deals/delete_participant', 'App\Http\Controllers\Api\DealsController@delete_participant');
    Route::post('/deals/add_teammate', 'App\Http\Controllers\Api\DealsController@add_teammate');
    Route::post('/deals/delete_teammate', 'App\Http\Controllers\Api\DealsController@delete_teammate');
    Route::post('/deals/update_stage', 'App\Http\Controllers\Api\DealsController@update_stage');
    Route::post('/deals/multi_delete', 'App\Http\Controllers\Api\DealsController@multi_delete');
    Route::post('/deals/multi_update', 'App\Http\Controllers\Api\DealsController@multi_update');
    Route::post('/deals/favorite', 'App\Http\Controllers\Api\DealsController@favorite');
    Route::post('/deals/del_favorite', 'App\Http\Controllers\Api\DealsController@del_favorite');
    Route::post('/deals/update_title_form', 'App\Http\Controllers\Api\DealsController@update_title_form');
    Route::resource('/notes', 'App\Http\Controllers\Api\NotesController');

    Route::resource('/texts', 'App\Http\Controllers\Api\TextsController');
    Route::post('/texts/resend', 'App\Http\Controllers\Api\TextsController@resend');

    Route::post('/deals/useDealUpdateBoardMutation', 'App\Http\Controllers\Api\DealsController@useDealUpdateBoardMutation');
    Route::resource('/activities', 'App\Http\Controllers\Api\ActivityController');
    Route::get('/activities_users', 'App\Http\Controllers\Api\ActivityController@get_user');
    Route::get('/activities_contacts', 'App\Http\Controllers\Api\ActivityController@get_contact');
    Route::get('/activities_deals', 'App\Http\Controllers\Api\ActivityController@get_deal');

    Route::resource('/activity_custome_fields', 'App\Http\Controllers\Api\ActivityCustomFieldController');
    Route::get('/calls/history', 'App\Http\Controllers\Api\CallsController@call_history');

    // tag_management
    Route::resource('tag_management', 'App\Http\Controllers\Api\TagManagementController');
    Route::post('tag_management/archive', 'App\Http\Controllers\Api\TagManagementController@archive');

    // activity_type
    Route::resource('activity_type', 'App\Http\Controllers\Api\ActivityTypeController');
    Route::post('activity_type/archive', 'App\Http\Controllers\Api\ActivityTypeController@archive');
    Route::post('/activities_update', 'App\Http\Controllers\Api\ActivityController@update_status');


    Route::resource('/text-template-folders', 'App\Http\Controllers\Api\TextTemplateFoldersController');
    Route::resource('/text-templates', 'App\Http\Controllers\Api\TextTemplatesController');
    Route::resource('/workflows', 'App\Http\Controllers\Api\WorkflowsController');
    Route::resource('/text-labels', 'App\Http\Controllers\Api\TextLabelsController');
    Route::resource('/text-threads', 'App\Http\Controllers\Api\TextThreadsController');

    Route::resource('/custom-field-sections', 'App\Http\Controllers\Api\CustomFieldSectionsController');
    Route::post('/custom-field-sections/sort', 'App\Http\Controllers\Api\CustomFieldSectionsController@sort');

    Route::post('/custom-fields/table-fields/sort', 'App\Http\Controllers\Api\CustomFieldsController@tableFieldsSort');
    Route::get('/custom-fields/inactive', 'App\Http\Controllers\Api\CustomFieldsController@inactiveFields');
    Route::post('/custom-fields/restore', 'App\Http\Controllers\Api\CustomFieldsController@restore');
    Route::post('/custom-fields/sort', 'App\Http\Controllers\Api\CustomFieldsController@sort');
    Route::resource('/custom-fields', 'App\Http\Controllers\Api\CustomFieldsController');

    Route::resource('/custom-field-values', 'App\Http\Controllers\Api\CustomFieldValuesController');


    Route::post('/assign-label-thread', 'App\Http\Controllers\Api\TextThreadsController@assign_label');
    Route::post('/text-threads/mark-texts-seen', 'App\Http\Controllers\Api\TextThreadsController@mark_texts_seen');
    Route::post('/text-threads/delete', 'App\Http\Controllers\Api\TextThreadsController@destroy');
    Route::post('/text-threads/add-tag', 'App\Http\Controllers\Api\TextThreadsController@addTag');

    Route::get('/telnyx/available-sip-trunking-connections', 'App\Http\Controllers\Api\TelnyxController@getAvailableSipTrunkingConnection');

    Route::resource('/deal-pipelines', 'App\Http\Controllers\Api\DealPipelinesController');
    
    Route::resource('/deal-pipeline-stages', 'App\Http\Controllers\Api\DealPipelineStagesController');
    Route::post('/deal-pipeline-stages/sort', 'App\Http\Controllers\Api\DealPipelineStagesController@sort');
    
    Route::resource('/filters', 'App\Http\Controllers\Api\FiltersController');
    Route::resource('/gSheet-crawl-results', 'App\Http\Controllers\Api\GSheetCrawlResultsController');
    Route::resource('/gSheet-crawl', 'App\Http\Controllers\Api\GSheetCrawlsController');

    Route::resource('/mobile-numbers', 'App\Http\Controllers\Api\MobileNumbersController');

    Route::post('/googlesheet/change-bg-color', 'App\Http\Controllers\Api\GoogleSheetsController@updateRowBackgroundColor');
    Route::post('/googlesheet/get-column-names', 'App\Http\Controllers\Api\GoogleSheetsController@getColumnNames');

});

Route::post('/calls/roorCalls', 'App\Http\Controllers\Api\CallsController@roorCalls');
Route::post('/sms/webhook', 'App\Http\Controllers\Api\TextsController@textReceived');
Route::get('/sms/webhook', 'App\Http\Controllers\Api\TextsController@textReceived');
Route::get('/telnyx/call/webhook', 'App\Http\Controllers\Api\CallsController@webhook');
Route::get('/telnyx/call/webhook/fail', 'App\Http\Controllers\Api\CallsController@webhook');
Route::post('/telnyx/call/webhook', 'App\Http\Controllers\Api\CallsController@webhook');
Route::post('/telnyx/call/webhook/fail', 'App\Http\Controllers\Api\CallsController@webhook');



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

Route::get('/mail_test', function (Request $request) {

    // $data = array(
    //     'to_name' => 'kyle taj',
    //     'to_email' => 'genekyletajores1997@gmail.com',
    //     'subject' => 'Speedclick Reset Password',
    //     'from_name' => 'Speedclick  Support',
    //     'from_email' => 'support@promise.network',
    //     'template' => 'admin.emails.password-reset',
    //     'body_data' => [
    //         'link' => url('forgotpassword/'),
    //         'full_name' => 'kyle',
    //         'email' => 'genekyletajores1997@gmail.com',
    //     ]
    // );

    // event(new \App\Events\SendMailEvent($data));

    echo  env('MAIL_HOST');
});

// Do not remove this code
Route::get('/get_people', function (Request $request) {
    // $data = \App\Models\User::select([
    //     'id',
    //     'firstName',
    //     'lastName',
    //     DB::raw("(SELECT CONCAT('users')) as `from_table`")
    // ]) ->union(DB::table('contacts')->select(
    //     'id',
    //     'firstName',
    //     'lastName',
    //     DB::raw("(SELECT CONCAT('contacts')) as `from_table`")
    // ))
    // ->get();

    return response()->json([
        'success' => true,
        'data' => [],
    ], 200);
});
