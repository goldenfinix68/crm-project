<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\GSheetCrawl;
use App\Jobs\ProcessContactImportGSheet;
use DB;
use Carbon\Carbon;

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
            dispatch(new \App\Jobs\ProcessContactImportGSheet($crawl->gSheetId, $crawl->mainUserId));
            $crawl->last_trigger = now();
            $crawl->save();
        }
        
		$this->info('Triggered: ' . count($results));
		$this->info('DONE');
    }
}
