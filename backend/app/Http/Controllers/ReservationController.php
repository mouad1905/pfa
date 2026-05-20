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
        $reservations = Reservation::with(['hebergement', 'etudiant'])
            ->where('id_etudiant', Auth::id())
            ->get();

        return ReservationResource::collection($reservations);
    }

    /**
     * Réservations / candidatures pour les biens du propriétaire connecté
     */
    public function mesReservationsProprietaire()
    {
        $reservations = Reservation::with(['etudiant', 'hebergement'])
            ->whereHas('hebergement', fn ($q) => $q->where('id_createur', Auth::id()))
            ->orderByDesc('created_at')
            ->get();

        return ReservationResource::collection($reservations);
    }

    /**
     * Accepter ou refuser une candidature (propriétaire)
     */
    public function updateStatut(Request $request, int $id)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,confirmee,annulee',
        ]);

        $reservation = Reservation::with(['etudiant', 'hebergement'])
            ->whereHas('hebergement', fn ($q) => $q->where('id_createur', Auth::id()))
            ->findOrFail($id);

        $reservation->statut = $request->statut;
        $reservation->save();

        return response()->json([
            'message' => 'Statut de la candidature mis à jour',
            'data'    => new ReservationResource($reservation->load(['etudiant', 'hebergement'])),
        ]);
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