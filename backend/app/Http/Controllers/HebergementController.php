<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Hebergement\StoreHebergementRequest;
use App\Http\Resources\HebergementResource;

class HebergementController extends Controller
{
    /**
     * Afficher tous les hébergements disponibles (Public)
     */
    public function index()
    {
        $hebergements = Hebergement::with('proprietaire')
            ->where('statut', 'valide')
            ->get();
        return HebergementResource::collection($hebergements);
    }

    /**
     * Créer un nouvel hébergement (Propriétaire uniquement)
     */
    public function store(StoreHebergementRequest $request)
{
    try {
        $validated = $request->validated();

        $hebergement = Hebergement::create(array_merge($validated, [
            'id_createur' => Auth::id(), // Utilise id_createur comme dans ta migration
        ]));

        return response()->json([
            'message' => 'Hébergement créé avec succès',
            'data' => new HebergementResource($hebergement)
        ], 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    /**
     * Voir les détails d'un logement spécifique
     */
    public function show(int $id)
    {
        $hebergement = Hebergement::with('proprietaire')->find($id);

        if (!$hebergement) {
            return response()->json(['message' => 'Hébergement non trouvé'], 404);
        }

        return new HebergementResource($hebergement);
    }
}