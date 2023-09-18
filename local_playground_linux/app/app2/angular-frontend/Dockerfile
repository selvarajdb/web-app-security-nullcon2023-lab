# Use an official Apache HTTP Server image as the base image
FROM httpd:2.4

# Copy your custom configuration file (if needed)
# COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf

# Copy the contents of the 'dist' folder into the webroot
COPY ./dist/angular8-springboot-client/ /usr/local/apache2/htdocs/

# (Optional) Expose a port (e.g., 80) for HTTP traffic
EXPOSE 80

