<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message', function (Blueprint $table) {
            $table->id('id_message');
            $table->unsignedBigInteger('id_expediteur');
            $table->unsignedBigInteger('id_destinataire');
            $table->unsignedBigInteger('id_hebergement')->nullable();
            $table->string('sujet', 200)->nullable();
            $table->text('contenu');
            $table->enum('statut', ['envoye', 'lu'])->default('envoye');
            $table->timestamps();

            $table->foreign('id_expediteur')->references('id_user')->on('utilisateur')->onDelete('cascade');
            $table->foreign('id_destinataire')->references('id_user')->on('utilisateur')->onDelete('cascade');
            $table->foreign('id_hebergement')->references('id_hebergement')->on('hebergement')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message');
    }
};
