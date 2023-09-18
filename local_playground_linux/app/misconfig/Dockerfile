# Use the official PHP image with Apache
FROM php:8.0-apache

# Copy the index.php file into the container
COPY index.php /var/www/html/index.php

# Set the working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80

# Add a sensitive file and set weak permissions
COPY sensitive.txt /var/www/html/sensitive.txt
RUN chmod 777 /var/www/html/sensitive.txt

# Create a custom user "mirage"
RUN useradd -m -s /bin/bash mirage

# Set a weak password for the user "mirage"
RUN echo 'mirage:password123' | chpasswd

# # Add security headers to Apache configuration
# RUN echo "Header always set X-Content-Type-Options nosniff" >> /etc/apache2/apache2.conf
# RUN echo "Header always set X-Frame-Options SAMEORIGIN" >> /etc/apache2/apache2.conf
# RUN echo "Header always set X-XSS-Protection \"1; mode=block\"" >> /etc/apache2/apache2.conf

# Start the Apache server
CMD ["apache2ctl", "-D", "FOREGROUND"]
