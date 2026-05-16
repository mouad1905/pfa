<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatiereResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_matiere' => $this->id_matiere,
            'nom' => $this->nom,
        ];
    }
}
