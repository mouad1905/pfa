<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $table = 'evaluation';
    protected $primaryKey = 'id_evaluation';
    
    // Ta migration n'a pas de timestamps() classiques (created_at/updated_at)
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
        'note' => 'integer'
    ];
}