<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddContactIdDeals extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->unsignedInteger('contactId');
        });

        
        Schema::table('deals', function (Blueprint $table) {
            // Replace 'column_name_to_drop' with the name of the column you want to drop.
            $table->dropColumn('contact');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->string('contact');
        });
        
        Schema::table('deals', function (Blueprint $table) {
            $table->dropColumn('contactId');
        });
    }
}
