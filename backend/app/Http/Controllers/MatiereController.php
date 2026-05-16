<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use Illuminate\Http\Request;
use App\Http\Resources\MatiereResource;

class MatiereController extends Controller
{
    public function index()
    {
        return MatiereResource::collection(Matiere::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|unique:matiere,nom|max:100',
        ]);

        $matiere = Matiere::create($validated);

        return response()->json([
            'message' => 'Matière ajoutée avec succès',
            'data' => new MatiereResource($matiere)
        ], 201);
    }

    public function destroy($id)
    {
        $matiere = Matiere::findOrFail($id);
        $matiere->delete();

        return response()->json(['message' => 'Matière supprimée avec succès']);
    }
}
