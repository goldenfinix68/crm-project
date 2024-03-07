<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnMappingsCrawAndCrawlResults extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('g_sheet_crawls', function (Blueprint $table) {
            $table->string('gSheetName');
            $table->json('columnMappings')->nullable();
        });
        Schema::table('g_sheet_crawl_results', function (Blueprint $table) {
            $table->string('gSheetName');
            $table->json('columnMappings')->nullable();
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
            $table->dropColumn('gSheetName');
            $table->dropColumn('columnMappings');
        });
        Schema::table('g_sheet_crawl_results', function (Blueprint $table) {
            $table->dropColumn('gSheetName');
            $table->dropColumn('columnMappings');
        });
    }
}
