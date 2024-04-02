<?php

namespace App\Services;
use App\Models\MobileNumber;

use DB;

class TextService
{
    public function containsStopWord($message, $stopWordList){
        
        foreach ($stopWordList as $stopWord) {
            // Case-insensitive check for stop word in the message
            if (stripos($message, $stopWord) !== false) {
                return true;
            }
        }
        return false;
    }
    
}
