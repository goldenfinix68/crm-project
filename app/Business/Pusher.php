<?php

namespace App\Business;

class Pusher extends \Pusher\Pusher
{
    public function __construct()
    {
        parent::__construct(env('PUSHER_APP_KEY'), env('PUSHER_APP_SECRET'), env('PUSHER_APP_ID'), ['cluster' => env('PUSHER_APP_CLUSTER')], null, null, null);
    }
}
