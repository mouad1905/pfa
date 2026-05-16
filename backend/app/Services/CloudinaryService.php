<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class CloudinaryService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary(
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => config('cloudinary.cloud_name'),
                    'api_key'    => config('cloudinary.api_key'),
                    'api_secret' => config('cloudinary.api_secret'),
                ],
                'url' => [
                    'secure' => true,
                ],
            ])
        );
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
        $result = $this->cloudinary->uploadApi()->upload(
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
            $this->cloudinary->uploadApi()->destroy($publicId);
        }
    }
}
