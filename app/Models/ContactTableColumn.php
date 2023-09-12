<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactTableColumn extends Model
{
    use HasFactory;

    protected $guarded=[];
    protected $table = "contacts_table_column";
}
