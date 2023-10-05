<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Telnyx\Telnyx;

class TelnyxController extends Controller
{
    public function getAvailableNumbers()
    {
        // Initialize the Telnyx client with your API key
        Telnyx::setApiKey(env('TELNYX_API_KEY'));

        // Make a request to Telnyx to get available numbers
        $response = \Telnyx\PhoneNumber::all();

        $data = [];
        foreach($response->data as $number){
            $data[] = [
                'telnyId' => $number->id,
                'messagingProfileId' => $number->messaging_profile_id,
                'connectionId' => $number->connection_id,
                'mobileNumber' => $number->phone_number,
            ];
        }
        // Process the response, it will contain the available numbers

        return $data;
    }
    
}
