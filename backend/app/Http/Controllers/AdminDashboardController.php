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
        return response()->json([
            'utilisateurs' => [
                'total' => Utilisateur::count(),
                'etudiants' => Utilisateur::where('role', 'etudiant')->count(),
                'professeurs' => Utilisateur::where('role', 'professeur')->count(),
                'proprietaires' => Utilisateur::where('role', 'proprietaire')->count(),
                'locateurs' => Utilisateur::where('role', 'locateur')->count(),
                'admins' => Utilisateur::where('role', 'admin')->count(),
                'suspendus' => Utilisateur::where('statut', 'suspendu')->count(),
                'en_attente' => Utilisateur::where('statut', 'en_attente')->count(),
                'actifs' => Utilisateur::where('statut', 'actif')->count(),
                'inscrits_7j' => Utilisateur::where('created_at', '>=', now()->subDays(7))->count(),
                'inscrits_30j' => Utilisateur::where('created_at', '>=', now()->subDays(30))->count(),
            ],
            'annonces' => [
                'hebergements_valides' => Hebergement::where('statut', 'valide')->count(),
                'hebergements_en_attente' => Hebergement::where('statut', 'en_attente')->count(),
                'hebergements_rejetes' => Hebergement::where('statut', 'rejete')->count(),
                'cours_valides' => Cours::where('statut', 'valide')->count(),
                'cours_en_attente' => Cours::where('statut', 'en_attente')->count(),
                'cours_rejetes' => Cours::where('statut', 'rejete')->count(),
            ],
            'reservations' => [
                'total' => Reservation::count(),
                'en_attente' => Reservation::where('statut', 'en_attente')->count(),
                'confirmees' => Reservation::where('statut', 'confirmee')->count(),
                'annulees' => Reservation::where('statut', 'annulee')->count(),
            ],
            'finances' => [
                'total_transactions' => Paiement::count(),
                'chiffre_affaires' => Paiement::sum('montant'),
                'reussi' => Paiement::where('statut', 'reussi')->count(),
                'echoue' => Paiement::where('statut', 'echoue')->count(),
            ],
            'signalements' => [
                'total' => Signalement::count(),
                'en_attente' => Signalement::where('statut', 'en_attente')->count(),
                'traites' => Signalement::where('statut', 'traite')->count(),
                'rejetes' => Signalement::where('statut', 'rejete')->count(),
            ],
            'reclamations' => [
                'total' => Reclamation::count(),
                'en_attente' => Reclamation::where('statut', 'en_attente')->count(),
                'traitees' => Reclamation::where('statut', 'traitee')->count(),
                'rejetees' => Reclamation::where('statut', 'rejetee')->count(),
            ],
            'evaluations' => [
                'total' => Evaluation::count(),
                'moyenne_generale' => round(Evaluation::avg('note'), 1) ?: 0,
                'notes_5' => Evaluation::where('note', 5)->count(),
                'notes_4' => Evaluation::where('note', 4)->count(),
                'notes_3' => Evaluation::where('note', 3)->count(),
                'notes_2' => Evaluation::where('note', 2)->count(),
                'notes_1' => Evaluation::where('note', 1)->count(),
            ],
            'matieres' => [
                'total' => Matiere::count(),
            ],
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
