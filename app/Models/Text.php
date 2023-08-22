<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use App\Models\Contact;
use App\Models\User;

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
        'isFromApp',
    ];

    protected $appends = [
        'sender', 
        'receivers', 
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
        $from = $this->from;
        if($this->isFromApp){
            $senders = User::whereHas('mobileNumbers', function ($query) use ($from) {
                $query->where('mobileNumber', $from);
            })->get()->pluck('firstName', 'lastName');
            
            $names = $senders->map(function ($lastName, $firstName) {
                return "$lastName $firstName";
            })->implode(', ');
        
            return $names;
        }
        else{
            $sender = Contact::where('mobile', $this->from)->first();
            if(!empty($sender)){
                return $sender->firstName . ' ' . $sender->lastName;
            }
            
            return $this->from;
        }
    }

    public function getReceiversAttribute()
    {
        $to = json_decode($this->to);
        
        if($this->isFromApp){
            $receivers = Contact::whereIn('mobile', $to)->pluck('firstName', 'lastName');
        }
        else{           
            $receivers = User::whereHas('mobileNumbers', function ($query) use ($to) {
                $query->whereIn('mobileNumber', $to);
            })->get()->pluck('firstName', 'lastName');
        }
        if(empty($receivers)){
            return "Unknown";
        }
        else{
            $names = $receivers->map(function ($lastName, $firstName) {
                return "$lastName $firstName";
            })->implode(', ');
        
            return $names;
        }
        
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
