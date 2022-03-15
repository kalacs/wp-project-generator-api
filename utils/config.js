'use strict';
const user = require('os').userInfo().username;
const path = require('path');

module.exports = function () {
  return {
    sitesPath: `/Users/${user}/localSites`,
    templatePath: path.join(__dirname, '..', 'project-template'),
    packagesPathOnHost: `/Users/${user}/Downloads/wp-packages`,
    packagesPathInContainer: `/opt/wp-packages`,
  };
};
