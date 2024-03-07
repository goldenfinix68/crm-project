<?php

namespace App\Models;
use App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GSheetCrawlResult extends Model
{
    use HasFactory;
    
    protected $casts = [
        'gSheetData' => 'object',
        'result' => 'object',
        'columnMappings' => 'object',
    ];
    
    protected $appends = [
        'importedCount', 
    ];

    public function user()
    {
        return $this->belongsTo('\App\Models\User', 'mainUserId', 'id');
    }
    

    public function contacts()
    {
        return $this->hasMany('\App\Models\Contact', 'batchUuid', 'batchUuid');
    }

    public function getImportedCountAttribute()
    {
        return $this->contacts()->count();
    }
}
