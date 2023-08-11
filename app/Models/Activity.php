<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $guarded = [];


    public function activity_tags()
    {
        return $this->hasMany('\App\Models\ActivityTag', 'activity_id', 'id');
    }

    public function activity_followers()
    {
        return $this->hasMany('\App\Models\ActivityFollower', 'activity_id', 'id');
    }

    public function activity_invitees()
    {
        return $this->hasMany('\App\Models\ActivityInvitee', 'activity_id', 'id');
    }

    public function owner()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'owner_id');
    }
}
