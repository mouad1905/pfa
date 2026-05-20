<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            $table->string('titre', 255)->nullable()->after('id_createur');
            $table->string('type_chambre', 50)->nullable()->after('type');
            $table->string('genre_colocataires', 30)->nullable()->after('nb_locataires');
            $table->text('reglement')->nullable()->after('description');
            $table->string('formule', 20)->default('standard')->after('statut');
            $table->boolean('actif')->default(true)->after('formule');
        });
    }

    public function down(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            $table->dropColumn(['titre', 'type_chambre', 'genre_colocataires', 'reglement', 'formule', 'actif']);
        });
    }
};
