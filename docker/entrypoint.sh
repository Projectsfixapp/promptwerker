#!/bin/bash
set -euo pipefail

# First pass: let the official WP entrypoint write wp-config.php / copy core
# files, then exit immediately (it execs "$@", so we hand it a no-op).
docker-entrypoint.sh true

if ! wp core is-installed --allow-root --path=/var/www/html; then
  wp core install \
    --allow-root --path=/var/www/html \
    --url="${WORDPRESS_URL:?WORDPRESS_URL not set}" \
    --title="${WORDPRESS_TITLE:-promptwerker}" \
    --admin_user="${WORDPRESS_ADMIN_USER:?WORDPRESS_ADMIN_USER not set}" \
    --admin_password="${WORDPRESS_ADMIN_PASSWORD:?WORDPRESS_ADMIN_PASSWORD not set}" \
    --admin_email="${WORDPRESS_ADMIN_EMAIL:?WORDPRESS_ADMIN_EMAIL not set}" \
    --skip-email
fi

wp theme activate promptwerker --allow-root --path=/var/www/html || true
wp rewrite structure '/%postname%/' --allow-root --path=/var/www/html || true

# Second pass: actually launch the real CMD (apache2-foreground)
exec docker-entrypoint.sh "$@"
