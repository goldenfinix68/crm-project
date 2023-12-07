<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGSheetCrawlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('g_sheet_crawls', function (Blueprint $table) {
            $table->id();
            $table->integer('mainUserId')->unsigned();
            $table->string('gSheetId');
            $table->string('interval');
            $table->timestamp('last_trigger')->nullable();
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
        Schema::dropIfExists('g_sheet_crawls');
    }
}
