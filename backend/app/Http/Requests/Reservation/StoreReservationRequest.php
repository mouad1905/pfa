<?php

namespace App\Http\Requests\Reservation;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_hebergement' => 'required|exists:hebergement,id_hebergement',
            'date_debut'     => 'nullable|date|after_or_equal:today',
            'date_fin'       => 'nullable|date|after:date_debut'
        ];
    }
}
