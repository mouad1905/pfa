<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            // Image principale de l'annonce (URL Cloudinary)
            $table->string('image_principale')->nullable()->after('description');
            // Galerie de photos (JSON avec un tableau d'URLs Cloudinary)
            $table->json('images_galerie')->nullable()->after('image_principale');
        });
    }

    public function down(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            $table->dropColumn(['image_principale', 'images_galerie']);
        });
    }
};
