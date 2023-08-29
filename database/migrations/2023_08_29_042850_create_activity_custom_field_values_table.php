<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActivityCustomFieldValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activity_custom_field_values', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('activity_id')->unsigned();
            $table->integer('activity_custom_fields_id')->unsigned();
            $table->longText('values')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('activity_custom_field_values');
    }
}
