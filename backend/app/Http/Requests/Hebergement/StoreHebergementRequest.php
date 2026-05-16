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
            'type'          => 'required|string',
            'nbr_chambres'  => 'nullable|integer',
            'meuble'        => 'boolean',
            'superficie'    => 'nullable|numeric',
            'nb_locataires' => 'nullable|integer',
            'localisation'  => 'required|string',
            'description'   => 'nullable|string',
            'prix'          => 'required|numeric',
        ];
    }
}
