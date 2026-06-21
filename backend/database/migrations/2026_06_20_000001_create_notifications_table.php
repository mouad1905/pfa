<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification', function (Blueprint $table) {
            $table->id('id_notification');
            $table->unsignedBigInteger('id_user');
            $table->string('type', 50);
            $table->text('message');
            $table->unsignedBigInteger('id_conversation')->nullable();
            $table->unsignedBigInteger('id_reservation')->nullable();
            $table->boolean('lu')->default(false);
            $table->timestamps();

            $table->foreign('id_user')->references('id_user')->on('utilisateur')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification');
    }
};
