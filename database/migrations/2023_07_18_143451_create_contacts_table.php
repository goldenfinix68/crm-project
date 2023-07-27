<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsTable extends Migration
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
            $table->string('mobile')->nullable();
            $table->string('countryLink')->nullable();
            $table->string('acres')->nullable();
            $table->string('email')->nullable();
            $table->string('jobTitle')->nullable();
            $table->string('phone')->nullable();
            $table->string('otherPhone')->nullable();
            $table->unsignedInteger('ownerId');
            $table->string('email2')->nullable();
            $table->string('typeId')->nullable();
            $table->string('mailingStreetAddress')->nullable();
            $table->boolean('emailOptOut')->default(false);
            $table->string('mailingCity')->nullable();
            $table->string('mailingCountry')->nullable();
            $table->string('subdivision')->nullable();
            $table->string('APN')->nullable();
            $table->string('gMapLink')->nullable();
            $table->string('roadFrontage')->nullable();
            $table->string('redfinLink')->nullable();
            $table->string('openingBid')->nullable();
            $table->string('assessedValue')->nullable();
            $table->string('assessedVsOpeningMargin')->nullable();
            $table->string('assessedVsOpeningMultiple')->nullable();
            $table->string('legalDescription')->nullable();
            $table->string('legalSubdivision')->nullable();
            $table->boolean('floodzone')->default(false);
            $table->string('topography')->nullable();
            $table->string('wireless1')->nullable();
            $table->string('wireless2')->nullable();
            $table->string('wireless3')->nullable();
            $table->string('wireless4')->nullable();
            $table->string('landline1')->nullable();
            $table->string('landline2')->nullable();
            $table->string('landline3')->nullable();
            $table->string('landline4')->nullable();
            $table->string('marketAreaName')->nullable();
            $table->string('skype')->nullable();
            $table->string('website')->nullable();
            $table->string('facebook')->nullable();
            $table->string('linkedIn')->nullable();
            $table->string('twitter')->nullable();
            $table->string('instagram')->nullable();
            $table->string('detailsDescription')->nullable();
            $table->string('tags')->nullable();
            $table->string('detailsLegalDescription')->nullable();
            $table->string('addressLine1')->nullable();
            $table->string('addressLine2')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('zipCode')->nullable();
            $table->string('state')->nullable();
            $table->timestamps();
            $table->softDeletes();
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
