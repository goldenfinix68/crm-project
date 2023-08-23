<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Text;

class SendText implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $text;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Text $text)
    {
		$this->text = $text;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $text = Text::find($this->text->id);
        $to = json_decode($text->to);
        try {
            \Telnyx\Telnyx::setApiKey(env('TELNYX_API_KEY'));

            $response = \Telnyx\Message::Create([
                "from" => $text->from, // Your Telnyx number
                "to" => $to[0], //temp sent to many not enabled yet
                "text" => $text->message,
                "messaging_profile_id" => env('TELNYX_PROFILE_ID'),
            ]);
            
            $text->telnyxId = $response->id;
            $text->status = 'queued';
            $text->telnyxResponse = json_encode($response);
            $text->save();
        } catch (\Exception $e) {
            $text->status = 'failed';
            $text->telnyxResponse = $e->getMessage();
            $text->save();            
        }
    }
}
