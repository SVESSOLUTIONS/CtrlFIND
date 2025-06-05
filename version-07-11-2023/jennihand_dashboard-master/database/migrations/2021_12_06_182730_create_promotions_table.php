<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePromotionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->tinyInteger('active')->default(0);
            $table->string('name');
            $table->string('promo_code',50);
            $table->double('discount');
            $table->tinyInteger('discount_type');
            $table->dateTime('actived_at');
            $table->double('min_amount');
            $table->integer('max_nb_of_users');
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
        Schema::dropIfExists('promotions');
    }
}
