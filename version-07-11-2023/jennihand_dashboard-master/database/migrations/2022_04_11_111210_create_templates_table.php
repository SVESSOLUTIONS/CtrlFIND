<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('user_id');
            $table->foreignId('category_id');
            $table->foreignId('employee_id');
            $table->unsignedInteger('total_slots');
            $table->string('area');
            $table->decimal('area_lat', 10, 7)->nullable();
            $table->decimal('area_lng', 10, 7)->nullable();
            $table->string('closing_time');
            $table->string('opening_time');
            $table->unsignedInteger('radius');
            $table->text('slots_data')->nullable();
            $table->unsignedInteger('timing');
            $table->enum('timing_type',['m' , 'h'])->default('m');
            $table->tinyInteger('is_deleted')->default(0);
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
        Schema::dropIfExists('tempates');
    }
}
