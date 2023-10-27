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
}
