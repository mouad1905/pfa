<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CoursResource;
use App\Http\Requests\Cours\StoreCoursRequest;

class CoursController extends Controller
{
    public function index()
    {
        $cours = Cours::with('professeur')
            ->where('statut', 'valide')
            ->get();
        return CoursResource::collection($cours);
    }

    public function store(StoreCoursRequest $request)
    {
        $cours = Cours::create(array_merge($request->validated(), [
            'id_professeur' => Auth::id()
        ]));

        return response()->json([
            'message' => 'Cours créé avec succès',
            'data' => new CoursResource($cours)
        ], 201);
    }

    public function show(int $id)
    {
        $cours = Cours::with('professeur')->findOrFail($id);
        return new CoursResource($cours);
    }
}
