<?php

namespace App\Http\Requests\Hebergement;

use Illuminate\Foundation\Http\FormRequest;

class StoreHebergementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre'                 => 'nullable|string|max:255',
            'type'                  => 'required|string',
            'type_chambre'          => 'nullable|string|max:50',
            'nbr_chambres'          => 'nullable|integer',
            'meuble'                => 'nullable|boolean',
            'superficie'            => 'nullable|numeric',
            'nb_locataires'         => 'nullable|integer',
            'genre_colocataires'    => 'nullable|string|max:30',
            'localisation'          => 'required|string',
            'description'           => 'nullable|string',
            'reglement'             => 'nullable|string',
            'prix'                  => 'required|numeric',
            'image_principale'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:30720',
            'images_galerie'        => 'nullable|array|max:5',
            'images_galerie.*'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:30720',
            'image_principale_url'  => 'nullable|url',
            'images_galerie_urls'   => 'nullable|array|max:10',
            'images_galerie_urls.*' => 'nullable|url',
        ];
    }
}
