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
}
