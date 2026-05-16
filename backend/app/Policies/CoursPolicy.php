<?php

namespace App\Policies;

use App\Models\Cours;
use App\Models\Utilisateur;

class CoursPolicy
{
    /**
     * Détermine si l'utilisateur peut mettre à jour le cours.
     */
    public function update(Utilisateur $utilisateur, Cours $cours): bool
    {
        return $utilisateur->id_user === $cours->id_professeur || $utilisateur->role === 'admin';
    }

    /**
     * Détermine si l'utilisateur peut supprimer le cours.
     */
    public function delete(Utilisateur $utilisateur, Cours $cours): bool
    {
        return $utilisateur->id_user === $cours->id_professeur || $utilisateur->role === 'admin';
    }
}
