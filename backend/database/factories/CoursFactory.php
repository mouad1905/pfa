<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Utilisateur;

class CoursFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_professeur' => Utilisateur::factory()->create(['role' => 'professeur'])->id_user,
            'matiere' => fake()->randomElement(['Mathématiques', 'Physique', 'Informatique', 'Anglais']),
            'prix' => fake()->randomFloat(2, 50, 500),
            'type_prix' => 'DH/h',
            'niveau_etude' => fake()->randomElement(['L1', 'L2', 'L3', 'Master']),
            'description' => fake()->paragraph(),
            'mode_enseignement' => fake()->randomElement(['en_ligne', 'presentiel']),
        ];
    }
}
