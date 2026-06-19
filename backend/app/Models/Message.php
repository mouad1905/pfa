<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    /**
     * Le nom exact de la table en base de données.
     * Laravel met les noms de tables au pluriel par défaut,
     * donc on force ici le nom singulier "message".
     */
    protected $table = 'message';

    /**
     * La clé primaire de la table.
     * Laravel suppose par défaut que la PK s'appelle "id".
     * On surcharge ici pour utiliser "id_message".
     */
    protected $primaryKey = 'id_message';

    /**
     * La PK est un entier auto-incrémenté.
     */
    public $incrementing = true;

    /**
     * Le type de la clé primaire.
     */
    protected $keyType = 'int';

    protected $fillable = [
        'id_conversation',
        'id_expediteur',
        'id_destinataire',
        'id_hebergement',
        'sujet',
        'contenu',
        'statut',
    ];

    protected $casts = [
        'statut' => 'string',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'id_conversation', 'id_conversation');
    }

    public function expediteur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_expediteur', 'id_user');
    }

    public function destinataire()
    {
        return $this->belongsTo(Utilisateur::class, 'id_destinataire', 'id_user');
    }

    public function hebergement()
    {
        return $this->belongsTo(Hebergement::class, 'id_hebergement', 'id_hebergement');
    }
}
