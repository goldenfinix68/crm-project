<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Deal extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = [
        'aging',
        'fullName',
    ];

    public function contact()
    {
        return $this->hasOne(\App\Models\Contact::class, 'id', 'contactId');
    }
    public function pipeline()
    {
        return $this->hasOne(\App\Models\DealPipeline::class, 'id', 'pipelineId');
    }
    public function stage()
    {
        return $this->hasOne(\App\Models\DealPipelineStage::class, 'id', 'stageId');
    }
    public function activities()
    {
        return $this->hasMany(\App\Models\Activity::class, 'deal_id', 'id');
    }
    
    public function creator()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'createdByUserId');
    }
    
    public function getAgingAttribute()
    {
        $date = $this->agingStartDate;
        if (empty($date)) {
            $date = $this->created_at;
        }

        $diffInMinutes = Carbon::now()->diffInMinutes($date);

        if ($diffInMinutes <= 72 * 60) {
            // If the difference is less than or equal to 72 hours (72 * 60 minutes), return in hours
            $hours = floor($diffInMinutes / 60);
            return $hours . "h";
        } else {
            // If the difference is more than 72 hours, return in days
            return Carbon::now()->diffInDays($date) . "d";
        }
    }
    
    public function getFullNameAttribute(){
        if(empty($this->contact)){
            return "";
        }
        return $this->contact->fields['firstName'] . ' ' . $this->contact->fields['lastName'];
    }
}
