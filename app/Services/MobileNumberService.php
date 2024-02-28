<?php

namespace App\Services;

use DB;

class MobileNumberService
{
    public function formatPhoneNumber($phoneNumber){
        // Remove non-digit characters
        $phoneNumber = preg_replace('/\D/', '', $phoneNumber);
            
        // Check if the number starts with '+'
        if (strpos($phoneNumber, '+') === 0) {
            // Remove the leading '+' if present
            $phoneNumber = substr($phoneNumber, 1);
        }
        
        // Check if the number length is 11 (including country code)
        if (strlen($phoneNumber) === 11) {
            // Remove the country code (1 for US)
            $phoneNumber = substr($phoneNumber, 1);
        }
        
        return $phoneNumber;
    }
}
