<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTelnyxNumberIdMobileNumbers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mobile_numbers', function (Blueprint $table) {
            $table->string('telnyxMobileId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mobile_numbers', function (Blueprint $table) {
            $table->dropColumn('telnyxMobileId');
        });
    }
}
