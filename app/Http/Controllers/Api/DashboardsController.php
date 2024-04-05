<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\UserService;

use App\Models\Contact;
use App\Models\Deal;
use App\Models\Text;
use App\Models\Call;
use App\Models\CustomField;
use App\Models\CustomFieldValue;

class DashboardsController extends Controller
{
    public function suppressedContactCounty(Request $request)
    {
        $dateFilter = json_decode($request->dateFilter);
        
        $dateFrom = Carbon::parse($dateFilter[0])->toDateTimeString();
        $dateTo = Carbon::parse($dateFilter[1])->toDateTimeString();
        $dateTo = Carbon::parse($dateTo)->addDays(1)->format('Y-m-d');

        $mainUserId = UserService::getMainUserId();

        $countyCustomField = CustomField::where('label', 'county')->where('userId', $mainUserId)->first();

        $counties = CustomFieldValue::distinct()->select('value')->where('value', '!=', '')->where('customFieldId', $countyCustomField->id)->orderBy('value')->pluck('value');
        
        $data = array();

        foreach($counties as $county) {
            $contactIds = CustomFieldValue::distinct()->select('customableId')->where('customFieldId', $countyCustomField->id)
                ->where('value', $county)
                ->pluck('customableId');

           
            $suppressedContacts = CustomFieldValue::select('custom_field_values.*')
            ->join('custom_fields as cf', 'cf.id', '=', 'custom_field_values.customFieldId')
            ->join('texts as t', 't.from', '=', 'custom_field_values.value')
            ->whereIn('cf.type', ['mobile', 'phone'])
            ->whereIn('custom_field_values.customableId', $contactIds)
            ->where('cf.userId', $mainUserId)
            ->where('t.isSuppressed', true)
            ->whereBetween('t.created_at', [$dateFrom, $dateTo])
            ->count();

            $data[] = [
                'county' => $county,
                'Count' => $suppressedContacts
            ];
        }
        
        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

    
    public function statistics(Request $request)
    {
        
        $dateFilter = json_decode($request->dateFilter);
        
        $dateFrom = Carbon::parse($dateFilter[0])->toDateTimeString();
        $dateTo = Carbon::parse($dateFilter[1])->toDateTimeString();
        
        $contacts = Contact::whereBetween('created_at', [$dateFrom, $dateTo])->count();
        $deals = Deal::whereBetween('created_at', [$dateFrom, $dateTo])->count();
        $texts = Text::whereBetween('created_at', [$dateFrom, $dateTo])->where('isFromApp', false)->count();
        $calls = Call::whereBetween('created_at', [$dateFrom, $dateTo])->count();
        
        return response()->json([
            'success' => true,
            'data' => [
                "contacts" => $contacts,
                "deals" => $deals,
                "texts" => $texts,
                "calls" => $calls,
            ],
        ], 200);
    }

}
