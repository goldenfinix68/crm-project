<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DealPipeline extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'name',
        'userId'
    ];

    public function stages()
    {
        return $this->hasMany('\App\Models\DealPipelineStage', 'dealPipelineId', 'id')
                    ->orderByRaw("CAST(`sort` AS SIGNED)");
    }
}
