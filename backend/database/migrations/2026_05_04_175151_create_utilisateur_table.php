<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Création de la table Utilisateur
        Schema::create('utilisateur', function (Blueprint $table) {
            $table->id('id_user');
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->date('date_naissance')->nullable();
            $table->string('cin', 20)->unique();
            $table->string('email', 100)->unique();
            $table->string('telephone', 20)->nullable();
            $table->text('mot_de_passe');
            $table->string('role', 20); // etudiant, professeur, proprietaire, locateur, admin
            $table->enum('statut', ['actif', 'suspendu', 'en_attente'])->default('en_attente');
            $table->string('niveau_etude', 100)->nullable();
            $table->string('photo_profil', 255)->nullable();
            $table->string('document_identite', 255)->nullable();
            $table->string('certificat', 255)->nullable();
            $table->string('carte_etudiant', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Création de la table pour les Tokens (Sanctum)
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable'); 
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('utilisateur');
    }
};