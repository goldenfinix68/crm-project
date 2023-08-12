<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Carbon\Carbon;

use App\Models\User;
use App\Models\Text;

class Contact extends Model
{
    use HasFactory;

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
        'county'
    ];

    protected $appends = [
        'wall',
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

    public function texts()
    {
        $texts = Text::where('to', 'like', '%'.$this->mobile.'%')->orderBy('id', 'desc')->get();
        return $texts;
    }

    public function deals()
    {
        return $this->hasMany(\App\Models\Deal::class, 'contactId', 'id');
    }

    public function updates()
    {
        return $this->hasMany(\App\Models\ContactUpdate::class, 'contactId', 'id');
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

        $texts = $this->texts()->map(function ($data) {
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
        });

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

        $data = $data->merge($notes)->merge($texts)->merge($deals)->merge($updates);

        // Sort the combined data array based on the 'date' in ascending order
        $sortedData = $data->sortByDesc('date')->values()->all();

        return $sortedData;
    }
}
