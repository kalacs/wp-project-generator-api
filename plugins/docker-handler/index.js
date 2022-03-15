'use strict'

const fp = require('fastify-plugin')
const makeReverseProxy = require('./utils/reverse-proxy');
const path = require('path');
const NETWORK_NAME = 'proxy-web';
const REVERSE_PROXY_CONTAINER_NAME = 'reverse-proxy';
const LABEL = 'traefik.docker.network';
const LABEL_VALUE = 'proxy-web';
const IMAGE = 'traefik:1.7.6-alpine';

const reverseProxy = makeReverseProxy({
    containerOptions: {
        name: REVERSE_PROXY_CONTAINER_NAME,
        Image: IMAGE,
        HostConfig: {
          AutoRemove: true,
          PortBindings: { '80/tcp': [{ HostPort: '80' }] },
          Binds: [
            '/var/run/docker.sock:/var/run/docker.sock',
            `${path.join(__dirname,'traefik.toml')}:/traefik.toml`,    
          ],
        },
        Labels: {
            'traefik.frontend.rule': 'Host:monitor.localhost',
            'traefik.port': '8080',
        },
    },
    networkName: NETWORK_NAME,
    reverseProxyContainerName: REVERSE_PROXY_CONTAINER_NAME,
    networkLabelName: LABEL,
    networkLabelValue: LABEL_VALUE
});

module.exports = fp(function (fastify, opts, next) {
    process.on('beforeExit', async () => {
        await reverseProxy.stop();
        process.exit(0);
    })
    process.on('SIGINT', async () => {
        await reverseProxy.stop();
        process.exit(0);
    });
    fastify.ready(async () => {
        await reverseProxy.start();
    })
  
    next()
})
