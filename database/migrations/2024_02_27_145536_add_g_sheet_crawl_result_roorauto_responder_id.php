<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGSheetCrawlResultRoorautoResponderId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('g_sheet_crawl_results', function (Blueprint $table) {
            $table->string('roorAutoresponderId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('g_sheet_crawl_results', function (Blueprint $table) {
            $table->dropColumn('roorAutoresponderId');
        });
    }
}
