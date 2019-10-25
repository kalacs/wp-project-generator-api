'use strict'

const placeholder = require('../../utils/placeholder');
const fs = require('fs');
const promisify = require('util').promisify;
const promisifiedRead = promisify(fs.readFile);
const promisifiedWrite = promisify(fs.writeFile);
const path = require('path');
const compose = require('docker-compose');

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
      request.log.info('BODY', request.body);
      // tempdata
      const templateData = {
        project: {
          prefix: 'test',
          database: {
            name: 'test',
            user: 'test',
            password: 'test',
            root_password: 'test',
          },
          webserver: {
            port: 8888
          }
        }
      };
      // read template
      const tmlPath = path.join(__dirname, '..','..','docker-template')
      const tmpFile = 'docker-compose.tmp';
      const fileContent = (await promisifiedRead(path.join(tmlPath, tmpFile))).toString()
      const templatedContent = placeholder(fileContent, templateData);
      request.log.info('File', templatedContent);

      // write compose file
      await promisifiedWrite(path.join(__dirname, '..','..','temp','docker-compose.yml'), templatedContent);
      //run compose file
      const result = await compose.upAll({ cwd: path.join(__dirname, '..','..','temp'),  log: true});
      return result;
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
