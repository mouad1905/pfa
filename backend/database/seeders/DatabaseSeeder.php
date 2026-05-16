<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Hebergement;
use App\Models\Cours;
use App\Models\Reservation;
use App\Models\Matiere;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer les matières par défaut
        $matieres = ['Mathématiques', 'Physique', 'Informatique', 'Anglais', 'Français', 'Philosophie'];
        foreach ($matieres as $nom) {
            Matiere::create(['nom' => $nom]);
        }

        // Créer un administrateur
        Utilisateur::factory()->create([
            'nom' => 'Admin',
            'prenom' => 'Super',
            'email' => 'admin@uniconnect.com',
            'role' => 'admin',
        ]);

        // Créer un propriétaire par défaut
        $proprietaireDefaut = Utilisateur::factory()->create([
            'nom' => 'Proprio',
            'prenom' => 'Test',
            'email' => 'proprietaire@uniconnect.com',
            'role' => 'proprietaire',
        ]);
        Hebergement::factory(2)->create(['id_createur' => $proprietaireDefaut->id_user]);

        // Créer d'autres propriétaires avec des hébergements
        Utilisateur::factory(2)->create(['role' => 'proprietaire'])->each(function ($proprietaire) {
            Hebergement::factory(2)->create(['id_createur' => $proprietaire->id_user]);
        });

        // Créer des professeurs avec des cours
        Utilisateur::factory(3)->create(['role' => 'professeur'])->each(function ($professeur) {
            Cours::factory(2)->create(['id_professeur' => $professeur->id_user]);
        });

        // Créer des étudiants et quelques réservations
        $etudiants = Utilisateur::factory(10)->create(['role' => 'etudiant']);
        
        $hebergements = Hebergement::all();

        foreach ($etudiants->random(5) as $etudiant) {
            Reservation::factory()->create([
                'id_etudiant' => $etudiant->id_user,
                'id_hebergement' => $hebergements->random()->id_hebergement,
            ]);
        }
    }
}
