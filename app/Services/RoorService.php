<?php

namespace App\Services;

use App\Models\Contact;


class RoorService
{
    public function getAvailableNumbers()
    {
        $url = env('ROOR_BASE_URL') . '/messenger/getDIDs/key/' . env('ROOR_API_KEY') . '/response/json';

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            return ['error' => 'Failed to fetch data'];
        } else {
            return json_decode($response, true);
        }
    }
}
