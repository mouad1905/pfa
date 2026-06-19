<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Hebergement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'id_destinataire' => 'required|integer|exists:utilisateur,id_user',
            'id_hebergement'  => 'nullable|integer|exists:hebergement,id_hebergement',
            'sujet'           => 'nullable|string|max:200',
            'contenu'         => 'required|string|max:5000',
        ]);

        try {
            $message = Message::create([
                'id_expediteur'  => Auth::id(),
                'id_destinataire' => $request->id_destinataire,
                'id_hebergement'  => $request->id_hebergement,
                'sujet'           => $request->sujet,
                'contenu'         => $request->contenu,
                'statut'          => 'envoye',
            ]);

            $message->load('expediteur', 'hebergement');

            return response()->json([
                'message' => 'Message envoyé avec succès.',
                'data'    => $message,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function inbox()
    {
        $messages = Message::where('id_destinataire', Auth::id())
            ->with('expediteur', 'hebergement')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($messages);
    }

    public function sent()
    {
        $messages = Message::where('id_expediteur', Auth::id())
            ->with('destinataire', 'hebergement')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($messages);
    }

    public function markAsRead($id)
    {
        $message = Message::where('id_message', $id)
            ->where('id_destinataire', Auth::id())
            ->firstOrFail();

        $message->update(['statut' => 'lu']);

        return response()->json(['message' => 'Message marqué comme lu.']);
    }

    public function unreadCount()
    {
        $count = Message::where('id_destinataire', Auth::id())
            ->where('statut', 'envoye')
            ->count();

        return response()->json(['unread' => $count]);
    }
}
