'use strict'

const placeholder = require('../../utils/placeholder');
const fs = require('fs');
const promisify = require('util').promisify;
const path = require('path');
// create project template
const getConfig = require('../../utils/config');
const mkdirp = require('mkdirp');
const promisifiedMkdirp = promisify(mkdirp);
// copy and transform template
const copy = require('recursive-copy');
const through = require('through2');
const wpManager = require('../../utils/wp-manager')();
const WP_MANAGER_HEADER = 'wp-manager-project-path';
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
      return copiedFiles;
    }
  ),

  fastify.get('/:projectName/services', async req => wpManager.queryServices(extractServicesParameters(req))),
  fastify.post('/:projectName/services', async req => {
    const extractedParameters = extractServicesParameters(req);
    const command = getCommand(extractedParameters);
    const projectFullPath = getProjectFullPath(extractedParameters);

    switch(command) {
      case 'up': 
        return wpManager.createServices(projectFullPath);
      case 'stop':
        return wpManager.stopServices(projectFullPath);
      case 'restart':
        return wpManager.restartServices(projectFullPath);
      default: 
        return {};
    }
  }),
  fastify.delete('/:projectName/services', async req => wpManager.destroyServices(getProjectFullPath(extractServicesParameters(req))))

  fastify.post('/:projectName/services/wordpress', async req => wpManager.installWP(getInstallParameters(extractWPInstallParameters(req))))
}
const extractServicesParameters = ({
  params,
  body,
}) => {
  const { projectName } = params || { projectName: '' };
  const { projectPrefix } = body || { projectPrefix: '' };
  const { command } = body || { command: '' };
  const {  sitesPath: projectPath } = getConfig();
  return {
    projectName,
    projectPrefix: projectName || projectPrefix,
    projectPath,
    command
  }
};

const extractWPInstallParameters = req => {
  const {
    container,
    network,
    url,
    title,
    adminName,
    adminPassword,
    adminEmail,
  } = req.body;
  
  return {
    projectFullPath: getProjectFullPath(extractServicesParameters(req)),
    container,
    network,
    url,
    title,
    adminName,
    adminPassword,
    adminEmail,
  }
};

const getProjectFullPath = ({ projectPath, projectPrefix }) => path.join(projectPath, projectPrefix);
const getInstallParameters = ({
  projectFullPath,
  container,
  network,
  url,
  title,
  adminName,
  adminPassword,
  adminEmail,
}) => ({
  projectFullPath,
  container,
  network,
  url,
  title,
  adminName,
  adminPassword,
  adminEmail,
});
const getCommand = ({ command }) => command;
module.exports.autoPrefix = '/wordpress-project'
