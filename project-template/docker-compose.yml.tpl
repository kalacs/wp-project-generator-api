version: '3.5'

services:
  {{project.prefix}}-db:
    image: mariadb:latest
    restart: unless-stopped
    container_name: {{project.prefix}}-db
    environment:
      - MYSQL_DATABASE={{project.database.name}}
      - MYSQL_ROOT_PASSWORD={{project.database.rootPassword}}
      - MYSQL_USER={{project.database.user}}
      - MYSQL_PASSWORD={{project.database.password}}
    command: '--default-authentication-plugin=mysql_native_password'
    networks:
      - {{project.prefix}}-network
    labels:
      - "com.wp-manager.project.name={{project.prefix}}"
      - "com.wp-manager.service.db=true"
      - traefik.enable=false
  
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
      - "com.wp-manager.project.name={{project.prefix}}"
      - "com.wp-manager.service.wordpress=true"
      - traefik.enable=false

  {{project.prefix}}-webserver:
    depends_on:
      - {{project.prefix}}-wordpress
    image: nginx:1.15.12-alpine
    restart: unless-stopped
    container_name: {{project.prefix}}-webserver
    ports:
      - "80"
    volumes:
      - {{project.prefix}}-wordpress:/var/www/html
      - './services/webserver/nginx/nginx-conf:/etc/nginx/conf.d'
    networks:
      - {{project.prefix}}-network
      - proxy-web
    labels:
      - "com.wp-manager.project.name={{project.prefix}}"
      - "com.wp-manager.service.webserver=true"
      - traefik.backend={{project.prefix}}
      - traefik.frontend.rule=Host:{{project.prefix}}.localhost
      - traefik.docker.network=proxy-web
      - traefik.port=80

volumes:
  {{project.prefix}}-wordpress:
    name: {{project.prefix}}-wordpress
    driver_opts:
      type: none
      device: '{{project.path}}/services/wordpress'
      o: bind
    labels:
      - "com.wp-manager.project.name={{project.prefix}}"
      - "com.wp-manager.sercvice.wordpress=true"

networks:
  {{project.prefix}}-network:
    name: {{project.prefix}}-wp-network
    driver: bridge
  proxy-web:
    external: true
