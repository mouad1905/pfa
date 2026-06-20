<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hebergement_evaluation', function (Blueprint $table) {
            $table->id('id_evaluation');
            $table->foreignId('id_hebergement')->constrained('hebergement', 'id_hebergement')->onDelete('cascade');
            $table->foreignId('id_auteur')->constrained('utilisateur', 'id_user')->onDelete('cascade');
            $table->integer('note');
            $table->text('commentaire')->nullable();
            $table->timestamp('date_evaluation')->useCurrent();

            $table->unique(['id_hebergement', 'id_auteur']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hebergement_evaluation');
    }
};
