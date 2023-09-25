FROM php:7.4.3-apache

COPY php.ini /usr/local/etc/php/conf.d/docker-php-expect.ini
RUN chown -R www-data:www-data /usr/local/etc/php/conf.d/docker-php-expect.ini
RUN apt-get update \
        && apt-get install -y tcl-dev tcl-expect-dev \
        && mkdir -p /tmp/pear/cache \
        && pecl install expect \
        && service apache2 restart

COPY ./src/index.php app/index.php
COPY ./src/upload.php app/upload.php
COPY ./src/vhost.conf /etc/apache2/sites-available/000-default.conf

RUN mkdir -p app/uploads
RUN chown -R www-data:www-data app && a2enmod rewrite
