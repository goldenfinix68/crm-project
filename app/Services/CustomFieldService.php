<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\CustomFieldValue;
use App\Models\User;
use App\Models\ContactType;
use App\Models\ContactUpdate;
use App\Services\MobileNumberService;

use DB;
use Auth;

class CustomFieldService
{
    public function getContactByMobile($mobile, $mainUser)
    {
        $fieldValue = CustomFieldValue::with(['customField'])
            ->where('value', $mobile)
            ->where('customableType', 'contact')
            ->whereHas('customField', function ($query) {
                $query->where('type', 'mobile');
            })
            ->orderBy('id', 'desc')
            ->first();

        if (!empty($fieldValue)) {
            $contact = Contact::where('id', $fieldValue->customableId)->where('userId', $mainUser->id)->first();
            return $contact;
        }

        return false;
    }
    
    public function createOrUpdateCustomFieldValue($customableId, $customField, $customableType, $value)
    {
        $user = Auth::user();

        $fieldValue = CustomFieldValue::where('customableId', $customableId)->where('customFieldId', $customField->id)->first();
        if(empty($fieldValue)){
            $fieldValue = new CustomFieldValue();
        }

        $fieldValue->customableId = $customableId;
        $fieldValue->customableType = $customableType;
        $fieldValue->customFieldId = $customField->id;

        
        $update = new ContactUpdate();
        $update->userId = Auth::id();
        $update->title = $customField->label . " updated";
        $update->contactId = $fieldValue->customableId;
        $update->from = $fieldValue->value;


        if(in_array($customField->type, ["userLookup", 'contactLookup', 'contactTypeLookup', 'multiSelect', 'tag'])){
            //convert if type not multiple
            if($customField->associationType == "single"){
                $value = [$value];
            }

            if($customField->type == "userLookup"){
                $data = User::whereIn('id', $value)
                ->selectRaw('CONCAT(firstName, " ", lastName) as full_name')
                ->pluck('full_name')
                ->implode(', ');
            }
            if($customField->type == "contactTypeLookup"){
                $data = ContactType::whereIn('id', $value)
                ->select('name')
                ->pluck('name')
                ->implode(', ');
            }
            if($customField->type == "contactLookup") {
                $data = "";
                $contacts = Contact::with(['customFieldValues', 'customFieldValues.customField'])
                ->whereIn('id', $value)
                ->get();

                foreach($contacts as $index => $contact){
                    $customFields = $contact->fields;
                    $data = $data . ($index == 0 ? "" : ", ") . $customFields['firstName'] . ' ' . $customFields['lastName'];
                }
            }
            //tag should be unique, remove duplicates
            if($customField->type == "tag") {
                $value = array_unique($value);
                $data = implode(", ", $value);
            }
            if(in_array($customField->type, ['multiSelect'])){
                $data = implode(", ", $value);
            }
            $fieldValue->lookupIds = json_encode($value);
            $fieldValue->value =  $data;
        }
        else{
            if($customField->type == "mobile" || $customField->type == "phone"){
                $value = MobileNumberService::formatPhoneNumber($value);
            }
            $fieldValue->value =  $value;
            $fieldValue->lookupIds = null;
        }
        $fieldValue->save();

        
        $update->to = $fieldValue->value;
        $update->save();
    }
}
