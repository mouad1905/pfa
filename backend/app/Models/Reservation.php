<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reservation';
    protected $primaryKey = 'id_reservation';

    protected $fillable = [
        'id_etudiant',
        'id_hebergement',
        'date_debut',
        'date_fin',
        'statut'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date'
    ];

    public function etudiant()
    {
        return $this->belongsTo(Utilisateur::class, 'id_etudiant', 'id_user');
    }

    public function hebergement()
    {
        return $this->belongsTo(Hebergement::class, 'id_hebergement', 'id_hebergement');
    }
}