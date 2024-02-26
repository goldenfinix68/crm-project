<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Text;
use Illuminate\Support\Facades\Validator;

use App\Services\RoorService;

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
        try {

            $validator = Validator::make($text->toArray(), [
                'to' => ['required', 'regex:/^\+?1?[2-9]\d{2}[2-9](?!11)\d{6}$/'],
                'from' => ['required', 'regex:/^\+?1?[2-9]\d{2}[2-9](?!11)\d{6}$/'],
            ], [
                'to.regex' => 'Please enter a valid US phone number.',
                'from.regex' => 'Please enter a valid US phone number.',
            ]);

            if ($validator->fails()) {
                $text->status ='failed';
                $text->errorMessage = $validator->errors()->first();
                $text->save();
            }
            else{
                $result = RoorService::sendText($text);
                $text->status = $result['status'] == 'success' ? 'sent' : 'failed';
                $text->errorMessage = $result['message'] ?? "";
                $text->save();
            }
        

        } catch (\Exception $e) {
            $text->status = 'failed';
            $text->errorMessage = $e->getMessage() ?? "Something went wrong.";
            $text->save();            
        }
    }
}
