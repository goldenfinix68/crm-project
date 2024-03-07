<?php

namespace App\Services;
use App\Models\MobileNumber;

use DB;
use Google_Client;
use Google_Service_Sheets;
use Google_Service_Sheets_BatchUpdateSpreadsheetRequest;
use Google_Service_Sheets_Request;

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
