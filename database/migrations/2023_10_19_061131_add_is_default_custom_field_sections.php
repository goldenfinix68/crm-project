<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsDefaultCustomFieldSections extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('custom_field_sections', function (Blueprint $table) {
            $table->boolean('isDefault')->default(false);
        });

        Schema::table('custom_fields', function (Blueprint $table) {
            $table->boolean('isDefault')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('custom_field_sections', function (Blueprint $table) {
            $table->dropColumn('isDefault');
        });
        Schema::table('custom_fields', function (Blueprint $table) {
            $table->dropColumn('isDefault');
        });
    }
}
