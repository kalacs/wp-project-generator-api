# Wordpress project template

## Scenarios

### Create new WP

* Copy `.example.env` to `.env` and set variables
* Start docker stack: `docker-compose -p wordpress -f docker/docker-compose.yml up -d`
* Check `http://0.0.0.0` in browser
* `cd docker/services/crawler/browserless && npm i && node test.js`
* Run this command in another terminal: `curl http://localhost:8080/image > wp_install_screen.jpg` and check the downloaded image
* In order to fix url issue run this:
```
docker run -it --rm \                                        
    --volumes-from wordpress \
    --network wordpress_app-network \
    wordpress:cli search-replace 'webserver' '0.0.0.0' --skip-columns=guid
```

## Features:

- [x] install basic WP from zero
- [ ] install WP with plugins
- [ ] create DEV workflow
- [ ] create deployment to staging environment
- [ ] create deployment to production environment
- [ ] simplify usage of this template, create predefined commands