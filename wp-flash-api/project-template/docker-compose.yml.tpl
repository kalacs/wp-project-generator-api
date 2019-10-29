version: '3'

services:
  {{project.prefix}}-db:
    image: mariadb:latest
    restart: unless-stopped
    container_name: {{project.prefix}}-db
    environment:
      - MYSQL_DATABASE={{project.database.name}}
      - MYSQL_ROOT_PASSWORD={{project.database.root_password}}
      - MYSQL_USER={{project.database.user}}
      - MYSQL_PASSWORD={{project.database.password}}
    command: '--default-authentication-plugin=mysql_native_password'
    networks:
      - {{project.prefix}}-network
    labels:
      - "com.wp-manager.project.name=test"

  {{project.prefix}}-wordpress:
    depends_on: 
      - {{project.prefix}}-db
    image: wordpress:5.1.1-fpm-alpine
    restart: unless-stopped
    container_name: {{project.prefix}}-wordpress
    environment:
      - WORDPRESS_DB_HOST={{project.prefix}}-db:3306
      - WORDPRESS_DB_USER={{project.database.user}}
      - WORDPRESS_DB_PASSWORD={{project.database.password}}
      - WORDPRESS_DB_NAME={{project.database.name}}
    volumes:
      - {{project.prefix}}-wordpress:/var/www/html
    networks:
      - {{project.prefix}}-network
    labels:
      - "com.wp-manager.project.name=test"

  {{project.prefix}}-webserver:
    depends_on:
      - {{project.prefix}}-wordpress
    image: nginx:1.15.12-alpine
    restart: unless-stopped
    container_name: {{project.prefix}}-webserver
    ports:
      - "{{project.webserver.port}}:80"
    volumes:
      - {{project.prefix}}-wordpress:/var/www/html
      - './services/webserver/nginx/nginx-conf:/etc/nginx/conf.d'
    networks:
      - {{project.prefix}}-network
    labels:
      - "com.wp-manager.project.name=test"

volumes:
  {{project.prefix}}-wordpress:
     driver_opts:
           type: none
           device: '{{project.path}}/services/wordpress'
           o: bind
networks:
  {{project.prefix}}-network:
    driver: bridge
