# -------------------------
# Stage 1: Build (compile extensions + composer)
# -------------------------
FROM php:8.4.16-cli AS build

WORKDIR /var/www/html

# -------------------------
# Install system build dependencies
# -------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    curl \
    libssl-dev \
    zlib1g-dev \
    libpq-dev \
    libbrotli-dev \
    pkg-config \
    autoconf \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# -------------------------
# Install PHP core extensions
# -------------------------
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pcntl

# -------------------------
# Install Swoole (pinned 5.1.3 for PHP 8.4)
# -------------------------
RUN pecl install swoole \
    && docker-php-ext-enable swoole

# -------------------------
# Install Composer
# -------------------------
RUN curl -sS https://getcomposer.org/installer \
    | php -- --install-dir=/usr/local/bin --filename=composer

# -------------------------
# Copy full app before running composer
# This ensures 'artisan' exists for post-autoload-dump
# -------------------------
COPY . .

# -------------------------
# Install PHP dependencies
# -------------------------
RUN composer install --no-dev --optimize-autoloader --no-interaction

# -------------------------
# Stage 2: Production image
# -------------------------
FROM php:8.4.16-cli

WORKDIR /var/www/html

# -------------------------
# Install runtime dependencies
# -------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libzip-dev \
    brotli \
    && rm -rf /var/lib/apt/lists/*

# -------------------------
# Copy built app + vendor + extensions
# -------------------------
COPY --from=build /var/www/html /var/www/html
COPY --from=build /usr/local/lib/php/extensions /usr/local/lib/php/extensions
COPY --from=build /usr/local/etc/php/conf.d /usr/local/etc/php/conf.d

# -------------------------
# OPcache config (no need to enable Swoole again)
# -------------------------
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.enable_cli=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.preload=" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.jit_buffer_size=100M" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.jit=1235" >> /usr/local/etc/php/conf.d/opcache.ini

# -------------------------
# Permissions
# -------------------------
RUN chown -R www-data:www-data storage bootstrap/cache

# -------------------------
# Expose port
# -------------------------
EXPOSE 10000

# -------------------------
# Start Laravel Octane with Swoole
# -------------------------
CMD php artisan migrate --force && \
    php artisan db:seed --force && \
    php artisan octane:start --server=swoole --host=0.0.0.0 --port=10000
