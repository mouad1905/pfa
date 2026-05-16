<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_reservation' => $this->id_reservation,
            'date_debut' => $this->date_debut?->format('Y-m-d'),
            'date_fin'   => $this->date_fin?->format('Y-m-d'),
            'statut' => $this->statut,
            'etudiant' => new UtilisateurResource($this->whenLoaded('etudiant')),
            'hebergement' => new HebergementResource($this->whenLoaded('hebergement')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
