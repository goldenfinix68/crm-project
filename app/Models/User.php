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
    ];

    //depreciated, 1 user 1 number
    public function numbers()
    {
        return $this->hasMany(\App\Models\MobileNumber::class, 'userId', 'id');
        
    }

    public function number()
    {
        return $this->hasOne(\App\Models\MobileNumber::class, 'userId', 'id');
        
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

    protected static function boot()
    {
        parent::boot();

        static::created(function ($user) {
            event(new UserCreated($user));
        });
    }
    

//     public function getNumbersAttribute()
//     {
//         return $this->mobileNumbers;
//     }
}
