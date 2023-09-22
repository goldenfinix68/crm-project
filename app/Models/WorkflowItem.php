<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Text;

class WorkflowItem extends Model
{
    use HasFactory;

    protected $appends = [
        'failed', 
        'success', 
        'total',
    ];
    
    public function workflow()
    {
        return $this->belongsTo(\App\Models\Workflow::class, 'workflowId');
    }
    
    public function texts()
    {
        return $this->hasMany(\App\Models\Text::class, 'workflowItemId');
    }

    
    // Mutator: Serialize array to JSON before saving to the database
    public function setContactIdsAttribute($value)
    {
        $this->attributes['contactIds'] = json_encode($value);
    }

    // Accessor: Deserialize JSON string to an array when retrieving from the database
    public function getContactIdsAttribute($value)
    {
        return json_decode($value, true);
    }
    
    // Accessor: Deserialize JSON string to an array when retrieving from the database
    public function getFailedAttribute()
    {
        return Text::where('workflowItemId', $this->id)->where('status', 'failed')->count();
    }
    public function getSuccessAttribute()
    {
        return Text::where('workflowItemId', $this->id)
            ->where(function ($query) {
                $query->where('status', 'finalized')
                    ->orWhere('status', 'sent');
            })
            ->count();
    }
    public function getTotalAttribute()
    {
        return count($this->contactIds);
    }

}
