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
            Matiere::firstOrCreate(['nom' => $nom]);
        }

        // Créer un administrateur
        Utilisateur::updateOrCreate(
            ['email' => 'admin@uniconnect.com'],
            [
                'nom'          => 'Admin',
                'prenom'       => 'Super',
                'role'         => 'admin',
                'statut'       => 'actif',
                'date_naissance' => '1990-01-01',
                'cin'          => 'AB123456',
                'telephone'    => '0600000000',
                'mot_de_passe' => \Illuminate\Support\Facades\Hash::make('password'),
                'niveau_etude' => 'Bac+5',
            ]
        );

        // Créer un propriétaire par défaut
        $proprietaireDefaut = Utilisateur::updateOrCreate(
            ['email' => 'proprietaire@uniconnect.com'],
            [
                'nom'          => 'Proprio',
                'prenom'       => 'Test',
                'role'         => 'proprietaire',
                'statut'       => 'actif',
                'date_naissance' => '1985-01-01',
                'cin'          => 'CD789012',
                'telephone'    => '0611111111',
                'mot_de_passe' => \Illuminate\Support\Facades\Hash::make('password'),
                'niveau_etude' => 'Bac+3',
            ]
        );

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
