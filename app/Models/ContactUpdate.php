<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactUpdate extends Model
{
    use HasFactory;
    
    protected $appends = [
        'by', 
    ];

    public function user()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'userId');
    }

    public function getByAttribute()
    {
        return $this->user->firstName . ' ' . $this->user->lastName;
    }
}
