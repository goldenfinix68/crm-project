<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

use App\Models\User;
use App\Models\Text;
use App\Models\Call;
use Auth;

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
        'wall',
        'texts',
        'fields',
        'phoneNumbers',
        'duplicatePhoneNumbers'
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
        $phoneNumbers = [];
        foreach($this->customFieldValues as $customField){
            if(in_array($customField->customField->type, ['phone', 'mobile'])){
                $phoneNumbers[] = $customField->value;
            }
        }

        return array_filter($phoneNumbers, function ($value) {
            return $value !== null;
        });
    }

    public function getDuplicatePhoneNumbersAttribute()
    {
        $user = Auth::user();

        if(empty($user) || empty($user->contacts)){
            return [];
        }

        $duplicates = [];
        foreach ($user->contacts as $contact) {
            // Perform intersection on non-null values
            $commonValues = array_intersect($this->phoneNumbers, $contact->phoneNumbers);

            if (!empty($commonValues) && $this->id != $contact->id) {
                $duplicates[] = $contact->fields['firstName'] . ' ' . $contact->fields['lastName'];
            }
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
        return $this->hasMany(\App\Models\Note::class, 'contactId', 'id');
    }

    public function texts()
    {
        if (empty($this->mobile)) {
            return [];
        }
        $texts = Text::where(function ($query) {
            $query->orWhere('to', $this->mobile)
                ->orWhere('from', $this->mobile);
        })
            ->orderBy('id', 'desc')
            ->get();
        return $texts;
    }

    public function call()
    {
        if (empty($this->mobile)) {
            return [];
        }
        $call = Call::where(function ($query) {
            $query->where('to', $this->mobile)
                ->orWhere('from', $this->mobile);
        })
            ->orderBy('id', 'desc')
            ->get();
        return $call;
    }

    public function deals()
    {
        return $this->hasMany(\App\Models\Deal::class, 'contactId', 'id')->with(['creator', 'stage']);
    }
    public function deal()
    {
        return $this->hasOne(\App\Models\Deal::class, 'contactId', 'id')->with(['creator', 'stage', 'pipeline', 'pipeline.stages']);
    }

    public function updates()
    {
        return $this->hasMany(\App\Models\ContactUpdate::class, 'contactId', 'id');
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


    public function getTextsAttribute()
    {
        return $this->texts();
    }
    public function getWallAttribute()
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
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'call',
                'date' => $data->created_at,
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

        $activity = $this->activity->map(function ($data) {
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'activities',
                'date' => $data->created_at,
                'day' => $createdAt->format('j'),
                'month' => $createdAt->format('F'),
                'year' => $createdAt->format('Y'),
                'activity' => $data,
            ];
        });

        $updates = $this->updates->map(function ($data) {
            $createdAt = Carbon::parse($data->created_at);
            return [
                'type' => 'update',
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
                'update' => $data,
            ];
        });

        $data = $data->merge($notes)->merge($texts)->merge($deals)->merge($updates)->merge($log)->merge($files)->merge($call)->merge($activity);

        // Sort the combined data array based on the 'date' in ascending order
        $sortedData = $data->sortByDesc('date')->values()->all();

        return $sortedData;
    }
}
