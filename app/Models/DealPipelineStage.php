<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DealPipelineStage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'dealPipelineId',
        'sort',
    ];
    
    public function pipeline()
    {
        return $this->belongsTo('\App\Models\DealPipeline', 'dealPipelineId', 'id');
    }
    
    public function deals()
    {
        return $this->hasMany('\App\Models\Deal', 'stageId', 'id')->orderBy('sort');
    }
}
