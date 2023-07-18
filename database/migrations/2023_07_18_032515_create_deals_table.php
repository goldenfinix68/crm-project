<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDealsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('contact')->nullable();
            $table->string('win_probabilty')->nullable();
            $table->string('owner')->nullable();
            $table->string('estimated_close_date')->nullable();
            $table->string('value')->nullable();
            $table->string('currency')->nullable();
            $table->string('pipeline')->nullable();
            $table->string('source')->nullable();
            $table->string('stage')->nullable();
            $table->string('priority')->nullable();
            $table->string('status')->nullable();
            $table->string('details')->nullable();
            $table->string('tags')->nullable();
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
        Schema::dropIfExists('deals');
    }
}
