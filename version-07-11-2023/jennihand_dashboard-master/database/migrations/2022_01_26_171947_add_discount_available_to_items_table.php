<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDiscountAvailableToItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('items', function (Blueprint $table) {
            $table->enum('discount_available',['Y', 'N'])->default('N');
            $table->enum('require_appointment',['Y', 'N'])->default('N');
            $table->enum('item_type',['product','service'])->default('product');
            $table->enum('location',['onsite','home'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn('discount_available');
            $table->dropColumn('require_appointment');
            $table->dropColumn('item_type');
            $table->dropColumn('location');
        });
    }
}
