<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class CloudinaryService
{
    protected ?Cloudinary $cloudinary = null;

    public function __construct()
    {
        // Ne fait rien à l'instanciation pour éviter de lever des exceptions 
        // si les clés Cloudinary ne sont pas encore configurées dans le .env
    }

    /**
     * Obtenir ou initialiser l'instance de Cloudinary à la demande (lazy-loading).
     */
    protected function getCloudinary(): Cloudinary
    {
        if ($this->cloudinary === null) {
            $cloudName = config('cloudinary.cloud_name');
            $apiKey = config('cloudinary.api_key');
            $apiSecret = config('cloudinary.api_secret');

            if (!$cloudName || !$apiKey || !$apiSecret) {
                throw new \Exception("Configuration Cloudinary manquante ou invalide. Veuillez ajouter CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans votre fichier .env");
            }

            $this->cloudinary = new Cloudinary(
                Configuration::instance([
                    'cloud' => [
                        'cloud_name' => $cloudName,
                        'api_key'    => $apiKey,
                        'api_secret' => $apiSecret,
                    ],
                    'url' => [
                        'secure' => true,
                    ],
                ])
            );
        }

        return $this->cloudinary;
    }

    /**
     * Upload un fichier vers Cloudinary et retourne l'URL sécurisée.
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @param  string  $folder  Dossier dans Cloudinary (ex: "uniconnect/photos")
     * @return string  URL publique de l'image
     */
    public function upload($file, string $folder = 'uniconnect'): string
    {
        $result = $this->getCloudinary()->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder'         => $folder,
                'resource_type'  => 'auto',
                'use_filename'   => true,
                'unique_filename'=> true,
            ]
        );

        return $result['secure_url'];
    }

    /**
     * Supprime une ressource Cloudinary via son URL publique.
     *
     * @param  string|null  $url  URL Cloudinary de la ressource
     */
    public function delete(?string $url): void
    {
        if (!$url) return;

        // Extraire le public_id depuis l'URL Cloudinary
        // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v.../folder/filename.ext
        $pattern = '/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i';
        if (preg_match($pattern, $url, $matches)) {
            $publicId = $matches[1];
            $this->getCloudinary()->uploadApi()->destroy($publicId);
        }
    }
}

