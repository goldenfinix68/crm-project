<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contact_updates', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('contactId');
            $table->unsignedInteger('userId');
            $table->string('title')->nullable();
            $table->string('from')->nullable();
            $table->string('to')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contact_updates');
    }
}
