<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkflowItem extends Model
{
    use HasFactory;

    
    public function workflow()
    {
        return $this->hasOne(\App\Models\Workflow::class, 'id', 'workflowId');
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
}
