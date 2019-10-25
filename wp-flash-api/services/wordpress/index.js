'use strict'

const placeholder = require('../../utils/placeholder');
const fs = require('fs');
const promisify = require('util').promisify;
const promisifiedRead = promisify(fs.readFile);
const promisifiedWrite = promisify(fs.writeFile);
const path = require('path');
const compose = require('docker-compose');
// create project template
const getConfig = require('../../utils/config');
const mkdirp = require('mkdirp');
const promisifiedMkdirp = promisify(mkdirp);
// copy and transform template
const copy = require('recursive-copy');
const through = require('through2');
 
const copyOptions = {
    dot: true,
    filter: [
        '**/*',
        '!.htpasswd'
    ],
    rename: function(filePath) {
        return filePath.replace('.tpl', '');
    }
};

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
      request.log.info('BODY', request.body);
      // tempdata
      const templateData = request.body;
      // create project template
      const {
        sitesPath,
        templatePath
      } = getConfig();
      const projectPath = path.join(sitesPath, templateData.project.prefix);
      templateData.project.path = projectPath;

      try {
        await promisifiedMkdirp(projectPath);
      } catch (error) {
        req.log.error(error);
      }
      // copy and transform template
      copyOptions.transform = function(src, dest, stats) {
        if (path.extname(src) !== '.tpl') { return null; }
          return through(function(chunk, _, done)  {
              const output = placeholder(chunk.toString(), templateData);
              done(null, output);
          });
      }

      const copiedFiles = await copy(templatePath, projectPath, copyOptions);
      request.log.info('File', copiedFiles);

      //run compose file
//      const result = await compose.upAll({ cwd: path.join(__dirname, '..','..','temp'),  log: true});
      return copiedFiles;
    }
  )
}
module.exports.autoPrefix = '/wordpress'
// If you prefer async/await, use the following
//
// module.exports = async function (fastify, opts) {
//   fastify.get('/example', async function (request, reply) {
//     return 'this is an example'
//   })
// }
