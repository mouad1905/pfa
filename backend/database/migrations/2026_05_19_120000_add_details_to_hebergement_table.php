<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            if (!Schema::hasColumn('hebergement', 'titre')) {
                $table->string('titre', 255)->nullable()->after('id_createur');
            }
            if (!Schema::hasColumn('hebergement', 'type_chambre')) {
                $table->string('type_chambre', 50)->nullable()->after('type');
            }
            if (!Schema::hasColumn('hebergement', 'genre_colocataires')) {
                $table->string('genre_colocataires', 30)->nullable()->after('nb_locataires');
            }
            if (!Schema::hasColumn('hebergement', 'reglement')) {
                $table->text('reglement')->nullable()->after('description');
            }
            if (!Schema::hasColumn('hebergement', 'formule')) {
                $table->string('formule', 20)->default('standard')->after('statut');
            }
            if (!Schema::hasColumn('hebergement', 'actif')) {
                $table->boolean('actif')->default(true)->after('formule');
            }
        });
    }

    public function down(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            $table->dropColumn(['titre', 'type_chambre', 'genre_colocataires', 'reglement', 'formule', 'actif']);
        });
    }
};
