<?php

$totalWorkers = 50;
$startFrom = 21; // Уже есть queue-1 до queue-20

$template = "
    queue-{N}:
        build:
            context: './vendor/laravel/sail/runtimes/8.4'
            dockerfile: Dockerfile
            args:
                WWWGROUP: '\${WWWGROUP}'
        image: 'sail-8.4/app'
        extra_hosts:
            - 'host.docker.internal:host-gateway'
        environment:
            WWWUSER: '\${WWWUSER}'
            LARAVEL_SAIL: 1
        volumes:
            - '.:/var/www/html'
        networks:
            - sail
        depends_on:
            - pgsql
            - redis
            - laravel.test
        command: php artisan queue:work redis --queue=task-assignment --tries=1 --timeout=30 --sleep=0 --max-jobs=5000 --memory=512
";

echo "# Скопируйте это в compose.yaml после queue-20:\n\n";

for ($i = $startFrom; $i <= $totalWorkers; $i++) {
    echo str_replace('{N}', $i, $template);
}
