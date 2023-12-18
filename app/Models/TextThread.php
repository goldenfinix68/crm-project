<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Contact;
use App\Models\Text;
use App\Models\CustomFieldValue;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;

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
        $fieldValue = CustomFieldValue::with(['customField'])
                    ->where('value', $this->contactNumber)
                    ->where('customableType', 'contact')
                    ->whereHas('customField', function ($query) {
                        $query->whereIn('type', ['mobile', 'phone']);
                    })
                    ->orderBy('updated_at', 'desc')
                    ->first();

        if(!empty($fieldValue)){
            $contact = Contact::find($fieldValue->customableId);
            $user = Auth::user();
            if(!empty($contact) && $contact->userId == $user->mainId){
                return $contact;
            }
        }

        return false;
    }

    public function getContactNameAttribute()
    {
        return !empty($this->contact) ? $this->contact->fields['firstName'] . ' ' . $this->contact->fields['lastName'] : $this->contactNumber;
    }

    // public function getLastTextAttribute()
    // {
    //     return $this->texts->first();
    // }
}
