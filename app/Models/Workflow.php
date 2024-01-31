<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Workflow extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'type',
        'action',
        'startOn',
        'batchQuantity',
        'repeatAfter',
        'repeatAfterType',
        'sendOn',
        'startFrom',
        'endsAt',
        'message',
        'contactIds',
        'timezone',
        'userId',
        'phoneTypeCustomFieldId',
    ];
    protected $appends = [
        'total',
        'completedAt'
    ];
    
    public function user()
    {
        return $this->belongsTo('\App\Models\User', 'userId', 'id');
    }

    public function items()
    {
        return $this->hasMany('\App\Models\WorkflowItem', 'workflowId', 'id')->orderBy('id', 'desc');
    }

    // Mutator: Serialize array to JSON before saving to the database
    public function setSendOnAttribute($value)
    {
        $this->attributes['sendOn'] = json_encode($value);
    }

    // Accessor: Deserialize JSON string to an array when retrieving from the database
    public function getSendOnAttribute($value)
    {
        return json_decode($value, true);
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
    
    public function getTotalAttribute()
    {
        return count($this->contactIds);
    }
    
    public function getCompletedAtAttribute()
    {
        // $texts = $this->load('items.texts');
        $ids = $this->items->pluck('id');
        $text = Text::whereIn('workflowItemId', $ids)->orderBy('id', 'desc')->first();
       
        return !empty($text) ? $text->created_at : "";
    }
}
