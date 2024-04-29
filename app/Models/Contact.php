<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use App\Http\Controllers\Api\CallsController;
use App\Services\MobileNumberService;
use App\Services\getContactsByMobile;

use App\Models\User;
use App\Models\Contact;
use App\Models\Text;
use App\Models\Call;
use Auth;
use DB;

class Contact extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'firstName',
        'lastName',
        'mobile',
        'countryLink',
        'acres',
        'email',
        'jobTitle',
        'phone',
        'otherPhone',
        'ownerId',
        'email2',
        'typeId',
        'mailingStreetAddress',
        'emailOptOut',
        'mailingCity',
        'mailingCountry',
        'subdivision',
        'APN',
        'gMapLink',
        'roadFrontage',
        'redfinLink',
        'openingBid',
        'assessedValue',
        'assessedVsOpeningMargin',
        'assessedVsOpeningMultiple',
        'legalDescription',
        'legalSubdivision',
        'floodzone',
        'topography',
        'wireless1',
        'wireless2',
        'wireless3',
        'wireless4',
        'landline1',
        'landline2',
        'landline3',
        'landline4',
        'marketAreaName',
        'skype',
        'website',
        'facebook',
        'linkedIn',
        'twitter',
        'instagram',
        'detailsDescription',
        'tags',
        'detailsLegalDescription',
        'addressLine1',
        'addressLine2',
        'city',
        'country',
        'zipCode',
        'state',
        'mailingState',
        'smsOptOut',
        'emailOptOutReason',
        'mailingZip',
        'wetlandsStatus',
        'county',
        'defaultMobileNumber'
    ];

    protected $appends = [
        'fields',
        'phoneNumbers',
        // 'duplicatePhoneNumbers'
    ];


    public function customFieldValues()
    {
        return $this->hasMany(\App\Models\CustomFieldValue::class, 'customableId', 'id')->where('customableType', 'contact');
    }
    
    public function getFieldsAttribute()
    {
        $customFields = [];
        $existingCustomFieldIds = [];
        foreach($this->customFieldValues as $key => $value){
            $existingCustomFieldIds[] = $value->customField->id;
            $customFields[$value->customField->fieldName] = $value->value;
            if(!empty($value->lookupIds)){
                $customFields[$value->customField->fieldName.'lookupIds'] = $value->lookupIds;
            }
            $customFields[$value->customField->fieldName.'Id'] = $value->id;
            $customFields[$value->customField->fieldName.'Status'] = $value->status;
        }
        $customFields['contactId'] = $this->id;
        $customFields['defaultMobileNumber'] = $this->defaultMobileNumber;


        $userContactFields = \App\Models\CustomField::where('userId', $this->user->id)
            ->whereNotIn('id', $existingCustomFieldIds)
            ->get();
        foreach($userContactFields as $customField){
            $customFields[$customField->fieldName] = null;
            $customFields[$customField->fieldName.'lookupIds'] = null;
            $customFields[$customField->fieldName.'Id'] = null;
            $customFields[$customField->fieldName.'Status'] = null;
        }

        return $customFields;

    }

    public function getPhoneNumbersAttribute()
    {
        $phoneNumbers = $this->customFieldValues()
            ->join('custom_fields', 'custom_fields.id', '=', 'custom_field_values.customFieldId')
            ->whereIn('custom_fields.type', ['mobile', 'phone'])
            ->where('value', '!=', "")
            ->pluck('value')
            ->toArray();

        return array_unique($phoneNumbers);
    }

    public function getDuplicatePhoneNumbersAttribute()
    {
        // return [];
        
        $user = Auth::user();

        $uniquePhoneNumbers = $this->phoneNumbers;
        
        $contacts = \App\Models\Contact::where('userId', $user->mainId)
            ->where('id', "!=", $this->id)
            ->whereHas('customFieldValues', function ($query) use ($uniquePhoneNumbers) {
                $query->whereIn('value', $uniquePhoneNumbers);
                $query->whereHas('customField', function ($query2) {
                    $query2->where('type', 'mobile');
                    $query2->orWhere('type', 'phone');
                });
            })
        ->get();

        $duplicates = [];
        foreach ($contacts as $contact) {
            $duplicates[] = $contact->fields['firstName'] . ' ' . $contact->fields['lastName'];
        }

        return $duplicates;
    }



    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function type()
    {
        return $this->hasOne(\App\Models\ContactType::class, 'id', 'typeId');
    }

    public function notes()
    {
        return $this->hasMany(\App\Models\Note::class, 'contactId', 'id')->with(['user']);
    }

    public function texts()
    {
        if (empty($this->phoneNumbers)) {
            return [];
        }
        $texts = Text::where(function ($query) {
            $query->orWhereIn('to', $this->phoneNumbers)
                ->orWhereIn('from', $this->phoneNumbers);
        })
            ->where('isSuppressed', false)
            ->orderBy('id', 'desc')
            ->get();
        return $texts;
    }

    public function call()
    {
        if (empty($this->phoneNumbers)) {
            return [];
        }
        \Log::info('phoneNumbers');
        \Log::info($this->phoneNumbers);
        $data = [];
        $calls = Call::select('*')
            ->where(function ($query) {
                $query->orWhereIn('to', $this->phoneNumbers)
                    ->orWhereIn('from', $this->phoneNumbers);
            })
            ->whereRaw("TIME_TO_SEC(duration) >= 30")
            ->orderBy('id', 'desc');
        // \Log::info($calls->toSql());
        $calls = $calls->get();
        // \Log::info('calls');
        // \Log::info($calls);
        $callsController = new CallsController();

        foreach($calls as $call){
            $data[] = $callsController->prepareCall($call);
        }

        return collect($data);
    }

    public function deals()
    {
        return $this->hasMany(\App\Models\Deal::class, 'contactId', 'id')->with(['creator', 'stage']);
    }
    public function deal()
    {
        return $this->hasOne(\App\Models\Deal::class, 'contactId', 'id')->with(['creator', 'stage', 'pipeline', 'pipeline.stages']);
    }

    public function contactUpdates()
    {
        return $this->hasMany(\App\Models\ContactUpdate::class, 'contactId', 'id')->where('logable_type', 'contact');
    }

    public function dealUpdates()
    {
        return $this->hasMany(\App\Models\ContactUpdate::class, 'contactId', 'id')->where('logable_type', 'deal');
    }

    public function log()
    {
        return $this->hasMany(\App\Models\ContactLog::class, 'contact_id', 'id')->with('owner');
    }

    public function activity()
    {
        return $this->hasMany(\App\Models\Activity::class, 'contact_id', 'id')->with('owner');
    }

    public function files()
    {
        return $this->hasMany(\App\Models\ContactFile::class, 'contact_id', 'id')->with('uploaded_by');
    }

    public function wall()
    {
        $data = new Collection();

        $notes = $this->notes->map(function ($data) {
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'note',
                'date' => $data->created_at,
                'day' => $createdAt->format('j'),
                'month' => $createdAt->format('F'),
                'year' => $createdAt->format('Y'),
                'note' => $data,
            ];
        });

        $call = $this->call() ? $this->call()->map(function ($data) {
            $createdAt = Carbon::parse($data['dateTime']);
            return [
                'type' => 'call',
                'date' => $createdAt,
                'day' => $createdAt->format('j'),
                'month' => $createdAt->format('F'),
                'year' => $createdAt->format('Y'),
                'time' => $createdAt->format('h:i A'),
                'call' => $data,
            ];
        }) : null;

        $texts = $this->texts() ? $this->texts()->map(function ($data) {
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'text',
                'date' => $data->created_at,
                'day' => $createdAt->format('j'),
                'month' => $createdAt->format('F'),
                'year' => $createdAt->format('Y'),
                'time' => $createdAt->format('h:i A'),
                'text' => $data,
            ];
        }) : null;

        $deals = $this->deals->map(function ($data) {
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'deal',
                'date' => $data->created_at,
                'day' => $createdAt->format('j'),
                'month' => $createdAt->format('F'),
                'year' => $createdAt->format('Y'),
                'deal' => $data,
            ];
        });

        // $activity = $this->activity->map(function ($data) {
        //     $createdAt = Carbon::parse($data->created_at);
        //     return [
        //         'type' => 'activities',
        //         'date' => $data->created_at,
        //         'day' => $createdAt->format('j'),
        //         'month' => $createdAt->format('F'),
        //         'year' => $createdAt->format('Y'),
        //         'activity' => $data,
        //     ];
        // });

        $dealUpdates = $this->dealUpdates->map(function ($data) {
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'dealUpdates',
                'date' => $data->created_at,
                'day' => $createdAt->format('j'),
                'month' => $createdAt->format('F'),
                'year' => $createdAt->format('Y'),
                'update' => $data,
            ];
        });
        $contactUpdates = $this->contactUpdates->map(function ($data) {
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'contactUpdates',
                'date' => $data->created_at,
                'day' => $createdAt->format('j'),
                'month' => $createdAt->format('F'),
                'year' => $createdAt->format('Y'),
                'update' => $data,
            ];
        });
        $log = $this->log->map(function ($data) {
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'activity log',
                'date' => $data->created_at,
                'day' => $createdAt->format('j'),
                'month' => $createdAt->format('F'),
                'year' => $createdAt->format('Y'),
                'update' => $data,
            ];
        });
        $files = $this->files->map(function ($data) {
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'files',
                'date' => $data->created_at,
                'day' => $createdAt->format('j'),
                'month' => $createdAt->format('F'),
                'year' => $createdAt->format('Y'),
                'file' => $data,
            ];
        });

        $data = $data->merge($notes)
            ->merge($texts)
            ->merge($deals)
            ->merge($log)
            ->merge($files)
            ->merge($contactUpdates)
            ->merge($dealUpdates)
            ->merge($call);
            // ->merge($activity);

        // Sort the combined data array based on the 'date' in ascending order
        $sortedData = $data->sortByDesc('date')->values()->all();

        return $sortedData;
    }
}
