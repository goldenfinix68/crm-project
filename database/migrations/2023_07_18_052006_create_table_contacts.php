<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableContacts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('firstName');
            $table->string('lastName');
            $table->string('mobile');
            $table->string('countryLink');
            $table->string('acres');
            $table->string('email');
            $table->string('jobTitle');
            $table->string('phone');
            $table->string('otherPhone');
            $table->string('owner');
            $table->string('email2');
            $table->string('type');
            $table->string('mailingStreetAddress');
            $table->tinyInteger('emailOptOut');
            $table->string('mailingCity');
            $table->string('mailingState');
            $table->tinyInteger('smsOptOut');
            $table->string('emailOptOutReason');
            $table->string('mailingZip');
            $table->string('mailingCounty');
            $table->string('subdivision1');
            $table->string('apn');
            $table->string('googleMapLink');
            $table->string('roadFrontage');
            $table->string('redfinQuickLink');
            $table->string('openingBid');
            $table->string('assessedVsOpeningBidMultiple');
            $table->string('wetlandsStatus');
            $table->string('legalDescription1');
            $table->string('subdivision2');
            $table->string('floodZone');
            $table->string('topography');
            $table->string('wireless1');
            $table->string('wireless2');
            $table->string('wireless3');
            $table->string('wireless4');
            $table->string('landline1');
            $table->string('landline2');
            $table->string('landline3');  
            $table->string('landline4');  
            $table->string('skype');  
            $table->string('website');  
            $table->string('facebook');  
            $table->string('linkedin');  
            $table->string('twitter');  
            $table->string('instagram');  
            $table->string('description');  
            $table->string('tags');  
            $table->string('legalDescription2');  
            $table->string('addressLine1');  
            $table->string('addressLine2');  
            $table->string('city');  
            $table->string('county');  
            $table->string('zipCode');  
            $table->string('state');  
            $table->string('country');  
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contacts');
    }
}
