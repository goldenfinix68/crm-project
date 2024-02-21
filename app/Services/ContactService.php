<?php

namespace App\Services;
use App\Models\Contact;
use App\Models\CustomFieldValue;

use DB;

class ContactService
{
    public function getContactByMobile($mobile, $fieldName = "mobile"){

        $mobile = str_replace('+', '', $mobile);

        $fieldValue = CustomFieldValue::with(['customField'])
                ->where(DB::raw("REPLACE(`value`, '+', '')"), $mobile)
                ->where('customableType', 'contact')
                ->whereHas('customField', function ($query) use ($fieldName) {
                    $query->where('fieldName', $fieldName);
                })
                ->first();
        if(!empty($fieldValue)){
            $contact = Contact::find($fieldValue->customableId);
            return $contact;
        }

        return false;
    }
}
