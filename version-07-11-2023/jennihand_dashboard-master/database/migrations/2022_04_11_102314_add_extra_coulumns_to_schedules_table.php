<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExtraCoulumnsToSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->foreignId('employee_id');
            $table->string('area');
            $table->decimal('area_lat', 10, 7)->nullable();
            $table->decimal('area_lng', 10, 7)->nullable();
            $table->string('closing_time');
            $table->string('opening_time');
            $table->unsignedInteger('radius');
            $table->text('slots_data')->nullable();
            $table->unsignedInteger('timing');
            $table->enum('timing_type',['m' , 'h'])->default('m');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn('employee_id');
            $table->dropColumn('area');
            $table->dropColumn('area_lat');
            $table->dropColumn('area_lng');
            $table->dropColumn('closing_time');
            $table->dropColumn('opening_time');
            $table->dropColumn('radius');
            $table->dropColumn('slots_data');
            $table->dropColumn('timing');
            $table->dropColumn('timing_type');
        });
    }
}
