<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Utilisateur;
use App\Models\Hebergement;
use App\Models\Cours;
use App\Models\Reservation;
use App\Models\Paiement;
use App\Models\Signalement;
use App\Models\Reclamation;
use App\Models\Evaluation;
use App\Models\Matiere;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\HebergementResource;
use App\Http\Resources\CoursResource;

class AdminDashboardController extends Controller
{
    /**
     * Obtenir les statistiques globales de la plateforme
     */
    public function getStats()
    {
        $safeCount = function ($model, $column = null, $value = null) {
            try {
                $q = $model::query();
                if ($column) $q->where($column, $value);
                return $q->count();
            } catch (\Exception) { return 0; }
        };

        $safeSum = function ($model, $column) {
            try {
                return $model::sum($column) ?: 0;
            } catch (\Exception) { return 0; }
        };

        $safeAvg = function ($model, $column) {
            try {
                return round($model::avg($column), 1) ?: 0;
            } catch (\Exception) { return 0; }
        };

        return response()->json([
            'utilisateurs' => [
                'total' => $safeCount(Utilisateur::class),
                'etudiants' => $safeCount(Utilisateur::class, 'role', 'etudiant'),
                'professeurs' => $safeCount(Utilisateur::class, 'role', 'professeur'),
                'proprietaires' => $safeCount(Utilisateur::class, 'role', 'proprietaire'),
                'locateurs' => $safeCount(Utilisateur::class, 'role', 'locateur'),
                'admins' => $safeCount(Utilisateur::class, 'role', 'admin'),
                'suspendus' => $safeCount(Utilisateur::class, 'statut', 'suspendu'),
                'en_attente' => $safeCount(Utilisateur::class, 'statut', 'en_attente'),
                'actifs' => $safeCount(Utilisateur::class, 'statut', 'actif'),
                'inscrits_7j' => Utilisateur::where('created_at', '>=', now()->subDays(7))->count(),
                'inscrits_30j' => Utilisateur::where('created_at', '>=', now()->subDays(30))->count(),
            ],
            'annonces' => [
                'hebergements_valides' => $safeCount(Hebergement::class, 'statut', 'valide'),
                'hebergements_en_attente' => $safeCount(Hebergement::class, 'statut', 'en_attente'),
                'hebergements_rejetes' => $safeCount(Hebergement::class, 'statut', 'rejete'),
                'cours_valides' => $safeCount(Cours::class, 'statut', 'valide'),
                'cours_en_attente' => $safeCount(Cours::class, 'statut', 'en_attente'),
                'cours_rejetes' => $safeCount(Cours::class, 'statut', 'rejete'),
            ],
            'reservations' => [
                'total' => $safeCount(Reservation::class),
                'en_attente' => $safeCount(Reservation::class, 'statut', 'en_attente'),
                'confirmees' => $safeCount(Reservation::class, 'statut', 'confirmee'),
                'annulees' => $safeCount(Reservation::class, 'statut', 'annulee'),
            ],
            'finances' => [
                'total_transactions' => $safeCount(Paiement::class),
                'chiffre_affaires' => $safeSum(Paiement::class, 'montant'),
                'reussi' => $safeCount(Paiement::class, 'statut', 'reussi'),
                'echoue' => $safeCount(Paiement::class, 'statut', 'echoue'),
            ],
            'signalements' => [
                'total' => $safeCount(Signalement::class),
                'en_attente' => $safeCount(Signalement::class, 'statut', 'en_attente'),
                'traites' => $safeCount(Signalement::class, 'statut', 'traite'),
                'rejetes' => $safeCount(Signalement::class, 'statut', 'rejete'),
            ],
            'reclamations' => [
                'total' => $safeCount(Reclamation::class),
                'en_attente' => $safeCount(Reclamation::class, 'statut', 'en_attente'),
                'traitees' => $safeCount(Reclamation::class, 'statut', 'traitee'),
                'rejetees' => $safeCount(Reclamation::class, 'statut', 'rejetee'),
            ],
            'evaluations' => [
                'total' => $safeCount(Evaluation::class),
                'moyenne_generale' => $safeAvg(Evaluation::class, 'note'),
                'notes_5' => $safeCount(Evaluation::class, 'note', 5),
                'notes_4' => $safeCount(Evaluation::class, 'note', 4),
                'notes_3' => $safeCount(Evaluation::class, 'note', 3),
                'notes_2' => $safeCount(Evaluation::class, 'note', 2),
                'notes_1' => $safeCount(Evaluation::class, 'note', 1),
            ],
            'matieres' => [
                'total' => $safeCount(Matiere::class),
            ],
        ]);
    }

    /**
     * Données d'évolution mensuelle pour les courbes (réservations + évaluations)
     */
    public function getEvolution()
    {
        $months = 12;

        $reservations = collect();
        try {
            $reservations = Reservation::selectRaw("TO_CHAR(created_at, 'YYYY-MM') as mois, COUNT(*) as total")
                ->where('created_at', '>=', now()->subMonths($months))
                ->groupByRaw("TO_CHAR(created_at, 'YYYY-MM')")
                ->orderBy('mois')
                ->get()
                ->keyBy('mois');
        } catch (\Exception) {
            try {
                $reservations = Reservation::selectRaw("strftime('%Y-%m', created_at) as mois, COUNT(*) as total")
                    ->where('created_at', '>=', now()->subMonths($months))
                    ->groupByRaw("strftime('%Y-%m', created_at)")
                    ->orderBy('mois')
                    ->get()
                    ->keyBy('mois');
            } catch (\Exception) {
                try {
                    $reservations = Reservation::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as mois, COUNT(*) as total")
                        ->where('created_at', '>=', now()->subMonths($months))
                        ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
                        ->orderBy('mois')
                        ->get()
                        ->keyBy('mois');
                } catch (\Exception) {}
            }
        }

        $evaluations = collect();
        try {
            $evaluations = Evaluation::selectRaw("TO_CHAR(date_evaluation, 'YYYY-MM') as mois, COUNT(*) as total, AVG(note) as moyenne")
                ->where('date_evaluation', '>=', now()->subMonths($months))
                ->groupByRaw("TO_CHAR(date_evaluation, 'YYYY-MM')")
                ->orderBy('mois')
                ->get()
                ->keyBy('mois');
        } catch (\Exception) {
            try {
                $evaluations = Evaluation::selectRaw("strftime('%Y-%m', date_evaluation) as mois, COUNT(*) as total, AVG(note) as moyenne")
                    ->where('date_evaluation', '>=', now()->subMonths($months))
                    ->groupByRaw("strftime('%Y-%m', date_evaluation)")
                    ->orderBy('mois')
                    ->get()
                    ->keyBy('mois');
            } catch (\Exception) {
                try {
                    $evaluations = Evaluation::selectRaw("DATE_FORMAT(date_evaluation, '%Y-%m') as mois, COUNT(*) as total, AVG(note) as moyenne")
                        ->where('date_evaluation', '>=', now()->subMonths($months))
                        ->groupByRaw("DATE_FORMAT(date_evaluation, '%Y-%m')")
                        ->orderBy('mois')
                        ->get()
                        ->keyBy('mois');
                } catch (\Exception) {}
            }
        }

        // Compléter les 12 mois avec des zéros
        $labels = collect();
        for ($i = $months - 1; $i >= 0; $i--) {
            $labels->push(now()->subMonths($i)->format('Y-m'));
        }

        $resData = $labels->map(fn($m) => [
            'mois' => $m,
            'total' => (int) ($reservations[$m]->total ?? 0),
        ]);

        $evalData = $labels->map(fn($m) => [
            'mois' => $m,
            'total' => (int) ($evaluations[$m]->total ?? 0),
            'moyenne' => round((float) ($evaluations[$m]->moyenne ?? 0), 1),
        ]);

        return response()->json([
            'reservations' => $resData,
            'evaluations'  => $evalData,
        ]);
    }

    /**
     * Obtenir les réservations récentes (Activités)
     */
    public function getRecentReservations()
    {
        $reservations = Reservation::with(['etudiant', 'hebergement'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($reservations);
    }

    /**
     * Obtenir l'historique des paiements
     */
    public function getPaiements()
    {
        $paiements = Paiement::with(['reservation', 'etudiant'])->orderBy('date_paiement', 'desc')->paginate(20);
        return response()->json($paiements);
    }

    /**
     * Valider ou rejeter un hébergement
     */
    public function updateHebergementStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'statut' => 'required|in:valide,rejete'
        ]);

        $hebergement = Hebergement::findOrFail($id);
        $hebergement->update(['statut' => $validated['statut']]);

        return response()->json([
            'message' => 'Statut de l\'hébergement mis à jour',
            'data' => new HebergementResource($hebergement)
        ]);
    }

    /**
     * Valider ou rejeter un cours
     */
    public function updateCoursStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'statut' => 'required|in:valide,rejete'
        ]);

        $cours = Cours::findOrFail($id);
        $cours->update(['statut' => $validated['statut']]);

        return response()->json([
            'message' => 'Statut du cours mis à jour',
            'data' => new CoursResource($cours)
        ]);
    }

    /**
     * Valider ou rejeter un utilisateur
     */
    public function updateUtilisateurStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'statut' => 'required|in:actif,suspendu,en_attente'
        ]);

        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->update(['statut' => $validated['statut']]);

        return response()->json([
            'message' => 'Statut de l\'utilisateur mis à jour',
            'data' => new \App\Http\Resources\UtilisateurResource($utilisateur)
        ]);
    }

    /**
     * Obtenir tous les cours pour l'administration
     */
    public function getAllCours()
    {
        $cours = Cours::with('professeur')->orderBy('created_at', 'desc')->get();
        return CoursResource::collection($cours);
    }

    /**
     * Supprimer un cours
     */
    public function deleteCours($id)
    {
        $cours = Cours::findOrFail($id);
        $cours->delete();

        return response()->json([
            'message' => 'Cours supprimé avec succès'
        ]);
    }

    /**
     * Créer un nouvel administrateur (Admin only)
     */
    public function storeAdmin(Request $request)
    {
        $validated = $request->validate([
            'nom'      => 'required|string|max:50',
            'prenom'   => 'required|string|max:50',
            'email'    => 'required|email|unique:utilisateur,email',
            'password' => 'required|string|min:6',
            'telephone'=> 'nullable|string|max:20',
        ]);

        $admin = Utilisateur::create([
            'nom'          => $validated['nom'],
            'prenom'       => $validated['prenom'],
            'email'        => $validated['email'],
            'mot_de_passe' => Hash::make($validated['password']),
            'telephone'    => $validated['telephone'] ?? null,
            'role'         => 'admin',
            'statut'       => 'actif', // L'admin créé est actif par défaut
            'cin'          => 'ADMIN_' . strtoupper(uniqid()), // Pour satisfaire les contraintes d'unicité éventuelles du CIN
        ]);

        return response()->json([
            'message' => 'Administrateur créé avec succès',
            'data'    => new \App\Http\Resources\UtilisateurResource($admin)
        ], 201);
    }

    /**
     * Obtenir tous les hébergements (Admin moderation list)
     */
    public function getAllHebergements()
    {
        $hebergements = Hebergement::with(['proprietaire', 'occupants'])->orderBy('created_at', 'desc')->get();
        return HebergementResource::collection($hebergements);
    }

    /**
     * Obtenir un hébergement spécifique (Admin moderation detail)
     */
    public function getHebergement($id)
    {
        $hebergement = Hebergement::with(['proprietaire', 'occupants'])->findOrFail($id);
        return new HebergementResource($hebergement);
    }

    /**
     * Supprimer un hébergement (Admin)
     */
    public function deleteHebergement($id)
    {
        $hebergement = Hebergement::findOrFail($id);
        $hebergement->delete();

        return response()->json([
            'message' => 'Hébergement supprimé avec succès'
        ]);
    }
}
