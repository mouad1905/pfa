<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HebergementEvaluation extends Model
{
    protected $table = 'hebergement_evaluation';
    protected $primaryKey = 'id_evaluation';
    public $timestamps = false;

    protected $fillable = [
        'id_hebergement',
        'id_auteur',
        'note',
        'commentaire',
        'date_evaluation',
    ];

    protected $casts = [
        'date_evaluation' => 'datetime',
        'note'            => 'integer',
    ];

    public function auteur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_auteur', 'id_user');
    }

    public function hebergement()
    {
        return $this->belongsTo(Hebergement::class, 'id_hebergement', 'id_hebergement');
    }
}
