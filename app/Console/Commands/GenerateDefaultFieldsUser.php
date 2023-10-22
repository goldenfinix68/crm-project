<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Events\UserCreated;

class GenerateDefaultFieldsUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crm:generate-default-fields-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Will generate all default sections and fields for contact, deal and activity';

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
        $users = User::all();

        foreach($users as $user){
            event(new UserCreated($user));
        }

        return "Done";
    }
}
