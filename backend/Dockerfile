FROM php:8.2-apache

RUN a2enmod rewrite

COPY . /var/www/html/

RUN echo "DirectoryIndex index.php index.html" > /etc/apache2/conf-available/directory-index.conf && \
    a2enconf directory-index && \
    sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/Options Indexes FollowSymLinks/Options FollowSymLinks/' /etc/apache2/apache2.conf

RUN chown -R www-data:www-data /var/www/html && \
    find /var/www/html -type d -exec chmod 755 {} \; && \
    find /var/www/html -type f -exec chmod 644 {} \;

EXPOSE 80