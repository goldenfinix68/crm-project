<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActivitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->longText('title')->nullable();
            $table->string('type')->nullable();
            $table->string('start_date')->nullable();
            $table->string('end_date')->nullable();
            $table->string('start_time')->nullable();
            $table->string('end_time')->nullable();
            $table->longText('location')->nullable();
            $table->longText('video_conferencing')->nullable();
            $table->string('recurrence')->nullable();
            $table->string('availability')->nullable();
            $table->longText('internal_note')->nullable();
            $table->integer('owner_id')->unsigned();
            $table->integer('deal_id')->unsigned();
            $table->integer('contact_id')->unsigned();
            $table->integer('follower_id')->unsigned();
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
        Schema::dropIfExists('activities');
    }
}
