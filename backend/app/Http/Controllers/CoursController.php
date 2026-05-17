<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CoursResource;
use App\Http\Requests\Cours\StoreCoursRequest;

class CoursController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary) {}

    /**
     * Afficher tous les cours (Public)
     */
    public function index()
    {
        $cours = Cours::where('statut', 'valide')->with(['professeur.evaluationsRecues'])->get();
        return CoursResource::collection($cours);
    }

    /**
     * Créer un cours avec upload d'image optionnelle (Professeur)
     */
    public function store(StoreCoursRequest $request)
    {
        try {
            $validated = $request->validated();

            // Upload image du cours vers Cloudinary (optionnel)
            if ($request->hasFile('image_cours')) {
                $validated['image_cours'] = $this->cloudinary->upload(
                    $request->file('image_cours'),
                    'uniconnect/cours'
                );
            }

            $cours = Cours::create(array_merge($validated, [
                'id_professeur' => Auth::id(),
            ]));

            return response()->json([
                'message' => 'Cours créé avec succès',
                'data'    => new CoursResource($cours->load('professeur')),
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Afficher un cours spécifique
     */
    public function show(int $id)
    {
        $cours = Cours::with(['professeur.evaluationsRecues'])->findOrFail($id);
        
        // Prevent guests/students from viewing unvalidated courses
        if ($cours->statut !== 'valide') {
            $user = Auth::user();
            $isOwner = $user && $user->id_user === $cours->id_professeur;
            $isAdmin = $user && $user->role === 'admin';
            if (!$isOwner && !$isAdmin) {
                return response()->json(['error' => 'Ce cours n\'est pas encore validé par l\'administration.'], 403);
            }
        }
        
        return new CoursResource($cours);
    }

    /**
     * Mettre à jour l'image d'un cours existant
     */
    public function updateImage(Request $request, int $id)
    {
        $cours = Cours::where('id_professeur', Auth::id())->findOrFail($id);

        $request->validate([
            'image_cours' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        // Supprimer l'ancienne image sur Cloudinary
        $this->cloudinary->delete($cours->image_cours);

        $cours->image_cours = $this->cloudinary->upload(
            $request->file('image_cours'),
            'uniconnect/cours'
        );
        $cours->save();

        return response()->json([
            'message' => 'Image du cours mise à jour',
            'data'    => new CoursResource($cours),
        ]);
    }
}
