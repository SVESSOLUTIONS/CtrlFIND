<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTaxesFieldsToOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->double('sub_total', 8, 2)->default(0);
            $table->double('discount', 8, 2)->default(0);
            $table->double('gst', 8, 2)->default(0);
            $table->double('pst', 8, 2)->default(0);
            $table->enum('payment_status', ['pending' , 'confirmed' , 'paid'])->default('pending');
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
            $table->dropColumn('sub_total');
            $table->dropColumn('discount');
            $table->dropColumn('gst');
            $table->dropColumn('pst');
            $table->dropColumn('payment_status');
        });
    }
}
