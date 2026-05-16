<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $table = 'paiement';
    protected $primaryKey = 'id_paiement';
    public $timestamps = false; // Utilise date_paiement à la place

    protected $fillable = [
        'id_user',
        'type',
        'id_reference',
        'montant',
        'date_paiement',
        'statut'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_paiement' => 'datetime'
    ];
}