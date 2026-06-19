<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Table des conversations
        Schema::create('conversation', function (Blueprint $table) {
            $table->id('id_conversation');
            $table->timestamps();
        });

        // 2. Table des participants
        Schema::create('conversation_participant', function (Blueprint $table) {
            $table->id('id_participant');
            $table->unsignedBigInteger('id_conversation');
            $table->unsignedBigInteger('id_user');
            $table->timestamps();

            $table->foreign('id_conversation')->references('id_conversation')->on('conversation')->onDelete('cascade');
            $table->foreign('id_user')->references('id_user')->on('utilisateur')->onDelete('cascade');
            $table->unique(['id_conversation', 'id_user']);
        });

        // 3. Modifier la table message pour lier aux conversations
        Schema::table('message', function (Blueprint $table) {
            $table->unsignedBigInteger('id_conversation')->nullable()->after('id_message');
            $table->foreign('id_conversation')->references('id_conversation')->on('conversation')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('message', function (Blueprint $table) {
            $table->dropForeign(['id_conversation']);
            $table->dropColumn('id_conversation');
        });

        Schema::dropIfExists('conversation_participant');
        Schema::dropIfExists('conversation');
    }
};
