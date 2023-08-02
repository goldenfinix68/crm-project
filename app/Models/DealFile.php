<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DealFile extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function uploaded_by()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'uploaded_by');
    }
}
