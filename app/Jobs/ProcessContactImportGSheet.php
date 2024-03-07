<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\GSheetCrawlResult;
use App\Models\Contact;
use App\Models\User;
use App\Models\CustomField;

use App\Services\CustomFieldService;
use App\Services\RoorService;

use Google_Client;
use Google_Service_Sheets;
use Google_Service_Sheets_ValueRange;
use DB;

class ProcessContactImportGSheet implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $crawlResult;

    public function __construct($crawlResult)
    {
        $this->crawlResult = $crawlResult;
    }

    public function handle()
    {
        $crawlResult = $this->crawlResult;
        $batchUuid = $crawlResult->batchUuid;

        try {
            // Setup Google Sheets API client
            $service = $this->setupGoogleSheetsClient();
            $mainUser = User::find($crawlResult->mainUserId);
            $customFields = $mainUser->customFields->where('isActive', 1);

            $roorMapping = $mainUser->settings->roorMapping;

            // Fetch data from the Google Sheet
            $response = $service->spreadsheets_values->get($crawlResult->gSheetId, $crawlResult->gSheetName);
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
                        continue;
                    }
            
                    $rowData = [];
                    foreach ($keys as $keyIndex => $key) {
                        $value = isset($row[$keyIndex]) ? $row[$keyIndex] : null;
                        $rowData[$key] = $value;
                    }
                    $results[] = $rowData;
                }
            }
            
            $crawlResult->status = "Running";
            $crawlResult->rowCount = count($results);
            $crawlResult->save();


            if(!empty($results)){
                foreach($results as $key => $result){

                    $contact = false;

                    if(isset($result['SL_ID']) && !empty($result['SL_ID'])){
                        $contact = Contact::find($result['SL_ID']);
                        if(empty($contact)){
                            continue;
                        }
                    }

                    $errors = $this->validateData($customFields, $result);

                    if(empty($errors)){
                        DB::beginTransaction();
                        if(!$contact){
                            $contact = new Contact();
                        }
                        $contact->userId = $mainUser->id;
                        $contact->googlesheetId = $crawlResult->gSheetId;
                        $contact->batchUuid = $batchUuid;
                        $contact->save();

                        $continue = true;

                        foreach ($crawlResult->columnMappings as $sourceColumn => $targetColumn) {
                            try {
                                $customField = CustomField::find($targetColumn);
    
                                if($customField->type == 'tag'){
                                    $result[$sourceColumn] = [$result[$sourceColumn]];
                                }
                                CustomFieldService::createOrUpdateCustomFieldValue($contact->id, $customField, 'contact', $result[$sourceColumn]);
                            }
                            catch (Exception $e) {
                                $continue = false;
                                DB::rollBack();
                                break;
                            } 
                        }
                        if($continue){
                            $results[$key]['SL_ID'] = $contact->id;
                            DB::commit();
                            if(!empty($this->roorAutoresponderId) && !empty($roorMapping)){
                                $roorResult = RoorService::sendAutoCampaign($contact, $roorMapping, $this->roorAutoresponderId);
                            }
                        }
                    }
                }
            }

            
            //update GSheet Data
            $valuesToUpdate = [$keys];  // Include the array keys as the first row/header
            foreach ($results as $row) {
                $rowData = [];
                foreach ($keys as $key) {
                    $rowData[] = isset($row[$key]) ? $row[$key] : null;
                }
                $valuesToUpdate[] = $rowData;
            }
            
            $updateBody = new Google_Service_Sheets_ValueRange([
                'values' => $valuesToUpdate,
            ]);
            
            $updateParams = [
                'valueInputOption' => 'RAW',
            ];
            
            // Update the Google Sheet with the new values
            $service->spreadsheets_values->update($crawlResult->gSheetId, $crawlResult->gSheetName, $updateBody, $updateParams);
            
            // Update the Google Sheet with the new values
            
            $service = $this->setupGoogleSheetsClient();
            $updateResponse = $service->spreadsheets_values->update($crawlResult->gSheetId, $crawlResult->gSheetName, $updateBody, $updateParams);

            \Log::info($updateResponse);
            
            $crawlResult->status = "Completed";
            $crawlResult->save();

        } catch (\Exception $e) {
            \Log::info($e);
            $crawlResult->status = "Failed";
            $crawlResult->save();

            $contacts = Contact::where('batchUuid', $batchUuid)->get();

            // Loop through each contact and delete its related custom field values
            foreach ($contacts as $contact) {
                // Use delete() method on the relationship to delete associated custom field values
                $contact->customFieldValues()->forceDelete();
            }
            
            // Finally, delete the contacts
            Contact::where('batchUuid', $batchUuid)->forceDelete();

        }
    }

    
    private function validateData($customFields, $data) {
        $errors = [];

        foreach ($customFields as $field) {
            if ($field['isRequired'] && !isset($data[$field['label']])) {
                $errors[] = "{$field['label']} is required.";
            }
        }

        return $errors;
    }

    private function setupGoogleSheetsClient()
    {
        $client = new Google_Client();
        $client->setAuthConfig(storage_path('gSheetCredentials.json'));
        $client->addScope(Google_Service_Sheets::SPREADSHEETS);

        return new Google_Service_Sheets($client);
    }
}
