<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\GSheetCrawl;
use App\Models\GSheetCrawlResult;
use App\Jobs\ProcessContactImportGSheet;
use DB;
use Carbon\Carbon;
use Ramsey\Uuid\Uuid;

class GSheetCrawler extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crm:gSheet-crawler';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Will trigger all gsheet crawler in queue';

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
        $currentTime = now();

        $results = GSheetCrawl::where(DB::raw('last_trigger + INTERVAL `interval` MINUTE'), '<=', $currentTime)
            ->get();

        foreach($results as $crawl){
            
            $crawlResult = new GSheetCrawlResult();
            $crawlResult->mainUserId = $crawl->mainUserId;
            $crawlResult->gSheetId = $crawl->gSheetId;
            $crawlResult->gSheetName = $crawl->gSheetName;
            $crawlResult->roorAutoresponderId = $crawl->roorAutoresponderId;
            $crawlResult->initiatedBy = "Crawler";
            $crawlResult->columnMappings = $crawl->columnMappings;
            $crawlResult->batchUuid = Uuid::uuid4()->toString();
            $crawlResult->status = "Queued";
            $crawlResult->save();

            
            dispatch(new \App\Jobs\ProcessContactImportGSheet($crawlResult));
            $crawl->last_trigger = now();
            $crawl->save();
        }
        
		$this->info('Triggered: ' . count($results));
		$this->info('DONE');
    }
}
