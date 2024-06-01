<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\GSheetCrawlResult;

use App\Services\GoogleSheetService;

class GSheetImportTrigger extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crm:gSheet-trigger';

    protected $timeout = 0;

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Will trigger all queued GCrawlResult';

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
        set_time_limit(0);


		$this->info('Starting crm:gSheet-trigger');

        $crawlResults = GSheetCrawlResult::where('status', "Queued")
            ->get();
        $processed = 0;
        foreach($crawlResults as $result){
            GoogleSheetService::importFromGoogleSheet($result);
            $processed++;
        }
        
		$this->info('Processed: ' . $processed);
        return 0;
    }
}
