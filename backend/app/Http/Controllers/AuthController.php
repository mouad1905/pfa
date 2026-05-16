<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Utilisateur;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = Utilisateur::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'cin' => $request->cin,
                'email' => $request->email,
                'mot_de_passe' => Hash::make($request->password),
                'role' => $request->role,
                'niveau_etude' => $request->niveau_etude,
            ]);

            // Générer le token immédiatement après l'inscription (optionnel mais pratique)
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Utilisateur créé avec succès !',
                'access_token' => $token,
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'erreur',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // --- CONNEXION (LOGIN) ---
    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        // On cherche l'utilisateur par son email
        $user = Utilisateur::where('email', $request->email)->first();

        // On vérifie si l'utilisateur existe et si le mot de passe correspond
        if (!$user || !Hash::check($request->password, $user->mot_de_passe)) {
            return response()->json([
                'status' => 'erreur',
                'message' => 'Identifiants incorrects'
            ], 401);
        }

        // Création du token (Laravel Sanctum, installé avec install:api)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
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
        return response()->json($users);
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
}
