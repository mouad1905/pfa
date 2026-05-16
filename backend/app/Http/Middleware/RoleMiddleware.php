<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Laravel passe chaque rôle comme argument séparé (ex: role:proprietaire,admin)
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json(['message' => 'Accès refusé. Rôle insuffisant.'], 403);
        }

        return $next($request);
    }
}
