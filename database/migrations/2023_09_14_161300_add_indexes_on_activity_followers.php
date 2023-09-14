<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexesOnActivityFollowers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('activity_followers', function (Blueprint $table) {
            $table->index('activity_id');
            $table->index('from_id');
            $table->index('from_table');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('activity_followers', function (Blueprint $table) {
            $table->dropIndex(['activity_id', 'from_id', 'from_table']);
        });
    }
}
