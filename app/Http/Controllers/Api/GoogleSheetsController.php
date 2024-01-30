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
    
    public function updateRowBackgroundColor(Request $request)
    {
        $service = $this->setupGoogleSheetsClient();

        // Replace 'YOUR_SPREADSHEET_ID' and 'Sheet1' with your actual spreadsheet ID and sheet name.
        $spreadsheetId = '1OOt8l719ev8VilpodHSaEvrKdXjt-edU0uDWT_hUFYw';
        $range = 'Sheet1'; // Update with your sheet name and range

        // Retrieve values from the specified range
        $response = $service->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();

        // Find column index for "wireless 1" header
        $headerRow = $values[0];
        $wireless1ColumnIndex = array_search('Wireless1', $headerRow);
        
        $backgroundColor = '#FFFF00'; // Change this to the desired color.

        // Iterate through rows to find matching cells
        $rowsToUpdate = [];
        foreach ($values as $rowIndex => $row) {
            if (isset($row[$wireless1ColumnIndex]) && $row[$wireless1ColumnIndex] == '12345') {
                $rowsToUpdate[] = $rowIndex + 1; // Adjust to 1-based index
            }
        }

        // Apply style changes to the matched rows
        $requests = [];
        foreach ($rowsToUpdate as $rowIndex) {
            $requests[] = [
                'repeatCell' => [
                    'range' => [
                        'sheetId' => $this->getSheetId($spreadsheetId, $range),
                        'startRowIndex' => $rowIndex - 1,
                        'endRowIndex' => $rowIndex,
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


        }

        // Send batch update request
        $batchUpdateRequest = new Google_Service_Sheets_BatchUpdateSpreadsheetRequest(['requests' => $requests]);
        $service->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);

        return response()->json(['message' => 'Row background color updated successfully']);
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
