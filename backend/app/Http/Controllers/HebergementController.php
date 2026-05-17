<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Hebergement\StoreHebergementRequest;
use App\Http\Resources\HebergementResource;

class HebergementController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary) {}

    /**
     * Afficher tous les hébergements (Public)
     */
    public function index()
    {
        $hebergements = Hebergement::where('statut', 'valide')->with('proprietaire')->get();
        return HebergementResource::collection($hebergements);
    }

    /**
     * Créer un nouvel hébergement avec upload d'images (Propriétaire uniquement)
     */
    public function store(StoreHebergementRequest $request)
    {
        try {
            $validated = $request->validated();

            // Upload image principale vers Cloudinary
            if ($request->hasFile('image_principale')) {
                $validated['image_principale'] = $this->cloudinary->upload(
                    $request->file('image_principale'),
                    'uniconnect/hebergements'
                );
            }

            // Upload galerie de photos (max 10 photos)
            if ($request->hasFile('images_galerie')) {
                $urls = [];
                foreach ($request->file('images_galerie') as $img) {
                    $urls[] = $this->cloudinary->upload($img, 'uniconnect/hebergements/galerie');
                }
                $validated['images_galerie'] = $urls;
            }

            $hebergement = Hebergement::create(array_merge($validated, [
                'id_createur' => Auth::id(),
            ]));

            return response()->json([
                'message' => 'Hébergement créé avec succès',
                'data'    => new HebergementResource($hebergement->load('proprietaire')),
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Voir les détails d'un hébergement
     */
    public function show(int $id)
    {
        $hebergement = Hebergement::with('proprietaire')->find($id);

        if (!$hebergement) {
            return response()->json(['message' => 'Hébergement non trouvé'], 404);
        }

        return new HebergementResource($hebergement);
    }

    /**
     * Mettre à jour les images d'un hébergement existant
     */
    public function updateImages(Request $request, int $id)
    {
        $hebergement = Hebergement::where('id_createur', Auth::id())->findOrFail($id);

        if ($request->hasFile('image_principale')) {
            // Supprimer l'ancienne image sur Cloudinary
            $this->cloudinary->delete($hebergement->image_principale);
            $hebergement->image_principale = $this->cloudinary->upload(
                $request->file('image_principale'),
                'uniconnect/hebergements'
            );
        }

        if ($request->hasFile('images_galerie')) {
            $urls = [];
            foreach ($request->file('images_galerie') as $img) {
                $urls[] = $this->cloudinary->upload($img, 'uniconnect/hebergements/galerie');
            }
            $hebergement->images_galerie = $urls;
        }

        $hebergement->save();

        return response()->json([
            'message' => 'Images mises à jour avec succès',
            'data'    => new HebergementResource($hebergement),
        ]);
    }
}
