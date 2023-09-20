<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkflowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workflows', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('action');
            $table->string('startOn');
            $table->string('timezone');
            $table->string('batchQuantity');
            $table->string('repeatAfter');
            $table->string('repeatAfterType');
            $table->json('sendOn');
            $table->json('contactIds');
            $table->string('startFrom');
            $table->string('endsAt');
            $table->text('message');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('workflows');
    }
}
