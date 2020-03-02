'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const cors = require('cors');

var whitelist = ['app://postman', 'http://localhost:4128'];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

module.exports = function(fastify, opts, next) {
  // Place here your custom code!
  fastify.ready(() => {
    console.log(fastify.printRoutes());
  });

  fastify.use(cors(corsOptions));

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts),
  });

  // Make sure to call next when done
  next();
};
