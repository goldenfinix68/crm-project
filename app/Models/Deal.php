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
}
