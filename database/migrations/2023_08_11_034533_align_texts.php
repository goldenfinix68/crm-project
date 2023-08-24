<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlignTexts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('texts', function (Blueprint $table) {
            $table->string('telnyxId')->nullable();
            $table->string('status')->nullable();
            $table->longText('telnyxResponse')->nullable();
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
            $table->dropColumn('telnyxId');
            $table->dropColumn('status');
            $table->dropColumn('telnyxResponse');
        });
    }
}
