<?php

namespace App\Http\Requests\Cours;

use Illuminate\Foundation\Http\FormRequest;

class StoreCoursRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // L'autorisation se fera via le middleware role:professeur
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'matiere' => 'required|string|max:100|exists:matiere,nom',
            'prix' => 'required|numeric|min:0',
            'type_prix' => 'required|in:heure,semaine,mois',
            'niveau_etude' => 'required|string|max:100',
            'description' => 'nullable|string',
            'mode_enseignement' => 'required|in:en_ligne,presentiel',
        ];
    }
}
