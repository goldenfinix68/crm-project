<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Text extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'from',
        'to',
        'userId',
        'contactId',
        'message',
        'type',
    ];

    protected $appends = [
        'sender', 
        'day', 
        'month', 
        'year', 
        'time', 
    ];

    public function user()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'userId');
    }

    public function contact()
    {
        return $this->hasOne(\App\Models\Contact::class, 'id', 'contactId');
    }
    
    public function getSenderAttribute()
    {
        if($this->type == "sent"){
            return $this->user->firstName . ' ' . $this->user->lastName;
        }
        if($this->type == "received"){
            // $sender = (string) $this->contact->firstName . " " . $this->contact->lastName;
            return "contact";
        }
        return 'Unknown';
    }
    
    public function getDayAttribute()
    {
        $createdAt = Carbon::parse($this->created_at);

        return $createdAt->format('j');
    }
    
    public function getMonthAttribute()
    {
        $createdAt = Carbon::parse($this->created_at);

        return $createdAt->format('F');
    }
    
    public function getYearAttribute()
    {
        $createdAt = Carbon::parse($this->created_at);

        return $createdAt->format('Y');
    }
    
    public function getTimeAttribute()
    {
        $createdAt = Carbon::parse($this->created_at);

        return $createdAt->format('h:i A');
    }
}
