<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTelnyxDetailsUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('telnyxConnectionId')->nullable();
            $table->string('telnyxConnectionName')->nullable();
            $table->string('telnyxConnectionUserName')->nullable();
            $table->string('telnyxConnectionPassword')->nullable();
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
            $table->dropColumn('telnyxConnectionId');
            $table->dropColumn('telnyxConnectionName');
            $table->dropColumn('telnyxConnectionUserName');
            $table->dropColumn('telnyxConnectionPassword');
        });
    }
}
