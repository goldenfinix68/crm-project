<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GSheetCrawlResult extends Model
{
    use HasFactory;
    
    protected $casts = [
        'gSheetData' => 'object',
        'result' => 'object',
    ];

}
