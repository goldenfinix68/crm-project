<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Contact;
use App\Http\Controllers\Api\GoogleSheetsController;

class UpdateGSheetData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crm:update-gSheet-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Will update google sheet data base.';

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
        $spreadsheetIds = Contact::select('googlesheetId')->where('googlesheetId', '!=', null)->distinct()->pluck('googlesheetId');

        foreach($spreadsheetIds as $id){
            $contacts = Contact::where('googlesheetId', $id)->get();

            foreach($contacts as $contact){
                $phoneFields = $contact->user->customFields()
                    ->where(function ($query) {
                        $query->where('type', 'phone')
                            ->orWhere('type', 'mobile');
                    })
                    ->get();
                foreach($phoneFields as $phoneField){
                    $color = '#FFFFFF';
                    if(isset($contact->fields[$phoneField["fieldName"]."Status"])){
                        $status = $contact->fields[$phoneField["fieldName"]."Status"];
                        if(!empty($status)){
                            if($status == 'badNumber'){
                                $color = "#FF0000";
                            }
                            else if($status == 'smsSent'){
                                $color = "#008000";
                            }
                        }
                    }
                        
                    $gSheetController = new GoogleSheetsController();
                    $gSheetController->updateCellBackgroundColor($contact->googlesheetId, $contact->id, $phoneField->label, $color);
                }

            }
        }
    }
}
