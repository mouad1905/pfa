<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    /**
     * Nom exact de la table (singulier, non pluralisé).
     */
    protected $table = 'conversation';

    /**
     * Clé primaire personnalisée.
     */
    protected $primaryKey = 'id_conversation';

    /**
     * La PK est un entier auto-incrémenté.
     */
    public $incrementing = true;

    /**
     * Le type de la clé primaire.
     */
    protected $keyType = 'int';

    protected $fillable = [];

    /**
     * Les participants à la conversation.
     */
    public function participants()
    {
        return $this->belongsToMany(Utilisateur::class, 'conversation_participant', 'id_conversation', 'id_user')
            ->withTimestamps();
    }

    /**
     * Tous les messages de la conversation.
     */
    public function messages()
    {
        return $this->hasMany(Message::class, 'id_conversation', 'id_conversation');
    }

    /**
     * Le dernier message de la conversation.
     *
     * NOTE: Laravel's latestOfMany() / ofMany() always builds its sub-query using the
     * model's default primary key column name "id", ignoring any custom $primaryKey.
     * Since our table uses "id_message" (not "id"), latestOfMany() generates:
     *   min("message"."id") — which fails with SQLSTATE[HY000] no such column: message.id
     *
     * Fix: use ofMany() with an explicit aggregate on 'id_message',
     * which is the stable and recommended approach for custom PKs.
     */
    public function dernierMessage()
    {
        return $this->hasOne(Message::class, 'id_conversation', 'id_conversation')
            ->ofMany('id_message', 'max');
    }
}
