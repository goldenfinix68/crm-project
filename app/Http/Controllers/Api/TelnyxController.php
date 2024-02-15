<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Telnyx\Telnyx;

class TelnyxController extends Controller
{
    
    public function getCallRecordings()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => env('TELNYX_BASE_API') . 'recordings',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'Accept: application/json',
            'Authorization: Bearer ' . env('TELNYX_API_KEY')
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);

        return json_decode($response);
    }


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
                    'id' => $number->id,
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
    
    public function updateCallForwardingType($numberId, $callForwardingType, $forwardTo)
    {
        $curl = curl_init();

        $isCallForwardingEnabled = $callForwardingType != "off" || empty($forwardTo);

        $payload = array(
            "call_forwarding" => array(
                "call_forwarding_enabled" => $isCallForwardingEnabled,
                "forwarding_type" => $isCallForwardingEnabled ? $callForwardingType : '',
                "forwards_to" => $isCallForwardingEnabled ? $forwardTo : '',
            ),
        );

        curl_setopt_array($curl, [
            CURLOPT_HTTPHEADER => [
              "Authorization: Bearer " . env('TELNYX_API_KEY'),
              "Content-Type: application/json"
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_URL => env('TELNYX_BASE_API') . "phone_numbers/" . $numberId . "/voice",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "PATCH",
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        ]);
          
        $response = curl_exec($curl);
        $error = curl_error($curl);

        curl_close($curl);

        if ($error) {
            return "cURL Error #:" . $error;
        } else {
            return $response;
        }
    }
}
