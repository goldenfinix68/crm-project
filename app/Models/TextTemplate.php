<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TextTemplate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'folderId',
        'textMessage',
        'userId',
    ];

    public function user()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'userId');
    }
    
    public function folder()
    {
        return $this->hasOne(\App\Models\TextTemplateFolder::class, 'id', 'folderId');
    }
}
