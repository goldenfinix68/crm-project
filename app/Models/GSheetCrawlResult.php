<?php

namespace App\Models;
use App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GSheetCrawlResult extends Model
{
    use HasFactory;
    
    protected $casts = [
        'gSheetData' => 'object',
        'result' => 'object',
    ];

    protected $appends = [
        'triggeredBy',
    ];
    
    public function user()
    {
        return $this->belongsTo('\App\Models\User', 'mainUserId', 'id');
    }

    
    public function getTriggeredByAttribute()
    {
        if(!empty($this->initiatedBy)){
            $user = User::find($this->initiatedBy);
            if(!empty($user)){
                return $user->fullName;
            }
        }
       
        return "Crawler";
    }
}
