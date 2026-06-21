<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Evaluation;
use App\Models\Utilisateur;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\CoursResource;
use App\Http\Requests\Cours\StoreCoursRequest;

class CoursController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary) {}

    /**
     * Statistiques du tableau de bord professeur
     */
    public function getStats()
    {
        $profId = Auth::id();

        $safeCount = function ($query) {
            try { return $query->count(); } catch (\Exception) { return 0; }
        };

        $cours = Cours::where('id_professeur', $profId);
        $totalCours    = $safeCount(clone $cours);
        $valides       = $safeCount((clone $cours)->where('statut', 'valide'));
        $enAttente     = $safeCount((clone $cours)->where('statut', 'en_attente'));
        $rejetes       = $safeCount((clone $cours)->where('statut', 'rejete'));

        $evaluations = collect();
        $moyenne     = 0;
        try {
            $evaluations = Evaluation::where('id_cible', $profId);
            $totalEvals  = $safeCount(clone $evaluations);
            $moyenne     = $totalEvals > 0 ? round(Evaluation::where('id_cible', $profId)->avg('note'), 1) : 0;
        } catch (\Exception) { $totalEvals = 0; }

        // Évolution mensuelle des cours créés
        $coursEvo = collect();
        try {
            $coursEvo = Cours::selectRaw("TO_CHAR(created_at, 'YYYY-MM') as mois, COUNT(*) as total")
                ->where('id_professeur', $profId)
                ->where('created_at', '>=', now()->subMonths(12))
                ->groupByRaw("TO_CHAR(created_at, 'YYYY-MM')")
                ->orderBy('mois')
                ->get()
                ->keyBy('mois');
        } catch (\Exception) {
            try {
                $coursEvo = Cours::selectRaw("strftime('%Y-%m', created_at) as mois, COUNT(*) as total")
                    ->where('id_professeur', $profId)
                    ->where('created_at', '>=', now()->subMonths(12))
                    ->groupByRaw("strftime('%Y-%m', created_at)")
                    ->orderBy('mois')
                    ->get()
                    ->keyBy('mois');
            } catch (\Exception) {
                try {
                    $coursEvo = Cours::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as mois, COUNT(*) as total")
                        ->where('id_professeur', $profId)
                        ->where('created_at', '>=', now()->subMonths(12))
                        ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
                        ->orderBy('mois')
                        ->get()
                        ->keyBy('mois');
                } catch (\Exception) {}
            }
        }

        // Évolution mensuelle des évaluations reçues
        $evalEvo = collect();
        try {
            $evalEvo = Evaluation::selectRaw("TO_CHAR(date_evaluation, 'YYYY-MM') as mois, COUNT(*) as total, AVG(note) as moyenne")
                ->where('id_cible', $profId)
                ->where('date_evaluation', '>=', now()->subMonths(12))
                ->groupByRaw("TO_CHAR(date_evaluation, 'YYYY-MM')")
                ->orderBy('mois')
                ->get()
                ->keyBy('mois');
        } catch (\Exception) {
            try {
                $evalEvo = Evaluation::selectRaw("strftime('%Y-%m', date_evaluation) as mois, COUNT(*) as total, AVG(note) as moyenne")
                    ->where('id_cible', $profId)
                    ->where('date_evaluation', '>=', now()->subMonths(12))
                    ->groupByRaw("strftime('%Y-%m', date_evaluation)")
                    ->orderBy('mois')
                    ->get()
                    ->keyBy('mois');
            } catch (\Exception) {
                try {
                    $evalEvo = Evaluation::selectRaw("DATE_FORMAT(date_evaluation, '%Y-%m') as mois, COUNT(*) as total, AVG(note) as moyenne")
                        ->where('id_cible', $profId)
                        ->where('date_evaluation', '>=', now()->subMonths(12))
                        ->groupByRaw("DATE_FORMAT(date_evaluation, '%Y-%m')")
                        ->orderBy('mois')
                        ->get()
                        ->keyBy('mois');
                } catch (\Exception) {}
            }
        }

        // Compléter les 12 mois
        $labels = collect();
        for ($i = 11; $i >= 0; $i--) {
            $labels->push(now()->subMonths($i)->format('Y-m'));
        }

        return response()->json([
            'cours' => [
                'total'     => $totalCours,
                'valides'   => $valides,
                'en_attente' => $enAttente,
                'rejetes'   => $rejetes,
            ],
            'evaluations' => [
                'total'   => $totalEvals,
                'moyenne' => $moyenne,
            ],
            'evolution_cours'     => $labels->map(fn($m) => ['mois' => $m, 'total' => (int) ($coursEvo[$m]->total ?? 0)]),
            'evolution_evaluations' => $labels->map(fn($m) => [
                'mois'    => $m,
                'total'   => (int) ($evalEvo[$m]->total ?? 0),
                'moyenne' => round((float) ($evalEvo[$m]->moyenne ?? 0), 1),
            ]),
        ]);
    }

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

            // Upload diplôme de vérification vers Cloudinary (optionnel)
            if ($request->hasFile('diplome_verification')) {
                $validated['diplome_verification'] = $this->cloudinary->upload(
                    $request->file('diplome_verification'),
                    'uniconnect/cours/diplomes'
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
     * Cours du professeur connecté (Tableau de bord)
     */
    public function mesCours()
    {
        $cours = Cours::where('id_professeur', Auth::id())
            ->with(['professeur.evaluationsRecues'])
            ->orderByDesc('created_at')
            ->get();

        return CoursResource::collection($cours);
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
    /**
     * Mettre à jour un cours (propriétaire uniquement)
     */
    public function update(Request $request, int $id)
    {
        $cours = Cours::where('id_professeur', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'matiere'           => 'sometimes|string|max:100|exists:matiere,nom',
            'prix'              => 'sometimes|numeric|min:0',
            'type_prix'         => 'sometimes|in:DH/h',
            'niveau_etude'      => 'sometimes|string|max:100',
            'description'       => 'nullable|string',
            'mode_enseignement' => 'sometimes|in:en_ligne,presentiel',
        ]);

        try {
            if ($request->hasFile('image_cours')) {
                $this->cloudinary->delete($cours->image_cours);
                $validated['image_cours'] = $this->cloudinary->upload(
                    $request->file('image_cours'),
                    'uniconnect/cours'
                );
            }
        } catch (\Exception) {}

        $cours->update($validated);

        return response()->json([
            'message' => 'Cours mis à jour avec succès',
            'data'    => new CoursResource($cours->load('professeur')),
        ]);
    }

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
