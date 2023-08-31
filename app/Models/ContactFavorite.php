<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactFavorite extends Model
{
    use HasFactory;
    protected $table = 'contacts_favorites';
    protected $guarded = [];
    
}

