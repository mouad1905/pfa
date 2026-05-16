<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reclamation;
use Illuminate\Support\Facades\Auth;

class ReclamationController extends Controller
{
    /**
     * Créer une réclamation.
     * Route publique : id_auteur fourni dans le body (avec validation d'existence).
     * Si l'utilisateur est connecté, on utilise son ID automatiquement.
     */
    public function store(Request $request)
    {
        // Si l'utilisateur est connecté, son ID est prioritaire (empêche l'usurpation)
        $idAuteur = Auth::id();

        $rules = [
            'type_cible'  => 'required|in:cours,hebergement,utilisateur',
            'description' => 'required|string',
            'sujet'       => 'nullable|string|max:100',
            'statut'      => 'in:en_attente,traitee,rejetee',
        ];

        // Si non connecté, on exige id_auteur dans le body
        if (!$idAuteur) {
            $rules['id_auteur'] = 'required|integer|exists:utilisateur,id_user';
        }

        $request->validate($rules);

        try {
            $reclamation = Reclamation::create([
                'id_auteur'        => $idAuteur ?? $request->id_auteur,
                'type_cible'       => $request->type_cible,
                'id_cible'         => $request->id_cible,
                'sujet'            => $request->sujet,
                'description'      => $request->description,
                'statut'           => $request->statut ?? 'en_attente',
                'date_reclamation' => now(),
            ]);

            return response()->json(['message' => 'Réclamation envoyée avec succès !', 'data' => $reclamation], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Lister toutes les réclamations (admin)
     */
    public function index()
    {
        return response()->json(Reclamation::with('auteur')->orderBy('date_reclamation', 'desc')->get());
    }
}
