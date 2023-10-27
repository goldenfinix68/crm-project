<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Contact;
use App\Models\CustomFieldValue;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function bytesToHuman($bytes)
    {
        $units = ['b', 'kb', 'mb', 'gb', 'tb', 'pb'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getContactByMobile($mobile) {

        $fieldValue = CustomFieldValue::with(['customField'])
                ->where('value', $mobile)
                ->where('customableType', 'contact')
                ->whereHas('customField', function ($query) {
                    $query->where('type', 'mobile');
                })
                ->first();

        if(!empty($fieldValue)){
            $contact = Contact::find($fieldValue->customableId);
            return $contact;
        }

        return false;
    }
    
    public function createOrUpdateCustomFieldValue($customableId, $customField, $customableType, $value)
    {
        $fieldValue = CustomFieldValue::where('customableId', $customableId)->where('customFieldId', $customField->id)->first();
        if(empty($fieldValue)){
            $fieldValue = new CustomFieldValue();
        }

        $fieldValue->customableId = $customableId;
        $fieldValue->customableType = $customableType;
        $fieldValue->customFieldId = $customField->id;

        if($customField->type == "userLookup" || $customField->type == "contactLookup" || $customField->type == "contactTypeLookup"){
            //convert if type not multiple

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
            else{
                $data = "";
                $contacts = Contact::with(['customFieldValues', 'customFieldValues.customField'])
                ->whereIn('id', $value)
                ->get();

                foreach($contacts as $index => $contact){
                    $customFields = $contact->fields;
                    $data = $data . ($index == 0 ? "" : ", ") . $customFields['firstName'] . ' ' . $customFields['lastName'];
                }
            }
            $fieldValue->lookupIds = json_encode($value);
            $fieldValue->value =  $data;
        }
        else{
            if($customField->type == "multiSelect"){
                $fieldValue->value = json_encode($value);
            }
            else{
                $fieldValue->value =  $value;
            }
            $fieldValue->lookupIds = null;
        }
        $fieldValue->save();
    }
}
