<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use App\Events\UserCreated;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    protected $appends = [
        'mainId', 
        'fullName',
        'settings',
    ];

    public function numbers()
    {
        return $this->hasMany(\App\Models\MobileNumber::class, 'userId', 'id');
        
    }

    public function contacts()
    {
        return $this->hasMany(\App\Models\Contact::class, 'userId', 'id');
        
    }

    public function customFields()
    {
        return $this->hasMany(\App\Models\CustomField::class, 'userId', 'id');
        
    }

    public function number()
    {
        return $this->hasOne(\App\Models\MobileNumber::class, 'userId', 'id');
        
    }

    public function getSettingsAttribute()
    {
        $id = $this->mainUserId;
        if($this->role == 'mainUser'){
            $id = $this->id;
        }
        return \App\Models\UserSetting::where('mainUserId', $id)->first();
        
    }

    public function mainUser()
    {
        return $this->hasOne(\App\Models\User::class, 'id', 'mainUserId');
        
    }
    public function getMainIdAttribute()
    {
        if($this->role == 'superAdmin'){
            return 0;
        }
        return $this->role == 'mainUser' ? $this->id : $this->mainUserId;
    }

    public function getFullNameAttribute()
    {
        return $this->firstName . ' ' . $this->lastName;
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($user) {
            event(new UserCreated($user));
        });
    }
    
    public function toArray()
    {
        $array = parent::toArray();

        // Format mobile numbers before adding them to the array
        $formattedNumbers = $this->numbers->map(function ($number) {
            $number->mobileNumber = preg_replace("/^(\d{3})(\d{3})(\d{4})$/", "($1) $2-$3", $number->mobileNumber);
            return $number;
        });

        $array['mobileNumbers'] = $formattedNumbers;

        return $array;
    }

    

//     public function getNumbersAttribute()
//     {
//         return $this->mobileNumbers;
//     }
}
