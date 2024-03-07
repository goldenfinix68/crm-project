<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGSheetNameGSheetCrawls extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('g_sheet_crawls', function (Blueprint $table) {
            $table->string('roorAutoresponderId');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('g_sheet_crawls', function (Blueprint $table) {
            $table->dropColumn('roorAutoresponderId');
        });
    }
}
