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
        'defaultMobileNumberId'
    ];

    protected $appends = [
        'wall',
        'texts',
        'defaultMobileNumber',
    ];


    public function owner()
    {
        return $this->belongsTo(User::class, 'ownerId');
    }

    public function type()
    {
        return $this->hasOne(\App\Models\ContactType::class, 'id', 'typeId');
    }

    public function notes()
    {
        return $this->hasMany(\App\Models\Note::class, 'contactId', 'id');
    }

    public function defaultMobile()
    {
        return $this->hasOne(\App\Models\MobileNumber::class, 'id', 'defaultMobileNumberId');
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
        return $this->hasMany(\App\Models\Deal::class, 'contactId', 'id')->with('owner1');
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


    public function getDefaultMobileNumberAttribute()
    {
        return $this->defaultMobile;
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
