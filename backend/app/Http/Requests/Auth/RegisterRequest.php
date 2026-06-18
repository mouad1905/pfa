<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'cin' => 'required|string|unique:utilisateur,cin',
            'email' => 'required|email|unique:utilisateur,email',
            'password' => 'required|min:6',
            'role' => 'required|in:etudiant,professeur,proprietaire,locateur',
            'niveau_etude' => 'nullable|string|max:100',
            'telephone' => 'nullable|string|max:20',
        ];
    }
}
