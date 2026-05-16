<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Utilisateur;
use App\Models\Hebergement;

class ReservationFactory extends Factory
{
    public function definition(): array
    {
        $debut = fake()->dateTimeBetween('+1 week', '+1 month');
        $fin = (clone $debut)->modify('+' . fake()->numberBetween(1, 12) . ' months');

        return [
            'id_etudiant' => Utilisateur::factory()->create(['role' => 'etudiant'])->id_user,
            'id_hebergement' => Hebergement::factory(),
            'date_debut' => $debut,
            'date_fin' => $fin,
            'statut' => fake()->randomElement(['en_attente', 'confirmee', 'annulee']),
        ];
    }
}
