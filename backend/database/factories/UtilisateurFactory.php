<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UtilisateurFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'date_naissance' => fake()->date('Y-m-d', '-18 years'),
            'cin' => strtoupper(fake()->bothify('??######')),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => fake()->phoneNumber(),
            'mot_de_passe' => Hash::make('password'),
            'role' => fake()->randomElement(['etudiant', 'professeur', 'proprietaire']),
            'niveau_etude' => fake()->randomElement(['Bac+1', 'Bac+2', 'Bac+3', 'Master 1', 'Master 2']),
        ];
    }
}
