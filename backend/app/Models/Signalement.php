<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Signalement extends Model
{
    use SoftDeletes;

    protected $table = 'signalement';
    protected $primaryKey = 'id_signalement';

    protected $fillable = [
        'id_auteur',
        'id_cible',
        'id_hebergement',
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

    public function hebergement()
    {
        return $this->belongsTo(Hebergement::class, 'id_hebergement', 'id_hebergement');
    }
}
