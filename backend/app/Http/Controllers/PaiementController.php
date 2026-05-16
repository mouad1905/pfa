<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaiementController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type'         => 'required|string|in:cours,hebergement',
                'id_reference' => 'required|integer',
                'montant'      => 'required|numeric',
                'statut'       => 'required|string|in:reussi,echoue'
            ]);

            $paiement = Paiement::create([
                'id_user'       => Auth::id(),
                'type'          => $validated['type'],
                'id_reference'  => $validated['id_reference'],
                'montant'       => $validated['montant'],
                'statut'        => $validated['statut'],
                'date_paiement' => now()
            ]);

            return response()->json($paiement, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}