<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityInvitee extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function activity()
    {
        return $this->belongsTo('\App\Models\Activity', 'id', 'activity_id');
    }
}
