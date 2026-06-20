<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use App\Models\HebergementEvaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HebergementEvaluationController extends Controller
{
    public function index($hebergementId)
    {
        $evaluations = HebergementEvaluation::with('auteur')
            ->where('id_hebergement', $hebergementId)
            ->orderByDesc('date_evaluation')
            ->get();

        $avg = $evaluations->avg('note');

        return response()->json([
            'avg_rating'   => $avg ? round($avg, 1) : 0,
            'total'        => $evaluations->count(),
            'evaluations'  => $evaluations->map(fn ($e) => [
                'id_evaluation'  => $e->id_evaluation,
                'note'           => $e->note,
                'commentaire'    => $e->commentaire,
                'date_evaluation'=> $e->date_evaluation,
                'auteur'         => $e->auteur ? [
                    'id_user'      => $e->auteur->id_user,
                    'prenom'       => $e->auteur->prenom,
                    'nom'          => $e->auteur->nom,
                    'photo_profil' => $e->auteur->photo_profil,
                ] : null,
            ]),
        ]);
    }

    public function store(Request $request, $hebergementId)
    {
        $hebergement = Hebergement::findOrFail($hebergementId);

        $validated = $request->validate([
            'note'        => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:1000',
        ]);

        $existing = HebergementEvaluation::where('id_hebergement', $hebergementId)
            ->where('id_auteur', Auth::id())
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà évalué ce logement.'], 422);
        }

        $evaluation = HebergementEvaluation::create([
            'id_hebergement' => $hebergementId,
            'id_auteur'      => Auth::id(),
            'note'           => $validated['note'],
            'commentaire'    => $validated['commentaire'],
            'date_evaluation'=> now(),
        ]);

        return response()->json([
            'message' => 'Évaluation enregistrée.',
            'data'    => $evaluation,
        ], 201);
    }
}
