<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\AuthController;
use App\Models\Hebergement;

Route::post('/register', [AuthController::class, 'register']);


Route::get('/hebergements', function() {
    return Hebergement::all();
});
Route::post('/test-inscription', function (Request $request) {
    try {
        // Insertion directe en base pour tester la connexion
        DB::table('utilisateur')->insert([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'cin' => $request->cin,
            'email' => $request->email,
            'mot_de_passe' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json(['status' => 'Succès', 'message' => 'Utilisateur ajouté dans PostgreSQL !'], 201);
    } catch (\Exception $e) {
        return response()->json(['status' => 'Erreur', 'message' => $e->getMessage()], 500);
    }
});

Route::get('/run-migrations', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh --seed');
        $output = \Illuminate\Support\Facades\Artisan::output();
        return response()->json([
            'status' => 'success',
            'message' => 'Migrations and seeders ran successfully!',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::get('/', function () {
    return view('welcome');
});
