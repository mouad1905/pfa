<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hebergement', function (Blueprint $table) {
            $table->id('id_hebergement');
            $table->foreignId('id_createur')->constrained('utilisateur', 'id_user')->onDelete('cascade');
            $table->string('titre', 255)->nullable();
            $table->string('type', 50); // e.g. appartement, chambre, studio
            $table->string('type_chambre', 50)->nullable();
            $table->integer('nbr_chambres')->nullable();
            $table->boolean('meuble')->default(false);
            $table->decimal('superficie', 10, 2)->nullable();
            $table->integer('nb_locataires')->nullable();
            $table->string('genre_colocataires', 30)->nullable(); // e.g. mixte, homme, femme
            $table->string('localisation', 255);
            $table->text('description')->nullable();
            $table->text('reglement')->nullable();
            $table->string('image_principale', 255)->nullable();
            $table->json('images_galerie')->nullable();
            $table->decimal('prix', 10, 2);
            $table->string('statut', 20)->default('en_attente'); // en_attente, valide, rejete
            $table->string('formule', 20)->default('standard'); // standard, premium, gold
            $table->boolean('actif')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hebergement');
    }
};
