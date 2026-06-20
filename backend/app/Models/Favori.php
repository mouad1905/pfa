<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favori extends Model
{
    protected $table = 'favoris';
    public $timestamps = false;

    protected $fillable = [
        'id_user',
        'id_hebergement',
    ];

    public function user()
    {
        return $this->belongsTo(Utilisateur::class, 'id_user', 'id_user');
    }

    public function hebergement()
    {
        return $this->belongsTo(Hebergement::class, 'id_hebergement', 'id_hebergement');
    }
}
