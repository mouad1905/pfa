<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Utilisateur;

class HebergementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_createur' => Utilisateur::factory()->create(['role' => 'proprietaire'])->id_user,
            'type' => fake()->randomElement(['appartement', 'chambre', 'studio']),
            'nbr_chambres' => fake()->numberBetween(1, 4),
            'meuble' => fake()->boolean(),
            'superficie' => fake()->randomFloat(2, 15, 100),
            'nb_locataires' => fake()->numberBetween(1, 4),
            'localisation' => fake()->city(),
            'description' => fake()->paragraph(),
            'prix' => fake()->randomFloat(2, 1000, 5000),
        ];
    }
}
