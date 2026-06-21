<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notification';
    protected $primaryKey = 'id_notification';

    protected $fillable = [
        'id_user',
        'type',
        'message',
        'id_conversation',
        'id_reservation',
        'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(Utilisateur::class, 'id_user', 'id_user');
    }
}
