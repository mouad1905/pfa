<?php

namespace App\Http\Controllers;

use App\Models\Favori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriController extends Controller
{
    public function index()
    {
        $ids = Favori::where('id_user', Auth::id())
            ->pluck('id_hebergement')
            ->toArray();

        return response()->json($ids);
    }

    public function toggle($hebergementId)
    {
        $existing = Favori::where('id_user', Auth::id())
            ->where('id_hebergement', $hebergementId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['favori' => false]);
        }

        Favori::create([
            'id_user' => Auth::id(),
            'id_hebergement' => $hebergementId,
        ]);

        return response()->json(['favori' => true]);
    }
}
