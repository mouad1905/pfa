<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('signalement', function (Blueprint $table) {
            $table->id('id_signalement');

            // L'utilisateur qui envoie le signalement
            $table->foreignId('id_auteur')
                  ->constrained('utilisateur', 'id_user')
                  ->onDelete('cascade');

            // L'utilisateur qui est signalé (ex: Alexandre Dubois)
            $table->foreignId('id_cible')
                  ->constrained('utilisateur', 'id_user')
                  ->onDelete('cascade');

            // La raison (Fake profile, Spam, Harassment, etc.)
            $table->string('raison', 50); 

            // Le texte libre (le champ "others" dans ton screen)
            $table->text('details')->nullable();

            // Statut pour l'administration
            $table->string('statut', 20)->default('en_attente'); // en_attente, traite, rejete

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('signalement');
    }
};