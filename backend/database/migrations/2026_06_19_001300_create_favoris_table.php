<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favoris', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('utilisateur', 'id_user')->onDelete('cascade');
            $table->foreignId('id_hebergement')->constrained('hebergement', 'id_hebergement')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['id_user', 'id_hebergement']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favoris');
    }
};
