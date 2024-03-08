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
        $crawlResults = GSheetCrawlResult::where('status', "Queued")
            ->get();
        $processed = 0;
        foreach($crawlResults as $result){
            $res = GoogleSheetService::importFromGoogleSheet($result);

            $this->info('Processed: ' . $res);

            $processed++;
        }
        
		$this->info('Processed: ' . $processed);
        return 0;
    }
}
