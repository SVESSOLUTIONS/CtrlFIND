<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeServiceOrdersStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('service_status', ['Recieved', 'Confirmed','InProgress', 'ReadyForPickUp','ReadyForDelivery', 'onTheWay' ,'onTheWayPickUp' ,'onTheWayDelivery', 'Delivered' , 'Failed' , 'Cancelled'])->default('Recieved')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
}
