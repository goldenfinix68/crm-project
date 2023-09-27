<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsCustomFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contacts_custom_fields', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('type')->nullable();
            $table->string('label')->nullable();
            $table->string('section')->nullable();
            $table->integer('status')->nullable();
            $table->string('index')->nullable();
            $table->string('name')->nullable();
            $table->string('values')->nullable();
            $table->string('values_option')->nullable();
            $table->string('association_type')->nullable();
            $table->string('related_record_label')->nullable();
            $table->integer('required')->nullable();
     
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contacts_custom_fields');
    }
}
