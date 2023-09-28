<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Contact;
use App\Models\Text;
use Illuminate\Database\Eloquent\SoftDeletes;

class TextThread extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $appends = [
        'contactName',
        'contact'
        // 'lastText'
    ];
    
    public function texts()
    {
        return $this->hasMany(\App\Models\Text::class, 'threadId', 'id')->orderBy('id', 'desc');
    }

    public function labels()
    {
        return $this->belongsToMany(\App\Models\TextLabel::class, 'thread_labels_pivot', 'textThreadId', 'textLabelId')->orderBy('name');
    }

    public function getContactAttribute()
    {
        return Contact::where('mobile', $this->contactNumber)->first();
    }

    public function getContactNameAttribute()
    {
        return !empty($this->contact) ? $this->contact->firstName . ' ' . $this->contact->lastName : $this->contactNumber;
    }

    // public function getLastTextAttribute()
    // {
    //     return $this->texts->first();
    // }
}
