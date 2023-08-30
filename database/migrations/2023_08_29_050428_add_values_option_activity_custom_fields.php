<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddValuesOptionActivityCustomFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('activity_custom_fields', function (Blueprint $table) {
            $table->longText('values_option')->nullable()->after('values');
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
            $table->dropColumn('values_option');
        });
    }
}
