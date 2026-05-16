<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            $table->string('statut', 20)->default('en_attente')->after('prix');
        });
        Schema::table('cours', function (Blueprint $table) {
            $table->string('statut', 20)->default('en_attente')->after('mode_enseignement');
        });
    }

    public function down(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            $table->dropColumn('statut');
        });
        Schema::table('cours', function (Blueprint $table) {
            $table->dropColumn('statut');
        });
    }
};
