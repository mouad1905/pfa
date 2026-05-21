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
        Schema::create('cours', function (Blueprint $table) {
            $table->id('id_cours');
            $table->foreignId('id_professeur')->constrained('utilisateur', 'id_user')->onDelete('cascade');
            $table->string('matiere', 100);
            $table->decimal('prix', 10, 2);
            $table->enum('type_prix', ['DH/h'])->default('DH/h');
            $table->string('niveau_etude', 100);
            $table->text('description')->nullable();
            $table->string('image_cours', 255)->nullable();
            $table->enum('mode_enseignement', ['en_ligne', 'presentiel']);
            $table->string('statut', 20)->default('en_attente'); // en_attente, valide, rejete
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
