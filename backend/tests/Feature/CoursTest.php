<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Matiere;

class CoursTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_professeur_peut_creer_un_cours(): void
    {
        $professeur = Utilisateur::factory()->create([
            'role' => 'professeur'
        ]);

        Matiere::create([
            'nom' => 'Mathématiques'
        ]);

        $response = $this->actingAs($professeur)->postJson('/api/cours', [
            'matiere' => 'Mathématiques',
            'prix' => 150,
            'type_prix' => 'DH/h',
            'niveau_etude' => 'L1',
            'description' => 'Cours complet de maths',
            'mode_enseignement' => 'en_ligne'
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.matiere', 'Mathématiques');
                 
        $this->assertDatabaseHas('cours', [
            'matiere' => 'Mathématiques',
            'id_professeur' => $professeur->id_user
        ]);
    }
    
    public function test_un_etudiant_ne_peut_pas_creer_un_cours(): void
    {
        $etudiant = Utilisateur::factory()->create([
            'role' => 'etudiant'
        ]);

        $response = $this->actingAs($etudiant)->postJson('/api/cours', [
            'matiere' => 'Physique',
            'prix' => 100,
            'type_prix' => 'heure',
            'niveau_etude' => 'L1',
            'description' => 'Cours',
            'mode_enseignement' => 'en_ligne'
        ]);

        $response->assertStatus(403);
    }
}
