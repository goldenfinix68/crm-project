<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Call extends Model
{
    use HasFactory;

    protected $guarded = [];

    
    public function recording()
    {
        return $this->hasOne(\App\Models\CallRecording::class, 'call_session_id', 'telnyxCallSessionId');
    }
}
