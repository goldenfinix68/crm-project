<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUrlRecordingToCallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('calls', function (Blueprint $table) {
            $table->longText('url_recording')->nullable();
            $table->string('status')->nullable();
            $table->string('disposition')->nullable();
            $table->string('duration')->nullable();
            $table->string('call_received_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('calls', function (Blueprint $table) {
            $table->dropColumn('url_recording');
            $table->dropColumn('status');
            $table->dropColumn('disposition');
            $table->dropColumn('duration');
            $table->dropColumn('call_received_date');
        });
    }
}
