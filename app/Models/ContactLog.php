<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactLog extends Model
{
    protected $guarded = [];
    use HasFactory;


    public function owner()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'owner');
    }
}
