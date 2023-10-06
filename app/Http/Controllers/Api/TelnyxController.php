<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Telnyx\Telnyx;

class TelnyxController extends Controller
{
    public function getAvailableSipTrunkingConnection()
    {
        // Initialize the Telnyx client with your API key
        Telnyx::setApiKey(env('TELNYX_API_KEY'));

        $connections = \Telnyx\CredentialConnection::all();

        $data = [];
        foreach($connections->data as $connection){
            $mobileNumbers = \Telnyx\PhoneNumber::all(['filter[connection_id]' => $connection->id]);
            
            $numbers = [];
            foreach($mobileNumbers->data as $number){
                $numbers[] = [
                    'mobileNumber' => $number->phone_number,
                ];
            }
            $data[] = [
                'telnyxConnectionId' => $connection->id,
                'telnyxConnectionName' => $connection->connection_name,
                'telnyxConnectionUserName' => $connection->user_name,
                'telnyxConnectionPassword' => $connection->password,
                'numbers' => $numbers,
            ];

        }
        // Process the response, it will contain the available numbers

        return $data;
    }
    
}
