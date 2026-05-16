<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $table = 'evaluation';
    protected $primaryKey = 'id_evaluation';

    // La migration n'utilise pas timestamps() classiques (created_at/updated_at)
    // mais utilise date_evaluation. On désactive les timestamps par défaut.
    public $timestamps = false;

    protected $fillable = [
        'id_auteur',
        'id_cible',
        'note',
        'commentaire',
        'date_evaluation'
    ];

    protected $casts = [
        'date_evaluation' => 'datetime',
        'note'            => 'integer',
    ];

    /**
     * L'utilisateur qui a soumis l'évaluation
     */
    public function auteur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_auteur', 'id_user');
    }

    /**
     * L'utilisateur qui est évalué
     */
    public function cible()
    {
        return $this->belongsTo(Utilisateur::class, 'id_cible', 'id_user');
    }
}