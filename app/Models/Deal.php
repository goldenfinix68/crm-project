<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function owner()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'owner');
    }
    public function owner1()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'owner');
    }
    public function contact()
    {
        return $this->hasOne(\App\Models\Contact::class, 'id', 'contactId');
    }
    public function activities()
    {
        return $this->hasMany(\App\Models\Activity::class, 'deal_id', 'id');
    }
    public function notes()
    {
        return $this->hasMany(\App\Models\DealNote::class, 'deal_id', 'id');
    }
    public function files()
    {
        return $this->hasMany(\App\Models\DealFile::class, 'deal_id', 'id');
    }

    public function participant()
    {
        return $this->hasMany(\App\Models\DealParticipant::class, 'deal_id', 'id');
    }
    public function teammate()
    {
        return $this->hasMany(\App\Models\DealTeammate::class, 'deal_id', 'id');
    }
}
