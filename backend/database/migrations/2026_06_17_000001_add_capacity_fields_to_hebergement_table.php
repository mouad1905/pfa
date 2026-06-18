<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            $table->integer('max_capacity')->nullable()->after('nbr_chambres');
            $table->boolean('students_only')->default(false)->after('genre_colocataires');
        });
    }

    public function down(): void
    {
        Schema::table('hebergement', function (Blueprint $table) {
            $table->dropColumn(['max_capacity', 'students_only']);
        });
    }
};
