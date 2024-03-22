<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Contact;
use App\Models\CustomFieldValue;
use App\Models\ContactType;
use App\Models\User;
use Auth;
use DB;
use App\Services\MobileNumberService;

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
        $mobile = str_replace('+', '', $mobile);
        $mobile = str_replace(' ', '', $mobile);
        $mobile = str_replace('-', '', $mobile);
        $fieldValue = CustomFieldValue::with(['customField'])
                ->where(DB::raw("REPLACE(`value`, '+', '')"), $mobile)
                ->where('customableType', 'contact')
                ->whereHas('customField', function ($query) {
                    $query->where('type', 'mobile');
                })
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
    
    public function createOrUpdateCustomFieldValue($customableId, $customField, $customableType, $value)
    {
        $fieldValue = CustomFieldValue::where('customableId', $customableId)->where('customFieldId', $customField->id)->first();
        if(empty($fieldValue)){
            $fieldValue = new CustomFieldValue();
        }

        $fieldValue->customableId = $customableId;
        $fieldValue->customableType = $customableType;
        $fieldValue->customFieldId = $customField->id;


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
            if($customField->type == "tag" && !empty($value)) {
                $value = array_unique($value);
                $data = implode(", ", $value);
            }
            if(in_array($customField->type, ['multiSelect']) && !empty($value)){
                $data = implode(", ", $value);
            }
            $fieldValue->lookupIds = json_encode($value);
            $fieldValue->value =  $data ?? "";
        }
        else{
            if($customField->type == "mobile" || $customField->type == "phone"){
                $value = MobileNumberService::formatPhoneNumber($value);
            }
            $fieldValue->value =  $value;
            $fieldValue->lookupIds = null;
        }
        $fieldValue->save();
        
        return $fieldValue;
    }
    
    public function getMainUserId() {

        $user = Auth::user();

        if($user->role == 'superAdmin'){
            return 0;
        }
        return $user->role == 'mainUser' ? $user->id : $user->mainUserId;

    }
    
    public function getMainUserNumbers($isRawNumbers = false) {

       $mainUserId = $this->getMainUserId();

       $users = User::where('id', $this->getMainUserId())->orWhere('mainUserId', $this->getMainUserId())->get();
        // dd($users->pluck('numbers')->flatten()->pluck('mobileNumber'));
    
        if($isRawNumbers){
            $numbers = $users->pluck('numbers')->flatten()->unique(function ($user) {
                return str_replace('+', '', $user['mobileNumber']);
            });
        }
        else{
            $numbers = $users->pluck('numbers')->flatten()->pluck('mobileNumber');
        }
       return  $numbers;
    }
    
    public function spinContent($content) {
        // Use a regular expression to find and replace the spin syntax
        $pattern = '/\[([^\[\]]+)\]/';
        preg_match_all($pattern, $content, $matches);
        if (empty($matches[0])) {
            return array($content);
        }
    
        // Initialize an array to store spun content variations
        $variations = array($content);
    
        // Iterate through each match and generate all possible combinations
        foreach ($matches[0] as $match) {
            $options = explode('|', trim($match, '{}'));
            $newVariations = array();
            
            foreach ($variations as $variant) {
                foreach ($options as $option) {
                    $newVariations[] = str_replace($match, $option, $variant);
                }
            }
    
            // Update the array of variations
            $variations = $newVariations;
        }
    
        return $variations;
    }

}
