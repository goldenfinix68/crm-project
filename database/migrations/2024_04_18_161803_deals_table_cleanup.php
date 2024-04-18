<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DealsTableCleanup extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->dropColumn('title');
            $table->dropColumn('win_probabilty');
            $table->dropColumn('owner');
            $table->dropColumn('estimated_close_date');
            $table->dropColumn('value');
            $table->dropColumn('currency');
            $table->dropColumn('pipeline');
            $table->dropColumn('source');
            $table->dropColumn('stage');
            $table->dropColumn('status');
            $table->dropColumn('details');
            $table->dropColumn('tags');
            $table->dropColumn('notes');
            $table->dropColumn('is_won');
            $table->dropColumn('is_lost');
            $table->dropColumn('lost_reason');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
