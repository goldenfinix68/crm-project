<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TextLabel extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'userId',
    ];

    public function threads()
    {
        return $this->belongsToMany(\App\Models\TextThread::class, 'thread_labels_pivot', 'textLabelId', 'textThreadId');
    }
}
