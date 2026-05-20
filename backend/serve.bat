@echo off
cd /d "%~dp0"
echo Demarrage Laravel avec php.ini du projet (uploads 64M)...
php -c php.ini artisan serve %*
