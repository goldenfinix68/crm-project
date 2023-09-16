<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Business\Pusher;

class TextReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $text;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($text)
    {
        $this->text = $text;
        
		$pusher = new Pusher();
		$pusher->trigger('text-channel', 'text-received', [
			'message' => 'New message received',
		]);
    }

    public function broadcastOn()
    {
		return new PrivateChannel('text-channel');
    }
  
	public function broadcastWith(): array
    {
		$pusher = new Pusher();
		$pusher->trigger('my-channel', 'my-event', [
			'message' => 'created',
		]);
		return ['my-event' => []];
    }
}
