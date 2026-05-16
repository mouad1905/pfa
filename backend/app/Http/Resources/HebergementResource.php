<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HebergementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_hebergement' => $this->id_hebergement,
            'type' => $this->type,
            'nbr_chambres' => $this->nbr_chambres,
            'meuble' => (bool)$this->meuble,
            'superficie' => $this->superficie,
            'nb_locataires' => $this->nb_locataires,
            'localisation' => $this->localisation,
            'description' => $this->description,
            'prix' => $this->prix,
            'proprietaire' => new UtilisateurResource($this->whenLoaded('proprietaire')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
