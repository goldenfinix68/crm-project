<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('custom_fields', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('fieldName')->nullable();
            $table->string('label');
            $table->string('options')->nullable();
            $table->integer('userId')->unsigned();
            $table->integer('customFieldSectionId')->unsigned();
            $table->boolean('isActive')->default(1);
            $table->boolean('isRequired')->default(1);
            $table->string('sort')->nullable();
            $table->string("associationType")->nullable();
            $table->string("relatedRecordLabel")->nullable();
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
        Schema::dropIfExists('custom_fields');
    }
}
