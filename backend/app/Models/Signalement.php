<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signalement extends Model
{
    protected $table = 'signalement';
    protected $primaryKey = 'id_signalement';

    protected $fillable = [
        'id_auteur',
        'id_cible',
        'raison',
        'details',
        'statut'
    ];
    public function auteur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_auteur', 'id_user');
    }

    public function cible()
    {
        return $this->belongsTo(Utilisateur::class, 'id_cible', 'id_user');
    }
}
