<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGSheetCrawlResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('g_sheet_crawl_results', function (Blueprint $table) {
            $table->id();
            $table->integer('mainUserId')->unsigned();
            $table->string('gSheetId');
            $table->json('gSheetData');
            $table->json('result');
            $table->string('initiatedBy')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('g_sheet_crawl_results');
    }
}
