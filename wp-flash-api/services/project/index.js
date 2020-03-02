'use strict';

const globby = require('globby');

const getConfig = require('../../utils/config');

// API Impl

module.exports = async function(fastify, opts) {
  fastify.get('/', async () => {
    const { sitesPath } = getConfig();

    const matches = await globby(['*', '/*', '*/*'], {
      expandDirectories: false,
      objectMode: false,
      cwd: sitesPath,
    });

    const initial = {};
    const projects = matches.reduce((acc, path) => {
      const [projectName, foundFile] = path.split('/');

      if (!(projectName in acc)) {
        acc[projectName] = {
          id: projectName,
        };
      }
      return acc;
    }, initial);

    return Object.values(projects);
  });
};

module.exports.autoPrefix = '/projects';
