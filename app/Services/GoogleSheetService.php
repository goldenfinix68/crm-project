<?php

namespace App\Services;

use App\Services\CustomFieldService;
use App\Services\RoorService;

use App\Models\MobileNumber;
use App\Models\Contact;
use App\Models\User;
use App\Models\CustomField;
use App\Models\GSheetCrawlResult;

use DB;
use Google_Client;
use Google_Service_Sheets;
use Google_Service_Sheets_BatchUpdateSpreadsheetRequest;
use Google_Service_Sheets_Request;
use Google_Service_Sheets_ValueRange;


class GoogleSheetService
{
    public function getColumnNames($spreadsheetId, $sheetName){
        try {
            $service = self::setupGoogleSheetsClient();
        
            // Check if user has read access to the spreadsheet
            $spreadsheet = $service->spreadsheets->get($spreadsheetId);
            
            // Check if user has write access to the spreadsheet
            // You can check for write access by attempting to make a change to the spreadsheet
            
            $sheetId = self::getSheetId($spreadsheetId, $sheetName);
        
            if ($sheetId === null) {
                return [
                    "result" => false,
                    "message" => "Sheet name not found!",
                ];
            }
        
            $response = $service->spreadsheets_values->get($spreadsheetId, $sheetName . '!1:2');
            $values = $response->getValues();
        
            if (empty($values)) {
                return [
                    "result" => false,
                    "message" => "No data found in the first two rows!",
                ];
            }
        
            // Extract column names from the first row
            $columnNames = $values[0];
            
            // Extract data from the second row
            $rowData = $values[1];
            
            // Create an associative array
            $result = [];
            foreach ($columnNames as $index => $columnName) {
                $result[$columnName] = isset($rowData[$index]) ? $rowData[$index] : null;
            }
        
            return [
                "result" => true,
                "message" => "Success!",
                "data" => $result
            ];
        } catch (\Google\Service\Exception $e) {
            // Handle Google service exceptions
            return [
                "result" => false,
                "message" => "Google Service Exception: " . $e->getMessage(),
            ];
        } catch (\Exception $e) {
            // Handle other exceptions
            return [
                "result" => false,
                "message" => "Exception: " . $e->getMessage(),
            ];
        }
    }

    public function importFromGoogleSheet($crawlResult)
    {
        $batchUuid = $crawlResult->batchUuid;

        try {
            // Setup Google Sheets API client
            $service = self::setupGoogleSheetsClient();
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
            $processed = 0;
            if(!empty($results)){
                foreach($results as $key => $result){

                    if(isset($result['SL_UUID']) && !empty($result['SL_UUID'])){
                        $errors = self::validateData($customFields, $result, $crawlResult->columnMappings);

                        if(empty($errors)){
                            DB::beginTransaction();
                            
                            $contact = Contact::where('uuid', $result['SL_UUID'])->where('userId', $mainUser->id)->first();
                            if(empty($contact)){
                                $contact = new Contact();
                                $contact->uuid = $result['SL_UUID'];
                                $contact->userId = $mainUser->id;
                            }

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
                                    \Log::info($e);
                                    $continue = false;
                                    DB::rollBack();
                                    break;
                                } 
                            }
                            if($continue){
                                $processed++;
                                DB::commit();
                                if(!empty($crawlResult->roorAutoresponderId) && !empty($roorMapping)){
                                    $roorResult = RoorService::sendAutoCampaign($contact, $roorMapping, $crawlResult->roorAutoresponderId);
                                }
                            }
                        }
                    
                    }
                }
            }

            // Update the crawl result status
            $crawlResult->status = "Completed";
            $crawlResult->processed = $processed;
            $crawlResult->save();

        } catch (\Exception $e) {
            \Log::info($e);
            $crawlResult->status = "Failed";
            $crawlResult->save();
            self::revertImport($batchUuid);
        }
    }


    
    private function revertImport($batchUuid) {
        $contacts = Contact::where('batchUuid', $batchUuid)->get();

        // Loop through each contact and delete its related custom field values
        foreach ($contacts as $contact) {
            // Use delete() method on the relationship to delete associated custom field values
            $contact->customFieldValues()->forceDelete();
        }
        
        // Finally, delete the contacts
        Contact::where('batchUuid', $batchUuid)->forceDelete();
    }
    
    private function validateData($customFields, $data, $columnMappings) {
        $errors = [];
        $columnMappings = (array) $columnMappings;
        foreach ($customFields as $field) {
            $key = array_search($field['id'], $columnMappings);
            if ($field['isRequired'] && !isset($data[$key])) {
                $errors[] = "{$field['label']} is required.";
            }
        }

        return $errors;
    }
    
    private function getSheetId($spreadsheetId, $sheetName)
    {
        $service = self::setupGoogleSheetsClient();

        $spreadsheet = $service->spreadsheets->get($spreadsheetId);
        $sheets = $spreadsheet->getSheets();

        foreach ($sheets as $sheet) {
            if ($sheet->getProperties()->getTitle() == $sheetName) {
                return $sheet->getProperties()->getSheetId();
            }
        }

        return null;
    }
    
    private function setupGoogleSheetsClient()
    {
        $client = new Google_Client();
        $client->setAuthConfig(storage_path('gSheetCredentials.json'));
        $client->addScope(Google_Service_Sheets::SPREADSHEETS);

        return new Google_Service_Sheets($client);
    }
}
