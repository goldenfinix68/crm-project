<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Google_Client;
use Google_Service_Sheets;
use Google_Service_Sheets_BatchUpdateSpreadsheetRequest;
use Google_Service_Sheets_Request;

class GoogleSheetsController extends Controller
{
    
    private function setupGoogleSheetsClient()
    {
        $client = new Google_Client();
        $client->setAuthConfig(storage_path('gSheetCredentials.json'));
        $client->addScope(Google_Service_Sheets::SPREADSHEETS);

        return new Google_Service_Sheets($client);
    }
    
    public function updateCellBackgroundColor($spreadsheetId, $SL_ID, $cellHeader, $backgroundColor)
    {
        $service = $this->setupGoogleSheetsClient();

        // Replace 'YOUR_SPREADSHEET_ID' and 'Sheet1' with your actual spreadsheet ID and sheet name.
        $range = 'Sheet1'; // Update with your sheet name and range

        // Retrieve values from the specified range
        $response = $service->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();

        // Find column index for "wireless 1" header
        $headerRow = $values[0];
        $contact1ColumnIndex = array_search('SL_ID', $headerRow);
        $mobileNumberColumnIndex = array_search($cellHeader, $headerRow);

        // Iterate through rows to find matching cell and apply style changes
        foreach ($values as $rowIndex => $row) {
            if (isset($row[$contact1ColumnIndex]) && $row[$contact1ColumnIndex] == $SL_ID && $mobileNumberColumnIndex) {
                $requests[] = [
                    'repeatCell' => [
                        'range' => [
                            'sheetId' => $this->getSheetId($spreadsheetId, $range),
                            'startRowIndex' => $rowIndex,
                            'endRowIndex' => $rowIndex + 1,
                            'startColumnIndex' => $mobileNumberColumnIndex,
                            'endColumnIndex' => $mobileNumberColumnIndex + 1,
                        ],
                        'cell' => [
                            'userEnteredFormat' => [
                                'backgroundColor' => [
                                    'red' => hexdec(substr($backgroundColor, 1, 2)) / 255.0,
                                    'green' => hexdec(substr($backgroundColor, 3, 2)) / 255.0,
                                    'blue' => hexdec(substr($backgroundColor, 5, 2)) / 255.0,
                                ],
                            ],
                        ],
                        'fields' => 'userEnteredFormat.backgroundColor',
                    ],
                ];
                break; // Break after updating the first matching row
            }
        }

        // Send batch update request
        if(isset($requests)){
            $batchUpdateRequest = new Google_Service_Sheets_BatchUpdateSpreadsheetRequest(['requests' => $requests]);
            $service->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);
        }

        return response()->json(['message' => 'Cell background color updated successfully']);
    }

    private function getSheetId($spreadsheetId, $sheetName)
    {
        $service = $this->setupGoogleSheetsClient();

        $spreadsheet = $service->spreadsheets->get($spreadsheetId);
        $sheets = $spreadsheet->getSheets();

        foreach ($sheets as $sheet) {
            if ($sheet->getProperties()->getTitle() == $sheetName) {
                return $sheet->getProperties()->getSheetId();
            }
        }

        return null;
    }
}
