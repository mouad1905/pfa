<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'media';

    protected $fillable = [
        'user_id',
        'url',
    ];

    /**
     * L'utilisateur propriétaire de ce média.
     */
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'user_id', 'id_user');
    }
}
