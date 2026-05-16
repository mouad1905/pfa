<?php

namespace App\Http\Controllers;

use App\Models\Signalement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SignalementController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_cible' => 'required|exists:utilisateur,id_user',
            'raison'   => 'required|string|max:50',
            'details'  => 'nullable|string',
        ]);

        $signalement = Signalement::create([
            'id_auteur' => Auth::id(), // Récupéré via le Token
            'id_cible'  => $validated['id_cible'],
            'raison'    => $validated['raison'],
            'details'   => $validated['details'],
            'statut'    => 'en_attente'
        ]);

        return response()->json([
            'message' => 'Signalement envoyé avec succès',
            'data' => $signalement
        ], 201);
    }
    public function mesSignalements()
    {
        try {
            // On récupère les signalements où l'id_auteur est l'utilisateur actuel
            $signalements = Signalement::where('id_auteur', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $signalements
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des signalements.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // Lister tous les signalements
    public function index()
    {
        // On peut charger les relations pour voir qui a signalé qui
        $signalements = Signalement::with(['auteur', 'cible'])->get();
        return response()->json($signalements);
    }

    // Mettre à jour le statut (ex: de 'en_attente' à 'traite')
    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,traite,rejete'
        ]);

        $signalement = Signalement::findOrFail($id);
        $signalement->update(['statut' => $request->statut]);

        return response()->json([
            'message' => 'Statut du signalement mis à jour',
            'data' => $signalement
        ]);
    }
}
