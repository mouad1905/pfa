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
            'date_debut'     => 'required|date|after_or_equal:today',
            'date_fin'       => 'required|date|after:date_debut'
        ];
    }
}
