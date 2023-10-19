<?php

namespace App\Listeners;

use App\Events\UserCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\CustomFieldSection;

class GenerateDefaultFields
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {

    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\UserCreated  $event
     * @return void
     */
    public function handle(UserCreated $event)
    {
        $user = $event->user;

        $defaultCustomFieldSectionsType = ['contact', 'deal', 'activity'];
        foreach($defaultCustomFieldSectionsType as $type){
            $section = new CustomFieldSection();
            $section->name = 'Default';
            $section->columnLayout = 'two';
            $section->userId = $user->id;
            $section->type = $type;
            $section->sort = 1;
            $section->isDefault = true;
            $section->save();
        }
    }
}
