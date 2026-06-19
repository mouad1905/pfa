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
            $cloudinaryUrl = config('cloudinary.url');
            $cloudName = config('cloudinary.cloud_name');
            $apiKey = config('cloudinary.api_key');
            $apiSecret = config('cloudinary.api_secret');

            // Liste de valeurs par défaut/placeholders à rejeter
            $placeholders = [
                'votre_cloud_name',
                'votre_api_key',
                'votre_api_secret',
            ];

            $hasUrl = !empty($cloudinaryUrl) && 
                      !str_contains($cloudinaryUrl, 'votre_') && 
                      !str_contains($cloudinaryUrl, 'api_key:api_secret');
            
            $hasCredentials = !empty($cloudName) && !empty($apiKey) && !empty($apiSecret) &&
                              !in_array($cloudName, $placeholders) &&
                              !in_array($apiKey, $placeholders) &&
                              !in_array($apiSecret, $placeholders);

            if (!$hasUrl && !$hasCredentials) {
                throw new \Exception("Configuration Cloudinary manquante ou invalide. Veuillez ajouter des identifiants réels (soit CLOUDINARY_URL, soit CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET) dans votre fichier .env");
            }

            if ($hasUrl) {
                $this->cloudinary = new Cloudinary($cloudinaryUrl);
            } else {
                $this->cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => $cloudName,
                        'api_key'    => $apiKey,
                        'api_secret' => $apiSecret,
                    ],
                    'url' => [
                        'secure' => true,
                    ],
                ]);
            }
        }

        return $this->cloudinary;
    }

    /**
     * Upload un fichier vers Cloudinary et retourne l'URL sécurisée.
     * En cas d'absence de configuration Cloudinary ou d'erreur, effectue un repli automatique sur le stockage local public.
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @param  string  $folder  Dossier de stockage (ex: "uniconnect/photos")
     * @return string  URL publique d'accès au fichier
     */
    public function upload($file, string $folder = 'uniconnect'): string
    {
        try {
            $cloudinary = $this->getCloudinary();
            
            // Extraire le nom d'origine et l'extension
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            
            // Sécuriser le nom (enlever espaces et caractères spéciaux)
            $safeName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $originalName);
            
            // Créer un identifiant unique basé sur le nom d'origine
            $publicId = $safeName . '_' . uniqid();

            // Si ce n'est pas une image, on ajoute l'extension pour forcer Cloudinary
            // à garder le bon format (.pdf, .docx, etc) au lieu d'un format sans extension
            if (!in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
                $publicId .= '.' . $extension;
            }

            $result = $cloudinary->uploadApi()->upload(
                $file->getRealPath(),
                [
                    'folder'         => $folder,
                    'resource_type'  => 'auto',
                    'public_id'      => $publicId,
                ]
            );

            return $result['secure_url'];

        } catch (\Exception $e) {
            // Log de l'avertissement et repli sur le stockage local public
            \Illuminate\Support\Facades\Log::warning("Cloudinary inactif ou non configuré : " . $e->getMessage() . ". Repli sur le stockage local.");
            
            // Nettoyage du dossier pour le stockage local (on enlève 'uniconnect/')
            $localFolder = str_replace('uniconnect/', '', $folder);
            $localPath = 'uploads/' . $localFolder;
            
            // Stockage local
            $storedPath = $file->store($localPath, 'public');
            
            // Retourne l'URL locale absolue
            return asset('storage/' . $storedPath);
        }
    }

    /**
     * Supprime une ressource via son URL publique (Cloudinary ou stockage local).
     *
     * @param  string|null  $url  URL publique de la ressource
     */
    public function delete(?string $url): void
    {
        if (!$url) return;

        // Si c'est une URL locale de repli
        if (str_contains($url, '/storage/uploads/')) {
            $path = str_replace(asset('storage/'), '', $url);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
            return;
        }

        // Sinon, suppression sur Cloudinary
        try {
            $cloudinary = $this->getCloudinary();
            $pattern = '/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i';
            if (preg_match($pattern, $url, $matches)) {
                $publicId = $matches[1];
                $cloudinary->uploadApi()->destroy($publicId);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Impossible de supprimer le fichier Cloudinary : " . $e->getMessage());
        }
    }
}

