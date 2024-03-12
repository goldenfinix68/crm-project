<?php

namespace App\Services;

use App\Services\MobileNumberService;

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
            'to' => '+1' . MobileNumberService::formatPhoneNumber($text->to),
            'from' => '+1' . MobileNumberService::formatPhoneNumber($text->from),
            'message' => $text->message
        ];
        $headers = [
            "Content-Type: application/x-www-form-urlencoded",
        ];
        
        return self::makeRequest($endpoint, 'POST', $data, $headers);
    }

    public function sendAutoCampaign($contact, $roorMapping)
    {

        $endpoint = '/post/autoCampaignSend/key/' . env('ROOR_API_KEY') . '/response/json/campaign/' . $roorMapping;

        $data = [
            'phone' => $contact->fields[$roorMapping->phone ?? ""] ?? "",
            'first_name' => $contact->fields[$roorMapping->first_name ?? ""] ?? "",
            'last_name' => $contact->fields[$roorMapping->last_name ?? ""] ?? "",
            'phone2' => $contact->fields[$roorMapping->phone2 ?? ""] ?? "",
            'phone3' => $contact->fields[$roorMapping->phone3 ?? ""] ?? "",
            'phone4' => $contact->fields[$roorMapping->phone4 ?? ""] ?? "",
            'address' => $contact->fields[$roorMapping->address ?? ""] ?? "",
            'address2' => $contact->fields[$roorMapping->address2 ?? ""] ?? "",
            'city' => $contact->fields[$roorMapping->city ?? ""] ?? "",
            'state' => $contact->fields[$roorMapping->state ?? ""] ?? "",
            'notes' => $contact->fields[$roorMapping->notes ?? ""] ?? "",
            'email' => $contact->fields[$roorMapping->email ?? ""] ?? ""
        ];

        $headers = [
            "Content-Type: application/x-www-form-urlencoded",
        ];

        $result =self::makeRequest($endpoint, 'POST', $data, $headers);

        \Log::info('sendAutoCampaign');
        \Log::info($result);
        return $result;
    }
}
