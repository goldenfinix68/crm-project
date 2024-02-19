<?php

namespace App\Services;

class RoorService
{
    public function makeRequest($endpoint, $method = 'GET', $data = [], $headers = [])
    {
        // Build URL
        $url = env('ROOR_BASE_URL') . $endpoint;

        // Initialize cURL session
        $curl = curl_init();

        // Set common cURL options
        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
        ];

        // If method is POST and data is provided, set POSTFIELDS option
        if ($method === 'POST' && !empty($data)) {
            $options[CURLOPT_POSTFIELDS] = http_build_query($data);
        }

        // Set cURL options
        curl_setopt_array($curl, $options);

        // Execute cURL request
        $response = curl_exec($curl);
        $err = curl_error($curl);

        // Close cURL session
        curl_close($curl);

        // Check for errors
        if ($err) {
            return ['status' => 'failed', 'message' => "cURL Error #:" . $err];
        } else {
            return json_decode($response, true);
        }
    }

    public function getAvailableNumbers()
    {
        $endpoint = '/messenger/getDIDs/key/' . env('ROOR_API_KEY') . '/response/json';
        return self::makeRequest($endpoint);
    }

    public static function sendText($text)
    {
        $endpoint = '/v1/manualTXT/key/' . env('ROOR_API_KEY') . '/response/json';

        $data = [
            'to' => $text->to,
            'from' => '+' . $text->from,
            'message' => $text->message
        ];
        $headers = [
            "Content-Type: application/x-www-form-urlencoded",
        ];
        
        return self::makeRequest($endpoint, 'POST', $data, $headers);
    }

    public function sendAutoCampaign($phone, $firstName, $lastName)
    {
        $endpoint = '/post/autoCampaignSend/key/' . env('ROOR_API_KEY') . '/response/json/campaign/' . env('ROOR_AUTOCAMPAIGN_ID');

        $data = [
            'phone' => $phone,
            'first_name' => $firstName,
            'last_name' => $lastName
        ];
        $headers = [
            "Content-Type: application/x-www-form-urlencoded",
        ];

        return self::makeRequest($endpoint, 'POST', $data, $headers);
    }
}
