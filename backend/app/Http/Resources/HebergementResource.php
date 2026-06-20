<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HebergementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_hebergement'     => $this->id_hebergement,
            'titre'              => $this->titre,
            'type'               => $this->type,
            'type_chambre'       => $this->type_chambre,
            'nbr_chambres'       => $this->nbr_chambres,
            'max_capacity'       => $this->max_capacity,
            'meuble'             => (bool) $this->meuble,
            'superficie'         => $this->superficie,
            'nb_locataires'      => $this->nb_locataires,
            'genre_colocataires' => $this->genre_colocataires,
            'students_only'      => (bool) ($this->students_only ?? false),
            'localisation'       => $this->localisation,
            'description'        => $this->description,
            'reglement'          => $this->reglement,
            'prix'               => $this->prix,
            'statut'             => $this->statut,
            'formule'            => $this->formule ?? 'standard',
            'actif'              => (bool) ($this->actif ?? true),
            'image'              => $this->image_principale,
            'images'             => $this->images_galerie ?? [],
            'avg_rating_hebergement' => (float) ($this->evaluations_avg_note ?? 0),
            'occupants'          => $this->whenLoaded('occupants', function () {
                return $this->occupants->map(fn ($r) => [
                    'id_user'   => $r->etudiant->id_user,
                    'prenom'    => $r->etudiant->prenom,
                    'nom'       => $r->etudiant->nom,
                    'photo_profil' => $r->etudiant->photo_profil,
                ]);
            }),
            'proprietaire'       => new UtilisateurResource($this->whenLoaded('proprietaire')),
            'id_createur'        => $this->id_createur,
            'created_at'         => $this->created_at,
            'updated_at'         => $this->updated_at,
        ];
    }
}
