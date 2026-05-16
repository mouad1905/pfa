<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CoursResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_cours' => $this->id_cours,
            'matiere' => $this->matiere,
            'prix' => $this->prix,
            'type_prix' => $this->type_prix,
            'niveau_etude' => $this->niveau_etude,
            'description' => $this->description,
            'mode_enseignement' => $this->mode_enseignement,
            'professeur' => new UtilisateurResource($this->whenLoaded('professeur')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
