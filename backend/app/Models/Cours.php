<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cours extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory, SoftDeletes;

    protected $table = 'cours';
    protected $primaryKey = 'id_cours';

    protected $fillable = [
        'id_professeur',
        'matiere',
        'prix',
        'type_prix',
        'niveau_etude',
        'description',
        'mode_enseignement',
        'statut',
    ];

    protected $casts = [
        'prix' => 'decimal:2',
    ];

    public function professeur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_professeur', 'id_user');
    }
}
