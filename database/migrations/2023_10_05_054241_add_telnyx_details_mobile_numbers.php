<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTelnyxDetailsMobileNumbers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mobile_numbers', function (Blueprint $table) {
            $table->string('telnyxId')->nullable();
            $table->string('messagingProfileId')->nullable();
            $table->string('connectionId')->nullable();
            $table->string('sipTrunkUsername')->nullable();
            $table->string('sipTrunkPassword')->nullable();
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
            $table->dropColumn('telnyxId');
            $table->dropColumn('messagingProfileId');
            $table->dropColumn('connectionId');
            $table->dropColumn('sipTrunkUsername');
            $table->dropColumn('sipTrunkPassword');
        });
    }
}
