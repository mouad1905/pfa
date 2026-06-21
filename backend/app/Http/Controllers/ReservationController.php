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

        $oldStatut = $reservation->statut;
        $newStatut = $request->statut;
        $hebergement = $reservation->hebergement;

        if ($newStatut === 'confirmee' && $oldStatut !== 'confirmee') {
            $current = $hebergement->nb_locataires ?? 0;
            $max = $hebergement->max_capacity ?? 0;
            if ($max > 0 && $current >= $max) {
                return response()->json(['message' => 'Capacité maximale atteinte.'], 422);
            }
            $hebergement->nb_locataires = $current + 1;
            $hebergement->save();
        }

        if ($newStatut === 'annulee' && $oldStatut === 'confirmee') {
            $current = $hebergement->nb_locataires ?? 0;
            $hebergement->nb_locataires = max(0, $current - 1);
            $hebergement->save();
        }

        $reservation->statut = $newStatut;
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
                'date_debut'     => $validated['date_debut'] ?? null,
                'date_fin'       => $validated['date_fin'] ?? null,
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