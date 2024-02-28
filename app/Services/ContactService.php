<?php

namespace App\Services;
use App\Models\Contact;
use App\Models\CustomFieldValue;

use App\Services\MobileNumberService;

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
                ->whereHas('contact', function ($query) use ($mainUserId) {
                    $query->where('userId', $mainUserId);
                })
                ->first();
                
        if(!empty($fieldValue) && !empty($fieldValue->contact)){
            return $fieldValue->contact;
        }

        return false;
    }
    
    public function getContactsByMobile($mobile, $fieldName = "mobile", $mainUserIds){

        $mobile = MobileNumberService::formatPhoneNumber($mobile);

        $contacts = Contact::whereIn('userId', $mainUserIds)
            ->whereHas('customFieldValues', function ($query) use ($mobile) {
                $query->where(DB::raw("REPLACE(`value`, '+', '')"), $mobile);
                $query->whereHas('customField', function ($query2) {
                    $query2->where('type', 'mobile');
                    $query2->orWhere('type', 'phone');
                });
            })
            ->get();

        return $contacts;
    }
}
