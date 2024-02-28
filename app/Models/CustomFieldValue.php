<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomFieldValue extends Model
{
    use HasFactory;
    
    public function customField()
    {
        return $this->hasOne(\App\Models\CustomField::class, 'id', 'customFieldId');
    }

    public function contact()
    {
        return $this->hasOne(\App\Models\Contact::class, 'id', 'customableId');
    }
}
