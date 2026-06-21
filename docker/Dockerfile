FROM wordpress:php8.3-apache

# wp-cli for idempotent install/config on container start
RUN curl -o /usr/local/bin/wp -L https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x /usr/local/bin/wp

# Reasonable upload/memory limits for media-heavy theme + WooCommerce
RUN { \
        echo 'upload_max_filesize = 64M'; \
        echo 'post_max_size = 64M'; \
        echo 'memory_limit = 256M'; \
        echo 'max_execution_time = 120'; \
    } > /usr/local/etc/php/conf.d/promptwerker-uploads.ini

COPY ../wp-theme/promptwerker /usr/src/wordpress/wp-content/themes/promptwerker
COPY docker/entrypoint.sh /usr/local/bin/promptwerker-entrypoint.sh
RUN chmod +x /usr/local/bin/promptwerker-entrypoint.sh

ENTRYPOINT ["promptwerker-entrypoint.sh"]
CMD ["apache2-foreground"]
