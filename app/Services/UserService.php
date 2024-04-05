<?php

namespace App\Services;
use App\Models\MobileNumber;

use Auth;
use DB;

class UserService
{
    public function getMainUsersByMobile($mobile){

        $mobileNumbers = MobileNumber::where('mobileNumber', $mobile)->get();

        $mainUserIds = [];
        foreach($mobileNumbers as $number){
            if(!empty($number->user) && $number->user->role == "mainUser"){
                $mainUserIds[] = $number->user->id;
            }
            else{
                if(!empty($number->user->mainUser)){
                    $mainUserIds[] = $number->user->mainUser->id;
                }
            }

        }

        $mainUserIds = array_unique($mainUserIds);
        
        return $mainUserIds;
    }
    
    public function getMainUserId() {

        $user = Auth::user();

        if($user->role == 'superAdmin'){
            return 0;
        }
        return $user->role == 'mainUser' ? $user->id : $user->mainUserId;

    }
    
}
