<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Reclamation;
use App\Services\CloudinaryService;
use Illuminate\Http\UploadedFile;
use Mockery\MockInterface;

class ReclamationTest extends TestCase
{
    use RefreshDatabase;

    public function test_peut_creer_une_reclamation_sans_piece_jointe(): void
    {
        $user = Utilisateur::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/reclamations', [
            'type_cible' => 'cours',
            'id_cible' => 1,
            'sujet' => 'Sujet test',
            'description' => 'Description de la réclamation'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reclamation', [
            'id_auteur' => $user->id_user,
            'sujet' => 'Sujet test',
            'piece_jointe' => null
        ]);
    }

    public function test_peut_creer_une_reclamation_avec_piece_jointe(): void
    {
        $user = Utilisateur::factory()->create();

        $mockUrl = 'https://res.cloudinary.com/demo/image/upload/uniconnect/reclamations/test_file.pdf';
        
        $this->mock(CloudinaryService::class, function (MockInterface $mock) use ($mockUrl) {
            $mock->shouldReceive('upload')
                 ->once()
                 ->andReturn($mockUrl);
        });

        $file = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

        $response = $this->actingAs($user)->postJson('/api/reclamations', [
            'type_cible' => 'cours',
            'id_cible' => 1,
            'sujet' => 'Sujet test avec fichier',
            'description' => 'Description de la réclamation avec pièce jointe',
            'piece_jointe' => $file
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reclamation', [
            'id_auteur' => $user->id_user,
            'sujet' => 'Sujet test avec fichier',
            'piece_jointe' => $mockUrl
        ]);
    }
}
