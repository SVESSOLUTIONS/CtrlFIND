<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->integer('provider_id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->tinyText('notes')->nullable();
            $table->double('amount');
            $table->double('shipping');
            $table->double('discount');
            $table->string('currency');
            $table->tinyInteger('payment_type');
            $table->tinyInteger('status');
            $table->tinyText('txn_message');
            $table->tinyText('txn_data');
            $table->string('user_ip');
            $table->string('tracking_code');
            $table->integer('promotion_id')->default(0);
            $table->dateTime('delivery_date')->nullable();
            $table->tinyInteger('delivery_type')->default(0);
            $table->dateTime('pickup_date')->nullable();
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
        Schema::dropIfExists('sales_orders');
    }
}
