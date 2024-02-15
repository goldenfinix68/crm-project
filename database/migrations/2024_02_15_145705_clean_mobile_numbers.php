<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CleanMobileNumbers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mobile_numbers', function (Blueprint $table) {
            $table->dropColumn('messagingProfileId');
            $table->dropColumn('connectionId');
            $table->dropColumn('sipTrunkUsername');
            $table->dropColumn('sipTrunkPassword');
            $table->dropColumn('telnyxMobileId');
            $table->dropColumn('telnyxId');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
