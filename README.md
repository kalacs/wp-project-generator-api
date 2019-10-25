# Wordpress project configurator

## Features:

- [x] install basic WP from zero
- [ ] install WP with plugins
- [ ] create DEV workflow
- [ ] create deployment to staging environment
- [ ] create deployment to production environment
- [ ] simplify usage of this template, create predefined commands

### Create new WP

`cd wp-flash-api && npm i && npm run dev`
```
curl http://127.0.0.1:3000/wordpress -X POST -d '{"project":{"prefix":"kalacs","path":"","database":{"name":"kalacs","user":"kalacs","password":"kalacs","root_password":"test"},"webserver":{"port":9999}}}' -H 'Content-type: application/json'
```

### Fix url

```
docker run -it --rm \                                        
    --volumes-from wordpress \
    --network wordpress_app-network \
    wordpress:cli search-replace 'webserver' '0.0.0.0' --skip-columns=guid
```

