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
        'statut',
        'niveau_etude',
        'photo_profil',
        'document_identite',
        'certificat',
        'carte_etudiant',
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    /**
     * Spécifie le nom de la colonne du mot de passe pour Laravel Auth
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    /**
     * Spécifie le nom de la colonne identifiant pour Laravel Auth / Sanctum
     */
    public function getAuthIdentifierName(): string
    {
        return 'id_user';
    }
}