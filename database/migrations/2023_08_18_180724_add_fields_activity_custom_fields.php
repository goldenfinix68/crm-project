<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsActivityCustomFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('activity_custom_fields', function (Blueprint $table) {
            $table->string("name")->nullable();
            $table->longText("values")->nullable();
            $table->string("association_type")->nullable();
            $table->string("related_record_label")->nullable();
            $table->string("required")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('activity_custom_fields', function (Blueprint $table) {
            $table->dropColumn("name");
            $table->dropColumn("values");
            $table->dropColumn("association_type");
            $table->dropColumn("related_record_label");
            $table->dropColumn("required");
        });
    }
}
