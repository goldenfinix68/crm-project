<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use App\Models\Contact;

class Text extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'from',
        'to',
        'message',
        'type',
        'telnyxId',
        'status',
        'telnyxResponse',
        'userId',
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

    public function getSenderAttribute()
    {
        $sender = Contact::where('mobile', $this->from)->first();
        if(!empty($sender)){
            return $sender->firstName . ' ' . $sender->lastName;
        }
        
        return $this->from;
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
