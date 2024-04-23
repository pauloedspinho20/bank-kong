#!/usr/bin/env sh

set -e

mysql_ready='nc -z db-headless 3306'

if ! $mysql_ready
then
    printf 'Waiting for MySQL.'
    while ! $mysql_ready
    do
        printf '.'
        sleep 1
    done
    echo
fi

if wp core is-installed
then
    echo "WordPress is already installed, exiting."
    exit
fi

wp core download --force

[ -f wp-config.php ] || wp config create \
    --dbhost="$WORDPRESS_DB_HOST" \
    --dbname="$WORDPRESS_DB_NAME" \
    --dbuser="$WORDPRESS_DB_USER" \
    --dbpass="$WORDPRESS_DB_PASSWORD"

wp config set JWT_AUTH_SECRET_KEY '/{h<A`(p)<5^Gi!&B$Kd2yi-LEv464B3{J<$~vQS-@-Z_c-+R4[)j+W,dROVjdr:'
wp config set GRAPHQL_JWT_AUTH_SECRET_KEY '/{h<A`(p)<5^Gi!&B$Kd2yi-LEv464B3{J<$~vQS-@-Z_c-+R4[)j+W,dROVjdr:'

wp core install \
    --url="$WORDPRESS_URL" \
    --title="$WORDPRESS_TITLE" \
    --admin_user="$WORDPRESS_ADMIN_USER" \
    --admin_password="$WORDPRESS_ADMIN_PASSWORD" \
    --admin_email="$WORDPRESS_ADMIN_EMAIL" \
    --skip-email

wp option update blogdescription "$WORDPRESS_DESCRIPTION"
wp rewrite structure "$WORDPRESS_PERMALINK_STRUCTURE"

wp theme activate twentytwentyfour
wp theme delete twentytwenty twentytwentyone twentytwentytwo

wp plugin delete akismet hello
wp plugin install --activate --force \
    acf-to-wp-api \
    advanced-custom-fields \
    custom-post-type-ui \
    wp-rest-api-v2-menus \
    jwt-authentication-for-wp-rest-api \
    wp-graphql \
    all-in-one-wp-migration \
    https://github.com/wp-graphql/wp-graphql-jwt-authentication/archive/refs/tags/v0.7.0.zip \
    https://github.com/wp-graphql/wp-graphql-acf/archive/master.zip \
    /var/www/plugins/*.zip

wp term update category 1 --name="Sample Category"
wp post delete 1 2

wp import /var/www/backup.sql --skip=attachment

wp media import /var/www/images/article1.jpg --featured_image \
  --post_id=$(wp post list --field=ID --name=exploring-the-intersection-of-web3-and-gaming)
wp media import /var/www/images/article2.jpg --featured_image \
  --post_id=$(wp post list --field=ID --name=building-user-friendly-web-applications-with-next-js)
wp media import /var/www/images/article3.jpg --featured_image \
  --post_id=$(wp post list --field=ID --name=navigating-the-world-of-web3)
wp media import /var/www/images/article4.jpg --featured_image \
  --post_id=$(wp post list --field=ID --name=crafting-cutting-edge-web-experiences)
wp media import /var/www/images/article5.jpg --featured_image \
  --post_id=$(wp post list --field=ID --name=collaborating-with-confidence-partnering-with-paulo-pinho)
wp media import /var/www/images/article6.jpg --featured_image \
  --post_id=$(wp post list --field=ID --name=mastering-modern-ui-design-with-tailwind-css-and-shadcn-ui)
wp media import /var/www/images/article7.jpg --featured_image \
  --post_id=$(wp post list --field=ID --name=building-secure-authentication-systems-with-nextauth-js-zustand-and-three-js)
wp media import /var/www/images/article8.jpg --featured_image \
  --post_id=$(wp post list --field=ID --name=empowering-content-management-with-wordpress-acf-custom-post-types-and-rest-and-graphql-api)

echo "Great. You can now log into WordPress at: $WORDPRESS_URL/wp-admin ($WORDPRESS_ADMIN_USER/$WORDPRESS_ADMIN_PASSWORD)"