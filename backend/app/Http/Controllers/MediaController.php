<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    /**
     * Enregistre une URL média Cloudinary dans la base de données.
     *
     * POST /api/save-media
     * Body : { "url": "https://res.cloudinary.com/...", "userId": 123 }
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'url'    => ['required', 'url', 'max:2048'],
            'userId' => ['required', 'integer', 'exists:utilisateur,id_user'],
        ]);

        $media = Media::create([
            'user_id' => $validated['userId'],
            'url'     => $validated['url'],
        ]);

        return response()->json([
            'success' => true,
            'data'    => $media,
        ], 201);
    }
}
