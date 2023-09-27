<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsCustomFieldsValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contacts_custom_fields_values', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('contacts_id')->nullable();
            $table->integer('contacts_custom_fields_id')->nullable();
            $table->string('values')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contacts_custom_fields_values');
    }
}
