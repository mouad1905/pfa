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
        ];
    }
}
