<?php

use Illuminate\Support\Facades\DB;

DB::statement("SELECT setval('cours_id_cours_seq', (SELECT COALESCE(MAX(id_cours), 1) FROM cours));");
echo "Cours sequence fixed.\n";
