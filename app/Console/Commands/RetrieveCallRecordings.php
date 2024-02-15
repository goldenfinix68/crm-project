<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Api\TelnyxController;
use App\Models\CallRecording;

class RetrieveCallRecordings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crm:retrieve-call-recordings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Will retrieve all call recodings from telnyx';

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
        
        $controller = new TelnyxController();

        $result = $controller->getCallRecordings();
        $recordings = collect($result->data);

        $recodingCallSessionIds = CallRecording::all()->pluck('call_session_id');

        $recordings = $recordings->whereNotIn('call_session_id', $recodingCallSessionIds);
        $processed = 0;

        foreach($recordings as $recording){
            
            if(!empty(!empty($recording->download_urls))){

                $newRecording = new CallRecording();
                $newRecording->call_session_id = $recording->call_session_id;

                foreach($recording->download_urls as $key => $value){
                    $newRecording->recording_url = $value;
                }
                
                $newRecording->save();
            }

            $processed++;
        }
        // $callRecordings = \Telnyx\Recordings::all();

		$this->info('Total processed: ' . $processed);
		$this->info('DONE');
    }
}
