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
    Schema::create('evaluation', function (Blueprint $table) {
        $table->id('id_evaluation');
        $table->foreignId('id_auteur')->constrained('utilisateur', 'id_user')->onDelete('cascade');
        $table->foreignId('id_cible')->constrained('utilisateur', 'id_user')->onDelete('cascade');
        $table->integer('note'); // 1 à 5
        $table->text('commentaire')->nullable();
        $table->timestamp('date_evaluation')->useCurrent();
    });

    Schema::create('paiement', function (Blueprint $table) {
        $table->id('id_paiement');
        $table->foreignId('id_user')->constrained('utilisateur', 'id_user')->onDelete('cascade');
        $table->string('type', 20); // cours, hebergement
        $table->integer('id_reference');
        $table->decimal('montant', 10, 2);
        $table->timestamp('date_paiement')->useCurrent();
        $table->string('statut', 20); // reussi, echoue
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiement');
        Schema::dropIfExists('evaluation');
    }
};
