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
    
    public function getValueAttribute($value)
    {
        if ($this->customField && ($this->customField->type === 'mobile' || $this->customField->type === 'phone')) {
            // Format phone number to US format (XXX) XXX-XXXX
            return preg_replace("/^(\d{3})(\d{3})(\d{4})$/", "($1) $2-$3", $value);
        }

        return $value;
    }
}
