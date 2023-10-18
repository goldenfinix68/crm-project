<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomFieldSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'columnLayout',
        'userId',
        'type',
        'sort',
    ];

    
    public function fields()
    {
        return $this->hasMany('\App\Models\CustomField', 'customFieldSectionId', 'id')->where('isActive', true)->orderBy('sort');
    }
    
    public function inactivefields()
    {
        return $this->hasMany('\App\Models\CustomField', 'customFieldSectionId', 'id')->where('isActive', false)->orderBy('sort');
    }
}
