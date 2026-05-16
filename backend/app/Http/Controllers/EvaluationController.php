<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EvaluationController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'id_cible'    => 'required|exists:utilisateur,id_user',
                'note'        => 'required|integer|min:1|max:5',
                'commentaire' => 'nullable|string'
            ]);

            $evaluation = Evaluation::create([
                'id_auteur'   => Auth::id(), // ID de l'utilisateur connecté
                'id_cible'    => $validated['id_cible'],
                'note'        => $validated['note'],
                'commentaire' => $validated['commentaire'],
                'date_evaluation' => now()
            ]);

            return response()->json($evaluation, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}