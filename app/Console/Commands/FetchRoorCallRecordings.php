<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Services\MobileNumberService;

class FetchRoorCallRecordings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roor:callrecordings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crawl RooR Call Recordings and save them to the database.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // make a curl function GET request to https://speedlead.hugegreen.party:3001/crawler_roor_call_recordings
        // save the response to a variable
        // decode the response
        // loop through the response and save each call recording to the database

        \Log::info('START FetchRoorCallRecordings');
        // Initialize a CURL session
        $ch = curl_init();

        // Set the URL for the GET request
        curl_setopt($ch, CURLOPT_URL, "https://hugegreen.party:3001/crawler_roor_call_recordings");
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        // Set the option to return the response as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute the CURL session and save the response to a variable
        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
            echo $error_msg;
        }
        // Close the CURL session
        curl_close($ch);

        \Log::info('RESPONSE');
        \Log::info($response);
        
        if($response != '') {
            // Decode the response
            $data = json_decode($response, true);

            
            \Log::info($data);
            // Loop through the response and save each call recording to the database
            foreach ($data as $call) {
                $from = MobileNumberService::formatPhoneNumber($call['from']);
                $to = MobileNumberService::formatPhoneNumber($call['to']);
                $call = \App\Models\Call::updateOrCreate([
                    'from' => $from,
                    'to' => $to,
                    'call_received_date' => $call['call_received_date'],
                ],[
                    'from' => $from,
                    'to' => $to,
                    'url_recording' => $call['url_recording'],
                    'status' => $call['status'],
                    'disposition' => $call['disposition'],
                    'duration' => $call['duration'],
                    'call_received_date' => $call['call_received_date'],
                    'telnyxCallSessionId' => '',
                    'type' => $call['type'],
                    'tz' => 'mdt',
                ]);
            }

        }
        
        \Log::info('END FetchRoorCallRecordings');
    }
}
