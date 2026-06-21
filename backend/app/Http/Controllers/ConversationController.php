<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    /**
     * Récupère toutes les conversations de l'utilisateur connecté.
     */
    public function index()
    {
        $userId = Auth::id();

        // Récupérer les conversations où l'utilisateur connecté est un participant
        $conversations = Conversation::whereHas('participants', function ($query) use ($userId) {
            $query->where('utilisateur.id_user', $userId);
        })
        ->with([
            'participants',
            'dernierMessage'
        ])
        ->orderByDesc('updated_at')
        ->get();

        // Mapper les conversations pour retourner des données claires et utiles
        $mapped = $conversations->map(function ($conversation) use ($userId) {
            // Trouver l'autre participant
            $otherUser = $conversation->participants->first(function ($user) use ($userId) {
                return $user->id_user !== $userId;
            });

            // Si la conversation n'a pas d'autre participant
            if (!$otherUser) {
                return null;
            }

            // Compter les messages non lus de cette conversation pour l'utilisateur connecté
            $unreadCount = $conversation->messages()
                ->where('id_destinataire', $userId)
                ->where('statut', 'envoye')
                ->count();

            return [
                'id_conversation' => $conversation->id_conversation,
                'other_user' => [
                    'id_user' => $otherUser->id_user,
                    'nom' => $otherUser->nom,
                    'prenom' => $otherUser->prenom,
                    'role' => $otherUser->role,
                    'photo_profil' => $otherUser->photo_profil,
                ],
                'dernier_message' => $conversation->dernierMessage ? [
                    'id_message' => $conversation->dernierMessage->id_message,
                    'contenu' => $conversation->dernierMessage->contenu,
                    'created_at' => $conversation->dernierMessage->created_at,
                    'id_expediteur' => $conversation->dernierMessage->id_expediteur,
                    'statut' => $conversation->dernierMessage->statut,
                ] : null,
                'unread_count' => $unreadCount,
                'created_at' => $conversation->created_at,
                'updated_at' => $conversation->updated_at,
            ];
        })->filter()->values();

        return response()->json($mapped);
    }

    /**
     * Initialise ou récupère une conversation existante entre l'utilisateur connecté et un destinataire.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_destinataire' => 'required|integer|exists:utilisateur,id_user',
            'contenu' => 'nullable|string|max:5000',
        ]);

        $userId = Auth::id();
        $destId = $request->id_destinataire;

        if ($userId === $destId) {
            return response()->json(['error' => 'Vous ne pouvez pas démarrer une conversation avec vous-même.'], 400);
        }

        $user = Auth::user();
        $destUser = \App\Models\Utilisateur::findOrFail($destId);

        // Validation des permissions de communication :
        // - L'admin peut discuter avec tout le monde
        // - Sinon, au moins un des deux participants doit être étudiant, et l'autre doit avoir un rôle valide (étudiant, professeur, locateur, propriétaire)
        $isUserAdmin = $user->role === 'admin';
        $isDestAdmin = $destUser->role === 'admin';
        $hasEtudiant = $user->role === 'etudiant' || $destUser->role === 'etudiant';
        $allowedRoles = ['etudiant', 'professeur', 'locateur', 'proprietaire'];
        $validRoles = in_array($user->role, $allowedRoles) && in_array($destUser->role, $allowedRoles);

        if (!$isUserAdmin && !$isDestAdmin && !($hasEtudiant && $validRoles)) {
            return response()->json([
                'error' => "Communication non autorisée. Les conversations directes ne sont permises qu'entre étudiants, ou entre un étudiant et un enseignant/locateur."
            ], 403);
        }

        // Vérifier si une conversation existe déjà
        $conversation = Conversation::whereHas('participants', function ($query) use ($userId) {
            $query->where('utilisateur.id_user', $userId);
        })
        ->whereHas('participants', function ($query) use ($destId) {
            $query->where('utilisateur.id_user', $destId);
        })
        ->first();

        if (!$conversation) {
            // Créer une nouvelle conversation
            $conversation = Conversation::create();
            $conversation->participants()->attach([$userId, $destId]);
        }

        // Si un premier message est fourni
        if ($request->filled('contenu')) {
            Message::create([
                'id_conversation' => $conversation->id_conversation,
                'id_expediteur' => $userId,
                'id_destinataire' => $destId,
                'contenu' => $request->contenu,
                'statut' => 'envoye',
            ]);

            $conversation->touch();
        }

        return response()->json([
            'message' => 'Conversation initialisée.',
            'id_conversation' => $conversation->id_conversation,
        ], 201);
    }

    /**
     * Récupère tous les messages d'une conversation et les marque comme lus.
     */
    public function messages($id)
    {
        $userId = Auth::id();
        $conversation = Conversation::findOrFail($id);

        // Vérifier si l'utilisateur fait partie de la conversation
        if (!$conversation->participants()->where('utilisateur.id_user', $userId)->exists()) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        // Marquer les messages reçus de cette conversation comme lus
        $conversation->messages()
            ->where('id_destinataire', $userId)
            ->where('statut', 'envoye')
            ->update(['statut' => 'lu']);

        // Récupérer les messages chronologiquement
        $messages = $conversation->messages()
            ->with(['expediteur', 'destinataire'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $messages
        ]);
    }

    /**
     * Envoie un message dans une conversation spécifique.
     */
    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'contenu' => 'required|string|max:5000',
        ]);

        $userId = Auth::id();
        $conversation = Conversation::findOrFail($id);

        // Vérifier si l'utilisateur fait partie de la conversation
        if (!$conversation->participants()->where('utilisateur.id_user', $userId)->exists()) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        // Trouver le destinataire
        $destUser = $conversation->participants()->where('utilisateur.id_user', '!=', $userId)->first();
        if (!$destUser) {
            return response()->json(['error' => 'Destinataire introuvable.'], 404);
        }

        $message = Message::create([
            'id_conversation' => $conversation->id_conversation,
            'id_expediteur' => $userId,
            'id_destinataire' => $destUser->id_user,
            'contenu' => $request->contenu,
            'statut' => 'envoye',
        ]);

        $conversation->touch();

        return response()->json([
            'status' => 'success',
            'data' => $message->load('expediteur', 'destinataire')
        ], 201);
    }

    /**
     * Marque tous les messages d'une conversation comme lus.
     */
    public function markAsRead($id)
    {
        $userId = Auth::id();
        $conversation = Conversation::findOrFail($id);

        if (!$conversation->participants()->where('utilisateur.id_user', $userId)->exists()) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $conversation->messages()
            ->where('id_destinataire', $userId)
            ->where('statut', 'envoye')
            ->update(['statut' => 'lu']);

        return response()->json(['message' => 'Conversation marquée comme lue.']);
    }

    /**
     * Retourne le nombre total de messages non lus de toutes les conversations.
     */
    public function unreadTotal()
    {
        $userId = Auth::id();

        $totalUnread = Message::where('id_destinataire', $userId)
            ->where('statut', 'envoye')
            ->count();

        return response()->json(['total_unread' => $totalUnread]);
    }

    /**
     * Récupère la liste des utilisateurs éligibles pour démarrer une conversation avec l'utilisateur connecté.
     */
    public function getEligibleUsers(Request $request)
    {
        $user = Auth::user();
        $userId = $user->id_user;
        $role = $user->role;

        $query = \App\Models\Utilisateur::where('id_user', '!=', $userId)
            ->where('statut', '!=', 'suspendu');

        // Filtrage selon les règles de rôles :
        // - Si l'utilisateur connecté est admin, il peut voir tous les utilisateurs.
        // - Si l'utilisateur connecté est étudiant, il peut voir tout le monde (étudiants, professeurs, locateurs, propriétaires, admins).
        // - Si l'utilisateur connecté est professeur, locateur ou propriétaire, il ne peut voir que les étudiants et les admins.
        if ($role !== 'admin' && $role !== 'etudiant') {
            $query->where(function ($q) {
                $q->where('role', 'etudiant')
                  ->orWhere('role', 'admin');
            });
        }

        // Si une recherche est spécifiée
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->limit(50)->get();

        return response()->json(\App\Http\Resources\UtilisateurResource::collection($users));
    }
}
