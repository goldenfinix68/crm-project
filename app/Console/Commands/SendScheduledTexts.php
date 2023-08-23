<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Text;

class SendScheduledTexts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crm:send-scheduled-text';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add to queue texts that is scheduled to send within 5 minutes';

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
        
		$now = Carbon::now();
		$texts = Text::where(DB::raw('schedule - INTERVAL 5 MINUTE'), '<=', $now)
			->where('schedule', '>=', $now)
			->where('queueLock', false)
			->get();
		if ($texts) {
			foreach ($texts as $key => $text) {
				if (!empty($text->schedule)) {
					$timeStartSeconds = Carbon::parse($text->schedule)->diffInSeconds($now);
					SendTimedAuctionSaleEvent::dispatch($text)->delay(now()->addSeconds($timeStartSeconds + 1));
                    $text->queueLock = true;
                    $text->save();
				}
			}
		}
		$this->info('TEXTS FOUND: ' . $texts->count());
		$this->info('DONE');
    }
}
