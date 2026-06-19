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
     * Afficher tous les hébergements validés (Public)
     */
    public function index()
    {
        $hebergements = Hebergement::where('statut', 'valide')
            ->where('actif', true)
            ->with(['proprietaire', 'occupants'])
            ->get();

        return HebergementResource::collection($hebergements);
    }

    /**
     * Hébergements du propriétaire connecté (Tableau de bord)
     */
    public function mesHebergements()
    {
        $hebergements = Hebergement::where('id_createur', Auth::id())
            ->with(['proprietaire', 'occupants'])
            ->orderByDesc('created_at')
            ->get();

        return HebergementResource::collection($hebergements);
    }

    /**
     * Créer un nouvel hébergement
     */
    public function store(StoreHebergementRequest $request)
    {
        try {
            $validated = $request->validated();
            unset($validated['image_principale_url'], $validated['images_galerie_urls']);

            $validated['statut'] = 'en_attente';
            $validated['formule'] = 'standard';
            $validated['actif'] = true;

            if ($request->hasFile('image_principale')) {
                $validated['image_principale'] = $this->uploadOrUrl($request->file('image_principale'), 'uniconnect/hebergements');
            } elseif ($request->filled('image_principale_url')) {
                $validated['image_principale'] = $request->input('image_principale_url');
            }

            $gallery = [];
            if ($request->hasFile('images_galerie')) {
                foreach ($request->file('images_galerie') as $img) {
                    $gallery[] = $this->uploadOrUrl($img, 'uniconnect/hebergements/galerie');
                }
            }
            if ($request->filled('images_galerie_urls')) {
                foreach ($request->input('images_galerie_urls') as $url) {
                    if ($url) {
                        $gallery[] = $url;
                    }
                }
            }
            if (!empty($gallery)) {
                $validated['images_galerie'] = array_values(array_unique($gallery));
            }

            if (empty($validated['image_principale']) && !empty($validated['images_galerie'])) {
                $validated['image_principale'] = $validated['images_galerie'][0];
            }

            $hebergement = Hebergement::create(array_merge($validated, [
                'id_createur' => Auth::id(),
            ]));

            return response()->json([
                'message' => 'Hébergement créé avec succès',
                'data'    => new HebergementResource($hebergement->load(['proprietaire', 'occupants'])),
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
        $hebergement = Hebergement::with(['proprietaire', 'occupants'])->find($id);

        if (!$hebergement) {
            return response()->json(['message' => 'Hébergement non trouvé'], 404);
        }

        if ($hebergement->statut !== 'valide') {
            $user = Auth::user();
            $isOwner = $user && $user->id_user === $hebergement->id_createur;
            $isAdmin = $user && $user->role === 'admin';
            if (!$isOwner && !$isAdmin) {
                return response()->json(['message' => 'Cet hébergement n\'est pas encore validé.'], 403);
            }
        }

        return new HebergementResource($hebergement);
    }

    /**
     * Mettre à jour visibilité / formule (propriétaire)
     */
    public function updatePublication(Request $request, int $id)
    {
        $hebergement = Hebergement::where('id_createur', Auth::id())->findOrFail($id);

        $request->validate([
            'actif'   => 'sometimes|boolean',
            'formule' => 'sometimes|in:standard,premium,gold',
        ]);

        if ($request->has('actif')) {
            $hebergement->actif = $request->boolean('actif');
        }
        if ($request->has('formule')) {
            $hebergement->formule = $request->input('formule');
        }

        $hebergement->save();

        return response()->json([
            'message' => 'Publication mise à jour',
            'data'    => new HebergementResource($hebergement->load(['proprietaire', 'occupants'])),
        ]);
    }

    /**
     * Upload Cloudinary avec repli URL si config absente
     */
    protected function uploadOrUrl($file, string $folder): string
    {
        try {
            return $this->cloudinary->upload($file, $folder);
        } catch (\Exception $e) {
            throw new \Exception(
                'Upload image impossible. Configurez Cloudinary ou utilisez des URLs d\'images.'
            );
        }
    }

    /**
     * Mettre à jour les images d'un hébergement existant
     */
    public function updateImages(Request $request, int $id)
    {
        $hebergement = Hebergement::where('id_createur', Auth::id())->findOrFail($id);

        if ($request->hasFile('image_principale')) {
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
            'data'    => new HebergementResource($hebergement->load(['proprietaire', 'occupants'])),
        ]);
    }
}
