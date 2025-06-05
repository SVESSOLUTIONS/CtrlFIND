<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_nr');
            $table->string('invoice_nr')->nullable();
            $table->foreignId('user_id');
            $table->foreignId('provider_id');
            $table->string('provider_name');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('delivery_type');
            $table->string('delivery_address_label')->nullable();
            $table->string('delivery_address');
            $table->string('tracking_url')->nullable();
            $table->double('amount', 8, 2);
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->enum('status', ['Pending', 'Confirmed', 'onTheWay' , 'Delivered' , 'Failed' , 'Cancelled'])->default('Pending');
            $table->dateTime('confirmed_at')->nullable();
            $table->dateTime('onDelivery_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
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
        Schema::dropIfExists('orders');
    }
}
