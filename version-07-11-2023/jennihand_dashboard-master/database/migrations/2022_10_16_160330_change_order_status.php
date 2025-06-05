<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeOrderStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('service_status', ['Recieved', 'Confirmed','InProgress', 'ReadyForPickUp','ReadyForDelivery', 'onTheWay' ,'onTheWayPickUp' ,'onTheWayDelivery', 'Delivered' , 'Failed' , 'Cancelled' , 'Decline'])->default('Recieved')->change();
            $table->enum('status', ['Pending', 'Confirmed', 'onTheWay' , 'Delivered' , 'Failed' , 'Cancelled' , 'Decline'])->default('Pending')->change();
            $table->text('note')->nullable();
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
