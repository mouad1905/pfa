<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UtilisateurResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_user'     => $this->id_user,
            'nom'         => $this->nom,
            'prenom'      => $this->prenom,
            'email'       => $this->email,
            'telephone'   => $this->telephone,
            'role'        => $this->role,
            'statut'      => $this->statut,
            'niveau_etude'=> $this->niveau_etude,
            // Photo de profil hébergée sur Cloudinary
            'photo_profil'=> $this->photo_profil,
            'document_identite' => $this->document_identite,
            'certificat'        => $this->certificat,
            'carte_etudiant'    => $this->carte_etudiant,
            'about'             => $this->about,
            'updated_at'        => $this->updated_at,
            
            // Evaluations relations and aggregates
            'avg_rating'        => isset($this->avg_rating) ? $this->avg_rating : (round($this->evaluationsRecues()->avg('note'), 1) ?: 0.0),
            'evaluations_count' => isset($this->evaluations_count) ? $this->evaluations_count : $this->evaluationsRecues()->count(),
            'evaluations'       => $this->evaluationsRecues,
        ];
    }
}
