<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    | Clés récupérées depuis votre dashboard Cloudinary :
    | https://console.cloudinary.com/
    |
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key'    => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'url'        => env('CLOUDINARY_URL'),

    /*
    |--------------------------------------------------------------------------
    | Dossiers de stockage par type de fichier
    |--------------------------------------------------------------------------
    */
    'folders' => [
        'profils'      => 'uniconnect/profils',
        'documents'    => 'uniconnect/documents',
        'certificats'  => 'uniconnect/certificats',
        'cartes'       => 'uniconnect/cartes',
        'hebergements' => 'uniconnect/hebergements',
        'cours'        => 'uniconnect/cours',
    ],
];
