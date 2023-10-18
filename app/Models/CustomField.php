<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomField extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'fieldName',
        'customFieldSectionId',
        'customFieldSectionType',
        'type',
        'sort',
        'userId',
        'isRequired',
    ];
    
    public function section()
    {
        return $this->belongsTo('\App\Models\CustomFieldSection', 'customFieldSectionId', 'id');
    }
}
