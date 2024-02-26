<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RoorService;
use App\Models\Contact;

class RoorPushContactsAutoresponder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crm:roor-push-contacts-autoresponder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Will push all contacts to autoresponder';

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
        $contacts = Contact::all();
        $processed = 0;
        foreach($contacts as $contact){
            if(isset($contact->fields['mobile'])){
                $processed++;
                $result = RoorService::sendAutoCampaign($contact->fields['mobile'], $contact->fields['firstName'], $contact->fields['lastName']);
            }
        }
        
		$this->info('Total Processed: ' . $processed);
    }
}
