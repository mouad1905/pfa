<?php

namespace App\Models;

// REMPLACE : use Illuminate\Database\Eloquent\Model;
// PAR :
use Illuminate\Foundation\Auth\User as Authenticatable; 
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Utilisateur extends Authenticatable // <--- DOIT ÉTENDRE Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory, SoftDeletes;

    protected $table = 'utilisateur';
    protected $primaryKey = 'id_user';

    protected $fillable = [
        'nom',
        'prenom',
        'date_naissance',
        'cin',
        'email',
        'telephone',
        'mot_de_passe',
        'role',
        'niveau_etude',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    /**
     * Spécifie le nom de la colonne du mot de passe pour Laravel Auth
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }
}