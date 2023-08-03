<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnOnActivities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->integer('created_by')->nullable()->unsigned();
            $table->integer('updated_by')->nullable()->unsigned();
            $table->timestamp('completed_date')->nullable();
            $table->string('created_longitude')->nullable();
            $table->string('created_latitude')->nullable();
            $table->string('created_address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropColumn('created_by');
            $table->dropColumn('updated_by');
            $table->dropColumn('completed_date');
            $table->dropColumn('created_longitude');
            $table->dropColumn('created_latitude');
            $table->dropColumn('created_address');
        });
    }
}
