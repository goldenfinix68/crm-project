<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeDefaultMobileNumberIdDefaultMobileNumberContacts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->renameColumn('defaultMobileNumberId', 'defaultMobileNumber');
        });
    }

    public function down()
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->renameColumn('defaultMobileNumber', 'defaultMobileNumberId');
        });
    }
}
