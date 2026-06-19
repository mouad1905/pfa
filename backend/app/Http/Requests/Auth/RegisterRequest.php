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
            'telephone' => 'nullable|string|max:20',
            'date_naissance' => 'nullable|date',
            'role' => 'required|in:etudiant,professeur,proprietaire,locateur',
            'niveau_etude' => 'nullable|string|max:100',
            'photo_profil' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:3072',
            'document_identite' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'certificat' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'carte_etudiant' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ];
    }
}
