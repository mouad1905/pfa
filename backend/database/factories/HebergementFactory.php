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
            'titre' => fake()->sentence(4),
            'type' => fake()->randomElement(['appartement', 'chambre', 'studio']),
            'type_chambre' => fake()->randomElement(['individuelle', 'partagée', null]),
            'nbr_chambres' => fake()->numberBetween(1, 4),
            'meuble' => fake()->boolean(),
            'superficie' => fake()->randomFloat(2, 15, 100),
            'nb_locataires' => fake()->numberBetween(1, 4),
            'genre_colocataires' => fake()->randomElement(['mixte', 'homme', 'femme', null]),
            'localisation' => fake()->city(),
            'description' => fake()->paragraph(),
            'reglement' => fake()->text(200),
            'image_principale' => fake()->imageUrl(),
            'images_galerie' => [fake()->imageUrl(), fake()->imageUrl()],
            'prix' => fake()->randomFloat(2, 1000, 5000),
            'statut' => 'en_attente',
            'formule' => 'standard',
            'actif' => true,
        ];
    }
}
