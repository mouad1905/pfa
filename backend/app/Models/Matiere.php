<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    protected $table = 'matiere';
    protected $primaryKey = 'id_matiere';

    protected $fillable = [
        'nom',
    ];

    public $timestamps = true;
}
