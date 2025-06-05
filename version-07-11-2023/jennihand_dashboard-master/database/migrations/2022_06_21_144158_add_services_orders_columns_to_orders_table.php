<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddServicesOrdersColumnsToOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('service_status', ['Recieved', 'Confirmed','InProgress', 'Ready','onTheWayPickUp' ,'onTheWayDelivey', 'Delivered' , 'Failed' , 'Cancelled'])->default('Recieved');
            $table->boolean('pickup')->default(0);
            $table->boolean('delivery')->default(0);
            $table->dateTime('onPickup_at')->nullable();
            $table->dateTime('inProgress_at')->nullable();
            $table->dateTime('ready_at')->nullable();
            $table->double('extra_service_fee', 8, 2)->default(0);
            $table->enum('extra_service_fee_status' , ['no', 'pending' ,'reject' ,'paid'])->default('no');
            $table->enum('order_type' , ['service' , 'product'])->default('product');
            $table->enum('require_appointment' , ['Y' , 'N'])->default('Y');
            $table->foreignId('schedule_id')->nullable();
            $table->foreignId('service_id')->nullable();
            $table->text('appointment_time')->nullable();
            $table->date('appointment_date')->nullable();
            $table->text('information')->nullable();

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
            $table->dropColumn('service_status');
            $table->dropColumn('pickup');
            $table->dropColumn('delivery');
            $table->dropColumn('onPickup_at');
            $table->dropColumn('inProgress_at');
            $table->dropColumn('ready_at');
            $table->dropColumn('extra_service_fee');
            $table->dropColumn('extra_service_fee_status');
            $table->dropColumn('order_type');
            $table->dropColumn('require_appointment');
            $table->dropColumn('schedule_id');
            $table->dropColumn('appointment_time');
            $table->dropColumn('appointment_date');
            $table->dropColumn('information');
            $table->dropColumn('service_id');
        });
    }
}
