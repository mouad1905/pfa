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
        $table->string('type', 50); // appartement / chambre / studio
        $table->integer('nbr_chambres')->nullable();
        $table->boolean('meuble')->default(false);
        $table->decimal('superficie', 10, 2)->nullable();
        $table->integer('nb_locataires')->nullable();
        $table->string('localisation', 255);
        $table->text('description')->nullable();
        $table->decimal('prix', 10, 2);
        $table->timestamps();
    });

    Schema::create('reservation', function (Blueprint $table) {
        $table->id('id_reservation');
        $table->foreignId('id_etudiant')->constrained('utilisateur', 'id_user')->onDelete('cascade');
        $table->foreignId('id_hebergement')->constrained('hebergement', 'id_hebergement')->onDelete('cascade');
        $table->date('date_debut')->nullable();
        $table->date('date_fin')->nullable();
        $table->string('statut', 20)->default('en_attente'); // en_attente, confirmee, annulee
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('reservation');
        Schema::dropIfExists('hebergement');
    }
};
