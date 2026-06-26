<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('signalement', function (Blueprint $table) {
            $table->foreignId('id_hebergement')
                  ->nullable()
                  ->constrained('hebergement', 'id_hebergement')
                  ->onDelete('set null')
                  ->after('id_cible');
        });
    }

    public function down(): void
    {
        Schema::table('signalement', function (Blueprint $table) {
            $table->dropForeign(['id_hebergement']);
            $table->dropColumn('id_hebergement');
        });
    }
};
