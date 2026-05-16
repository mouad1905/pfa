<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reclamation;
use Illuminate\Support\Facades\DB;

class ReclamationController extends Controller
{
    public function store(Request $request)
    {
        // 1. LA VALIDATION (C'est ici qu'on met le code)
        $request->validate([
            'id_auteur'   => 'required|exists:utilisateur,id_user',
            'type_cible'  => 'required|in:cours,hebergement,utilisateur',
            'description' => 'required|string',
            'sujet'       => 'nullable|string|max:100',
            'statut'      => 'in:en_attente,traitee,rejetee',
        ]);

        // 2. L'INSERTION (Si la validation passe, on arrive ici)
        try {
            $reclamation = DB::table('reclamation')->insert([
                'id_auteur'   => $request->id_auteur,
                'type_cible'  => $request->type_cible,
                'id_cible'    => $request->id_cible,
                'sujet'       => $request->sujet,
                'description' => $request->description,
                'statut'      => $request->statut ?? 'en_attente',
                'date_reclamation' => now(),
            ]);

            return response()->json(['message' => 'Réclamation envoyée avec succès !'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    // Lister toutes les réclamations
    public function index()
    {
        // On récupère tout, trié par date de réclamation
        return response()->json(Reclamation::orderBy('date_reclamation', 'desc')->get());
    }
}
