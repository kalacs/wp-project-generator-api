# Wordpress project configurator

## Features:

- [x] install basic WP from zero
- [ ] install WP with plugins
- [ ] create DEV workflow
- [ ] create deployment to staging environment
- [ ] create deployment to production environment
- [ ] simplify usage of this template, create predefined commands

### Create new WP Project

`cd wp-flash-api && npm i && npm run dev`
```
curl http://127.0.0.1:3000/wordpress-project -X POST -d '{"project":{"prefix":"kalacs","path":"","database":{"name":"kalacs","user":"kalacs","password":"kalacs","root_password":"test"},"webserver":{"port":9999}}}' -H 'Content-type: application/json'
```

### Build project services

```
curl -i 'http://127.0.0.1:3000/wordpress-project/test/services' -X POST -H 'wp-manager-project-path: /home/evista/localSites'
```

### Check project services statuses

```
curl -i 'http://127.0.0.1:3000/wordpress-project/services/test' -H 'wp-manager-project-path: /home/evista/localSites'
```

### Destroy project services

```
curl -i 'http://127.0.0.1:3000/wordpress-project/services/test' -X DELETE -H 'wp-manager-project-path: /home/evista/localSites'
```

### Install wordpress

```
curl 'http://127.0.0.1:3000/wordpress-project/test/services/wordpress' -d '{"volume":"test-wordpress","network":"test_test-app-network","url":"0.0.0.0:8888","title":"Test SITE","adminName":"kalacs","adminPassword":"kalacs","adminEmail":"kalacs@s.com"}' -H 'Content-type: application/json' -H 'wp-manager-project-path: /home/evista/localSites'
```

### Fix url

```
docker run -it --rm \                                        
    --volumes-from wordpress \
    --network wordpress_app-network \
    wordpress:cli search-replace 'webserver' '0.0.0.0' --skip-columns=guid
```

