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
        if(empty($this->agingStartDate)){
            return "0d";
        }


        return Carbon::now()->diffInDays($this->agingStartDate) . "d";

    }
}
