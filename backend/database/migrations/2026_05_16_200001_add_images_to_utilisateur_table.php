<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('utilisateur', function (Blueprint $table) {
            // Photo de profil (URL Cloudinary)
            $table->string('photo_profil')->nullable()->after('role');
            // Scan CIN / Passeport (URL Cloudinary)
            $table->string('document_identite')->nullable()->after('photo_profil');
            // Diplôme ou certificat — pour les professeurs (URL Cloudinary)
            $table->string('certificat')->nullable()->after('document_identite');
            // Carte étudiante — pour les étudiants (URL Cloudinary)
            $table->string('carte_etudiant')->nullable()->after('certificat');
        });
    }

    public function down(): void
    {
        Schema::table('utilisateur', function (Blueprint $table) {
            $table->dropColumn(['photo_profil', 'document_identite', 'certificat', 'carte_etudiant']);
        });
    }
};
