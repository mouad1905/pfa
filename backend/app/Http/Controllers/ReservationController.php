<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Resources\ReservationResource;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with('hebergement')
            ->where('id_etudiant', Auth::id())
            ->get();

        return ReservationResource::collection($reservations);
    }

    public function store(StoreReservationRequest $request)
    {
        try {
            $validated = $request->validated();

            $reservation = Reservation::create([
                'id_etudiant'    => Auth::id(),
                'id_hebergement' => $validated['id_hebergement'],
                'date_debut'     => $validated['date_debut'],
                'date_fin'       => $validated['date_fin'],
                'statut'         => 'en_attente'
            ]);

            return response()->json([
                'message' => 'Réservation effectuée !',
                'data' => new ReservationResource($reservation)
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}