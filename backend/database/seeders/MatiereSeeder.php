<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatiereSeeder extends Seeder
{
    public function run(): void
    {
        $matieres = [
            'Mathématiques',
            'Physique',
            'Chimie',
            'Sciences de la Vie et de la Terre (SVT)',
            'Informatique',
            'Programmation',
            'Algorithmique',
            'Base de données',
            'Réseaux',
            'Intelligence Artificielle',
            'Génie Logiciel',
            'Anglais',
            'Français',
            'Arabe',
            'Philosophie',
            'Histoire',
            'Géographie',
            'Économie',
            'Gestion',
            'Comptabilité',
            'Marketing',
            'Finance',
            'Droit',
            'Statistiques',
            'Probabilités',
            'Algèbre',
            'Analyse',
            'Mécanique',
            'Électromagnétisme',
            'Thermodynamique',
        ];

        foreach ($matieres as $nom) {
            DB::table('matiere')->insert(['nom' => $nom]);
        }
    }
}
