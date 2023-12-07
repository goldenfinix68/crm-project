<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\GSheetCrawlResult;
use App\Models\Contact;

use App\Services\CustomFieldService;

use Google_Client;
use Google_Service_Sheets;
use DB;

class ProcessContactImportGSheet implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $spreadsheetId;
    protected $mainUser;
    protected $initiatedBy;

    public function __construct($spreadsheetId, $mainUser, $initiatedBy = null)
    {
        $this->spreadsheetId = $spreadsheetId;
        $this->mainUser = $mainUser;
        $this->initiatedBy = $initiatedBy;
    }

    public function handle()
    {
        try {
            // Setup Google Sheets API client
            $service = $this->setupGoogleSheetsClient();
            $mainUser = $this->mainUser;
            $initiatedBy = $this->initiatedBy;

            // Fetch data from the Google Sheet
            $range = 'Sheet1';
            $response = $service->spreadsheets_values->get($this->spreadsheetId, $range);
            $values = $response->getValues();

            $data = [];
            // Process the data as needed
            if (!empty($values)) {
                foreach ($values as $row) {
                    // Process each row of data
                    $data[] = $row;
                }
            } else {
                // Handle the case where no data is found
                // You can log or notify as needed
                return;
            }

            $results = [];

            if (!empty($data)) {
                $keys = $data[0];
                foreach ($data as $index => $row) {
                    if ($index === 0) {
                        continue; // Skip the header row
                    }
            
                    $rowData = [];
                    foreach ($keys as $keyIndex => $key) {
                        $value = isset($row[$keyIndex]) ? $row[$keyIndex] : null;
                        $rowData[$key] = $value;
                    }
                    $results[] = $rowData;
                }
            }

            $importResult = [];
            if(!empty($results) && isset($mainUser->customFields)){
                $customFields = $mainUser->customFields;
                foreach($results as $result){

                    $errors = $this->validateData($customFields, $result);
                    $importResult[] = [
                        "isSuccess" => empty($errors),
                        "errors" => $errors,
                        // "customFields" => $customFields,
                        "data" => $result,
                    ];

                    if(empty($errors)){
                        DB::beginTransaction();
                        $contact = new Contact();
                        $contact->userId = $this->mainUser->id;
                        $contact->save();

                        $continue = true;
                        foreach ($customFields as $field) {
                            if(isset($result[$field['label']])){
                                $value = $result[$field['label']];

                                if(!empty($value)){
                                    try {
                                        if($field->type == 'tag'){
                                            $value = [$value];
                                        }
                                        CustomFieldService::createOrUpdateCustomFieldValue($contact->id, $field, 'contact', $value);
                                    }
                                    catch (Exception $e) {
                                        $continue = false;
                                        DB::rollBack();
                                        break;
                                    } 
                                }
                            }
                        }
                        if($continue){
                            DB::commit();
                        }
                    }
                }
                \Log::info($importResult);
            }
            
            $crawlResult = new GSheetCrawlResult();
            $crawlResult->gSheetData = $results;
            $crawlResult->mainUserId = $this->mainUser->id;
            $crawlResult->gSheetId = $this->spreadsheetId;
            $crawlResult->result = $importResult;
            $crawlResult->initiatedBy = !empty($initiatedBy) ? $initiatedBy->id : null;
            $crawlResult->save();

            // Process the result as needed
            // You can store it in the database or perform other actions

        } catch (\Exception $e) {
             
            $crawlResult = new GSheetCrawlResult();
            $crawlResult->gSheetData = [];
            $crawlResult->mainUserId = $this->mainUser->id;
            $crawlResult->gSheetId = $this->spreadsheetId;
            $crawlResult->result =  [[
                "isSuccess" => false,
                "errors" => ["Something went wrong upon crawling spreadsheet!"],
            ]];
            $crawlResult->initiatedBy = !empty($initiatedBy) ? $initiatedBy->id : null;
            $crawlResult->save();
            // Handle exceptions (log or notify)
            // You might want to retry the job or mark it as failed based on your needs
            // You can use Laravel's retry() method for automatic retries
            // retry(3)->delay(now()->addMinutes(5));
        }
    }
    
    private function validateData($customFields, $data) {
        $errors = [];

        foreach ($customFields as $field) {
            if ($field['isRequired'] && !isset($data[$field['label']])) {
                $errors[] = "{$field['label']} is required.";
            }

            if($field->fieldName == 'mobile' && isset($data[$field['label']])){
                $verify = CustomFieldService::getContactByMobile($data[$field['label']], $this->mainUser);
                if(!empty($verify)){
                    $errors[] = "Mobile number is already taken.";
                }
            }
        }

        return $errors;
    }

    private function setupGoogleSheetsClient()
    {
        $client = new Google_Client();
        $client->setAuthConfig(storage_path('gSheetCredentials.json'));
        $client->addScope(Google_Service_Sheets::SPREADSHEETS_READONLY);

        return new Google_Service_Sheets($client);
    }
}
