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
        'type',
        'sort',
        'userId',
    ];
    
    public function section()
    {
        return $this->belongsTo('\App\Models\CustomFieldSection', 'customFieldSectionId', 'id');
    }
}
