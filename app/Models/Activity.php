<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Activity extends Model
{
    use HasFactory, LogsActivity;

    //history custom
    protected static $logAttributes = [
        "title",
        "type",
        "start_date",
        "end_date",
        "start_time",
        "end_time",
        "location",
        "video_conferencing",
        "recurrence",
        "availability",
        "internal_note",
        "owner_id",
        "deal_id",
        "contact_id",
        "status",
        "completed_date",
        "created_longitude",
        "created_latitude",
        "created_address",
    ];
    protected static $logName = "activity";
    protected static $logOnlyDirty = true;
    // protected static $recordEvents = ['deleted'];

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
