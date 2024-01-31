<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPhoneTypeCustomFieldIdWorkflows extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('workflows', function (Blueprint $table) {
            $table->string('phoneTypeCustomFieldId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('workflows', function (Blueprint $table) {
            $table->dropColumn('phoneTypeCustomFieldId');
        });
    }
}
