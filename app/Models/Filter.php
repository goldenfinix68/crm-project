<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filter extends Model
{
    use HasFactory;
    
    protected $casts = [
        'filters' => 'object',
    ];

    protected $fillable = [
        'name',
        'type',
        'filters',
        'userId',
    ];
}
