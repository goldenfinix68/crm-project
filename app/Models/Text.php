<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use App\Models\Contact;
use App\Models\User;
use App\Models\TextThread;

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
        'schedule',
        'is_seen',
        'queueLock',
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
            $senders = User::whereHas('numbers', function ($query) use ($from) {
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
        $to = $this->to;
        if($this->isFromApp){

            $sender = Contact::where('mobile', $this->to)->first();
            if(!empty($sender)){
                return $sender->firstName . ' ' . $sender->lastName;
            }
            return $this->to;
        }
        else{
            
            $senders = User::whereHas('numbers', function ($query) use ($to) {
                $query->where('mobileNumber', $to);
            })->get()->pluck('firstName', 'lastName');
            
            $names = $senders->map(function ($lastName, $firstName) {
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

    protected static function booted()
    {
        parent::booted();

        static::created(function ($text) {
            $thread = TextThread::where(function ($query) use ($text) {
                if ($text->isFromApp) {
                    $query->where('userNumber', $text->from)->where('contactNumber', $text->to);
                } else {
                    $query->where('userNumber', $text->to)->where('contactNumber', $text->from);
                }
            })->first();

            if (!$thread) {
                $thread = new TextThread();
                $thread->userNumber = $text->isFromApp ? $text->from : $text->to;
                $thread->contactNumber = $text->isFromApp ? $text->to : $text->from;
                $thread->save();
            }

            $text->threadId = $thread->id;
            $text->seen_at =  $text->isFromApp ? Carbon::now() : "";
            $text->save();
        });
    }
}
