<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reclamation', function (Blueprint $table) {
            $table->id('id_reclamation'); // SERIAL PRIMARY KEY
            
            // Clé étrangère vers utilisateur
            $table->foreignId('id_auteur')
                  ->constrained('utilisateur', 'id_user')
                  ->onDelete('cascade');
            
            $table->string('type_cible', 20); // cours, hebergement, utilisateur
            $table->integer('id_cible')->nullable();
            $table->string('sujet', 100)->nullable();
            $table->text('description');
            
            $table->timestamp('date_reclamation')->useCurrent();
            $table->string('statut', 20)->default('en_attente');
            $table->text('piece_jointe')->nullable();
            
            $table->timestamps(); // created_at et updated_at
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE reclamation ADD CONSTRAINT check_type_cible CHECK (type_cible IN ('cours', 'hebergement', 'utilisateur'))");
            DB::statement("ALTER TABLE reclamation ADD CONSTRAINT check_statut_reclamation CHECK (statut IN ('en_attente', 'traitee', 'rejetee'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reclamation');
    }
};