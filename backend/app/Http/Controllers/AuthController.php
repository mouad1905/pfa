<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Utilisateur;
use App\Services\CloudinaryService;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary) {}
    public function register(RegisterRequest $request)
    {
        try {
            $validated = $request->validated();

            $userData = [
                'nom'            => $request->nom,
                'prenom'         => $request->prenom,
                'cin'            => $request->cin,
                'email'          => $request->email,
                'telephone'      => $request->telephone,
                'date_naissance' => $request->date_naissance,
                'mot_de_passe'   => Hash::make($request->password),
                'role'           => $request->role,
                'niveau_etude'   => $request->niveau_etude,
            ];

            // Upload photo de profil (tous les rôles)
            if ($request->hasFile('photo_profil')) {
                $userData['photo_profil'] = $this->cloudinary->upload(
                    $request->file('photo_profil'),
                    'uniconnect/profils'
                );
            }

            // Upload document d'identité CIN / Passeport (tous les rôles)
            if ($request->hasFile('document_identite')) {
                $userData['document_identite'] = $this->cloudinary->upload(
                    $request->file('document_identite'),
                    'uniconnect/documents'
                );
            }

            // Upload certificat / diplôme (Professeurs)
            if ($request->hasFile('certificat')) {
                $userData['certificat'] = $this->cloudinary->upload(
                    $request->file('certificat'),
                    'uniconnect/certificats'
                );
            }

            // Upload carte étudiante (Étudiants)
            if ($request->hasFile('carte_etudiant')) {
                $userData['carte_etudiant'] = $this->cloudinary->upload(
                    $request->file('carte_etudiant'),
                    'uniconnect/cartes'
                );
            }

            $user = Utilisateur::create($userData);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status'       => 'success',
                'message'      => 'Utilisateur créé avec succès !',
                'access_token' => $token,
                'user'         => $user
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'erreur',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // --- CONNEXION (LOGIN) ---
    public function login(LoginRequest $request)
    {
        try {
            $validated = $request->validated();

            // On cherche l'utilisateur par son email
            $user = Utilisateur::where('email', $request->email)->first();

            // On vérifie si l'utilisateur existe et si le mot de passe correspond
            if (!$user || !Hash::check($request->password, $user->mot_de_passe)) {
                return response()->json([
                    'status'  => 'erreur',
                    'message' => 'Identifiants incorrects. Email ou mot de passe invalide.'
                ], 401);
            }

            // Vérification du statut du compte
            if ($user->statut === 'suspendu') {
                return response()->json([
                    'status'  => 'erreur',
                    'message' => 'Votre compte a été suspendu. Contactez l\'administrateur.'
                ], 403);
            }

            if ($user->statut === 'en_attente') {
                return response()->json([
                    'status'  => 'erreur',
                    'message' => 'Votre compte est en attente de validation. Veuillez patienter.'
                ], 403);
            }

            // Création du token (Laravel Sanctum)
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status'       => 'success',
                'message'      => 'Connexion réussie',
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => new \App\Http\Resources\UtilisateurResource($user)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'erreur',
                'message' => 'Erreur serveur : ' . $e->getMessage()
            ], 500);
        }
    }

    // --- DÉCONNEXION (LOGOUT) ---
    public function logout(Request $request)
    {
        // Supprime le token actuel de l'utilisateur
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Déconnexion réussie'
        ]);
    }
    // Lister tous les utilisateurs (pour l'admin)
    public function allUsers()
    {
        $users = Utilisateur::all();
        return \App\Http\Resources\UtilisateurResource::collection($users);
    }

    // Supprimer un utilisateur (Bannissement)
    public function deleteUser(Request $request, int $id)
    {
        // 1. On récupère l'utilisateur que l'on veut supprimer
        $userToDelete = Utilisateur::findOrFail($id);

        // 2. On récupère l'utilisateur actuellement connecté via le Guard
        // Note: Assure-toi que ton modèle Utilisateur est bien celui utilisé pour l'auth
        $currentUser = Auth::user();

        if (!$currentUser) {
            return response()->json(['error' => 'Vous devez être connecté'], 401);
        }

        // 4. Comparaison des identifiants (id_user)
        if ($userToDelete->id_user === $currentUser->id_user) {
            return response()->json(['error' => 'Vous ne pouvez pas supprimer votre propre compte'], 403);
        }

        // 5. Suppression
        $userToDelete->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    // Voir le profil public d'un utilisateur
    public function showProfile(int $id)
    {
        $user = Utilisateur::with(['evaluationsRecues.auteur'])->findOrFail($id);
        
        $avg_rating = round($user->evaluationsRecues()->avg('note'), 1) ?: 0.0;
        $evaluations_count = $user->evaluationsRecues()->count();

        $user->avg_rating = $avg_rating;
        $user->evaluations_count = $evaluations_count;

        return new \App\Http\Resources\UtilisateurResource($user);
    }

    // Mettre à jour le profil d'un utilisateur
    public function updateProfile(Request $request, int $id)
    {
        $user = Utilisateur::findOrFail($id);

        $validated = $request->validate([
            'prenom'       => 'required|string|max:50',
            'nom'          => 'required|string|max:50',
            'telephone'    => 'nullable|string|max:20',
            'niveau_etude' => 'nullable|string|max:50',
            'about'        => 'nullable|string|max:1000',
            'photo_profil' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('photo_profil')) {
            $file = $request->file('photo_profil');
            if ($file->isValid()) {
                $validated['photo_profil'] = $this->cloudinary->upload(
                    $file,
                    'uniconnect/profiles'
                );
            } else {
                unset($validated['photo_profil']);
            }
        } else {
            unset($validated['photo_profil']);
        }

        $user->update($validated);
        $user->refresh();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'data'    => new \App\Http\Resources\UtilisateurResource($user)
        ]);
    }
}
