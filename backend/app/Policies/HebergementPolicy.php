<?php

namespace App\Policies;

use App\Models\Hebergement;
use App\Models\Utilisateur;

class HebergementPolicy
{
    /**
     * Détermine si l'utilisateur peut mettre à jour l'hébergement.
     */
    public function update(Utilisateur $utilisateur, Hebergement $hebergement): bool
    {
        return $utilisateur->id_user === $hebergement->id_createur || $utilisateur->role === 'admin';
    }

    /**
     * Détermine si l'utilisateur peut supprimer l'hébergement.
     */
    public function delete(Utilisateur $utilisateur, Hebergement $hebergement): bool
    {
        return $utilisateur->id_user === $hebergement->id_createur || $utilisateur->role === 'admin';
    }
}
