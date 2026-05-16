php artisan make:migration add_niveau_etude_to_utilisateur_table --table=utilisateur
php artisan make:model Cours -mc
php artisan make:policy HebergementPolicy --model=Hebergement
php artisan make:policy CoursPolicy --model=Cours
php artisan make:request Auth/RegisterRequest
php artisan make:request Auth/LoginRequest
php artisan make:request Hebergement/StoreHebergementRequest
php artisan make:request Cours/StoreCoursRequest
php artisan make:request Reservation/StoreReservationRequest
php artisan make:resource UtilisateurResource
php artisan make:resource HebergementResource
php artisan make:resource CoursResource
php artisan make:resource ReservationResource
php artisan make:factory UtilisateurFactory
php artisan make:factory HebergementFactory
php artisan make:factory CoursFactory
php artisan make:factory ReservationFactory
