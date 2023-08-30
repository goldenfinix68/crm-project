<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddScheduleTexts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('texts', function (Blueprint $table) {
            $table->boolean('queueLock')->default(false);
            $table->string('schedule')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('texts', function (Blueprint $table) {
            $table->dropColumn('queueLock');
            $table->dropColumn('schedule');
        });
    }
}
