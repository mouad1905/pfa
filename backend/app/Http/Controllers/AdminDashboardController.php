<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Utilisateur;
use App\Models\Hebergement;
use App\Models\Cours;
use App\Models\Reservation;
use App\Models\Paiement;
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
            ],
            'annonces' => [
                'hebergements_valides' => Hebergement::where('statut', 'valide')->count(),
                'hebergements_en_attente' => Hebergement::where('statut', 'en_attente')->count(),
                'cours_valides' => Cours::where('statut', 'valide')->count(),
                'cours_en_attente' => Cours::where('statut', 'en_attente')->count(),
            ],
            'reservations' => [
                'total' => Reservation::count(),
                'en_attente' => Reservation::where('statut', 'en_attente')->count(),
                'confirmees' => Reservation::where('statut', 'confirmee')->count(),
            ],
            'finances' => [
                'total_transactions' => Paiement::count(),
                'chiffre_affaires' => Paiement::sum('montant'),
            ]
        ]);
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
}
