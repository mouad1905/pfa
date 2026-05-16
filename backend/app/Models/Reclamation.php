<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reclamation extends Model
{
    use HasFactory;

    // Nom de la table dans PostgreSQL
    protected $table = 'reclamation';

    // Clé primaire
    protected $primaryKey = 'id_reclamation';

    // Laravel gère les colonnes created_at et updated_at
    public $timestamps = true;

    // Champs que l'on peut remplir via $request->all() ou Postman
    protected $fillable = [
        'id_auteur',
        'type_cible',
        'id_cible',
        'sujet',
        'description',
        'date_reclamation',
        'statut',
        'piece_jointe'
    ];

    // Conversion automatique des dates pour PostgreSQL
    protected $casts = [
        'date_reclamation' => 'datetime',
    ];

    /**
     * Relation : Permet de récupérer l'utilisateur qui a créé la réclamation
     */
    public function auteur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_auteur', 'id_user');
    }
}