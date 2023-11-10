<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSortCallForwardingUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('sortCallForwarding')->default(0);
            $table->string('mainUserId')->nullable();
            $table->string('forwardingType')->default('off');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('sortCallForwarding');
            $table->dropColumn('mainUserId');
            $table->dropColumn('forwardingType');
        });
    }
}