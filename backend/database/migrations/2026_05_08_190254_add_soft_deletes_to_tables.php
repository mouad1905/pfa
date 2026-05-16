<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('utilisateur', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('hebergement', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('cours', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('reservation', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('utilisateur', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('hebergement', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('cours', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('reservation', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
