<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;


use \ElephantIO\Client;
use \ElephantIO\Engine\SocketIO\Version1X;

class TelnyxVoiceCallSteamLineEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($message)
    {
        $port = env('APP_ENV') == 'local' ? '4001' : '4001';
        $url = env('APP_URL').':'.$port;
        // $url = str_replace('/:40',':40',$url);
        // dd($url);
        \Log::info("url");
        \Log::info($url);
        $options = [
            'context' => [
                'ssl' => [
                    'verify_peer' => false,
                     'verify_peer_name' => false
                ]
            ]
        ];

        try {
            $version = new Version1X($url, $options);
            $client = new Client($version);

            $client->initialize();
            $client->emit('message', ['message' => $message]);
            $client->close();
        } catch (\ElephantIO\Exception\ServerConnectionFailureException $err) {
            \Log::info('error');
            \Log::error($err);
        }

    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
