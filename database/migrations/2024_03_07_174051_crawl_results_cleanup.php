<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CrawlResultsCleanup extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('g_sheet_crawl_results', function (Blueprint $table) {
            $table->dropColumn('gSheetData');
            $table->dropColumn('result');
        });

        
        Schema::table('g_sheet_crawl_results', function (Blueprint $table) {
            $table->string('batchUuid')->nullable();
            $table->string('rowCount')->nullable();
            $table->string('status')->nullable();
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
            $table->json('gSheetData')->nullable();
            $table->json('result')->nullable();
        });
        
        Schema::table('g_sheet_crawl_results', function (Blueprint $table) {
            $table->dropColumn('batchUuid');
            $table->dropColumn('rowCount');
            $table->dropColumn('status');
        });
    }
}
