<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\HebergementController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\SignalementController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\MatiereController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Reclamation;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes publiques
Route::get('/hebergements', [HebergementController::class, 'index']);
Route::get('/hebergements/{id}', [HebergementController::class, 'show']);
Route::get('/cours', [CoursController::class, 'index']);
Route::get('/cours/{id}', [CoursController::class, 'show']);
Route::get('/matieres', [MatiereController::class, 'index']);

Route::post('/reclamations', function (Request $request) {
    $validated = $request->validate([
        'id_auteur'   => 'required|integer',
        'type_cible'  => 'required|in:cours,hebergement,utilisateur',
        'description' => 'required|string',
        'sujet'       => 'nullable|string'
    ]);
    $reclamation = Reclamation::create($validated);
    return response()->json([
        'status' => 'Success',
        'message' => 'Réclamation enregistrée dans PostgreSQL',
        'data' => $reclamation
    ], 201);
});

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return new \App\Http\Resources\UtilisateurResource($request->user());
    });

    // Réservations (pour les étudiants)
    Route::middleware('role:etudiant')->group(function () {
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::post('/reservations', [ReservationController::class, 'store']);
    });

    // Hébergements (Propriétaire / Admin)
    Route::middleware('role:proprietaire,admin')->group(function () {
        Route::post('/hebergements', [HebergementController::class, 'store']);
    });

    // Cours (Professeur / Admin)
    Route::middleware('role:professeur,admin')->group(function () {
        Route::post('/cours', [CoursController::class, 'store']);
    });

    Route::post('/evaluations', [EvaluationController::class, 'store']);
    Route::post('/paiements', [PaiementController::class, 'store']);
    
    // Signalements
    Route::post('/signalements', [SignalementController::class, 'store']);
    Route::get('/signalements/mes-envois', [SignalementController::class, 'mesSignalements']);

    // Routes d'administration
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/statistiques', [AdminDashboardController::class, 'getStats']);
        Route::get('/paiements', [AdminDashboardController::class, 'getPaiements']);
        Route::put('/hebergements/{id}/statut', [AdminDashboardController::class, 'updateHebergementStatus']);
        Route::put('/cours/{id}/statut', [AdminDashboardController::class, 'updateCoursStatus']);
        
        Route::post('/matieres', [MatiereController::class, 'store']);
        Route::delete('/matieres/{id}', [MatiereController::class, 'destroy']);

        Route::get('/signalements', [SignalementController::class, 'index']);
        Route::put('/signalements/{id}/statut', [SignalementController::class, 'updateStatus']);
        Route::get('/reclamations', [ReclamationController::class, 'index']);
        Route::get('/utilisateurs', [AuthController::class, 'allUsers']);
        Route::delete('/utilisateurs/{id}', [AuthController::class, 'deleteUser']);
    });
});
