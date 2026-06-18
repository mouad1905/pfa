<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hebergement extends Model
{
    use HasFactory, SoftDeletes;

    // Nom de la table dans PostgreSQL
    protected $table = 'hebergement';

    // Clé primaire personnalisée
    protected $primaryKey = 'id_hebergement';

    protected $fillable = [
        'id_createur',
        'titre',
        'type',
        'type_chambre',
        'nbr_chambres',
        'max_capacity',
        'meuble',
        'superficie',
        'nb_locataires',
        'genre_colocataires',
        'students_only',
        'localisation',
        'description',
        'reglement',
        'image_principale',
        'images_galerie',
        'prix',
        'statut',
        'formule',
        'actif',
    ];

    protected $casts = [
        'prix'           => 'decimal:2',
        'meuble'         => 'boolean',
        'actif'          => 'boolean',
        'students_only'  => 'boolean',
        'images_galerie' => 'array',
    ];

    /**
     * Relation : Un hébergement appartient à un propriétaire (Utilisateur)
     */
    public function proprietaire()
    {
        return $this->belongsTo(Utilisateur::class, 'id_createur', 'id_user');
    }

    /**
     * Relation : Un hébergement peut avoir plusieurs réservations
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_hebergement', 'id_hebergement');
    }
}
