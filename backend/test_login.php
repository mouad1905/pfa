<?php
// Test script - run with: php test_login.php
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$app->boot();

use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;

echo "=== Test Login Debug ===\n\n";

// Test avec l'admin
$email = 'admin@uniconnect.com';
$password = 'password';

$user = Utilisateur::where('email', $email)->first();

if (!$user) {
    echo "❌ User NOT found for email: $email\n";
    echo "   Users in DB:\n";
    $users = Utilisateur::all(['email', 'role', 'statut']);
    foreach ($users as $u) {
        echo "   - {$u->email} ({$u->role}) statut={$u->statut}\n";
    }
} else {
    echo "✅ User found: {$user->email}\n";
    echo "   Role: {$user->role}\n";
    echo "   Statut: {$user->statut}\n";
    echo "   Hash check (password): " . (Hash::check($password, $user->mot_de_passe) ? '✅ OK' : '❌ FAIL') . "\n";
    echo "   mot_de_passe column: " . substr($user->mot_de_passe, 0, 20) . "...\n";
}
