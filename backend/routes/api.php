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
use App\Http\Controllers\MediaController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\HebergementEvaluationController;
use App\Http\Controllers\FavoriController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users/{id}', [AuthController::class, 'showProfile']);

// Routes publiques
Route::get('/hebergements', [HebergementController::class, 'index']);
Route::get('/hebergements/{id}', [HebergementController::class, 'show']);
Route::get('/cours', [CoursController::class, 'index']);
Route::get('/cours/{id}', [CoursController::class, 'show']);
Route::get('/matieres', [MatiereController::class, 'index']);
Route::get('/hebergements/{id}/evaluations', [HebergementEvaluationController::class, 'index']);

// Réclamations publiques (soumission sans compte obligatoire)
Route::post('/reclamations', [ReclamationController::class, 'store']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return new \App\Http\Resources\UtilisateurResource($request->user());
    });
    Route::put('/users/{id}', [AuthController::class, 'updateProfile']);
    Route::post('/users/{id}', [AuthController::class, 'updateProfile']);

    // Réservations (pour les étudiants uniquement)
    Route::middleware('role:etudiant')->group(function () {
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::post('/reservations', [ReservationController::class, 'store']);
    });

    // Hébergements (Propriétaire / Locateur / Admin)
    Route::middleware('role:proprietaire,locateur,admin')->group(function () {
        Route::get('/mes-hebergements', [HebergementController::class, 'mesHebergements']);
        Route::post('/hebergements', [HebergementController::class, 'store']);
        Route::put('/hebergements/{id}', [HebergementController::class, 'update']);
        Route::put('/hebergements/{id}/images', [HebergementController::class, 'updateImages']);
        Route::put('/hebergements/{id}/publication', [HebergementController::class, 'updatePublication']);
        Route::get('/mes-reservations', [ReservationController::class, 'mesReservationsProprietaire']);
        Route::put('/reservations/{id}/statut', [ReservationController::class, 'updateStatut']);
    });

    // Cours (Professeur / Admin)
    Route::middleware('role:professeur,admin')->group(function () {
        Route::get('/mes-cours', [CoursController::class, 'mesCours']);
        Route::post('/cours', [CoursController::class, 'store']);
    });

    // Évaluations (étudiants uniquement — un étudiant évalue un professeur/propriétaire)
    Route::middleware('role:etudiant')->group(function () {
        Route::post('/evaluations', [EvaluationController::class, 'store']);
    });

    // Paiements (tous les utilisateurs connectés)
    Route::post('/paiements', [PaiementController::class, 'store']);

    // Favoris
    Route::get('/favoris', [FavoriController::class, 'index']);
    Route::post('/favoris/{hebergementId}', [FavoriController::class, 'toggle']);

    // Évaluations des logements
    Route::post('/hebergements/{id}/evaluations', [HebergementEvaluationController::class, 'store']);

    // Signalements
    Route::post('/signalements', [SignalementController::class, 'store']);
    Route::get('/signalements/mes-envois', [SignalementController::class, 'mesSignalements']);

    // Messages
    Route::post('/messages', [MessageController::class, 'send']);
    Route::get('/messages/inbox', [MessageController::class, 'inbox']);
    Route::get('/messages/sent', [MessageController::class, 'sent']);
    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']);
    Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);

    // Conversations (Messagerie privée)
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/chat/users', [ConversationController::class, 'getEligibleUsers']);
    Route::get('/conversations/{id}/messages', [ConversationController::class, 'messages']);
    Route::post('/conversations/{id}/messages', [ConversationController::class, 'sendMessage']);
    Route::put('/conversations/{id}/read', [ConversationController::class, 'markAsRead']);
    Route::get('/conversations/unread-total', [ConversationController::class, 'unreadTotal']);

    // Media (Cloudinary upload URL save)
    Route::post('/save-media', [MediaController::class, 'store']);

    // Routes d'administration
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/statistiques', [AdminDashboardController::class, 'getStats']);
        Route::get('/reservations', [AdminDashboardController::class, 'getRecentReservations']);
        Route::get('/paiements', [AdminDashboardController::class, 'getPaiements']);
        Route::put('/hebergements/{id}/statut', [AdminDashboardController::class, 'updateHebergementStatus']);
        Route::get('/hebergements', [AdminDashboardController::class, 'getAllHebergements']);
        Route::get('/hebergements/{id}', [AdminDashboardController::class, 'getHebergement']);
        Route::delete('/hebergements/{id}', [AdminDashboardController::class, 'deleteHebergement']);
        Route::put('/cours/{id}/statut', [AdminDashboardController::class, 'updateCoursStatus']);
        Route::get('/cours', [AdminDashboardController::class, 'getAllCours']);
        Route::delete('/cours/{id}', [AdminDashboardController::class, 'deleteCours']);

        Route::post('/matieres', [MatiereController::class, 'store']);
        Route::delete('/matieres/{id}', [MatiereController::class, 'destroy']);

        Route::get('/signalements', [SignalementController::class, 'index']);
        Route::put('/signalements/{id}/statut', [SignalementController::class, 'updateStatus']);
        Route::delete('/signalements/{id}', [SignalementController::class, 'destroy']);
        Route::get('/reclamations', [ReclamationController::class, 'index']);
        Route::get('/utilisateurs', [AuthController::class, 'allUsers']);
        Route::post('/utilisateurs/admin', [AdminDashboardController::class, 'storeAdmin']);
        Route::put('/utilisateurs/{id}/statut', [AdminDashboardController::class, 'updateUtilisateurStatus']);
        Route::delete('/utilisateurs/{id}', [AuthController::class, 'deleteUser']);
    });
});
