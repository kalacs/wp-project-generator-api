"use strict"
const user = require('os').userInfo().username;
const path = require('path');

module.exports = function() {
    return {
        sitesPath: `/home/${user}/localSites`,
        templatePath: path.join(__dirname, '..', 'project-template'),
        packagesPathOnHost: `/home/${user}/Downloads/wp-packages`,
        packagesPathInContainer: `/opt/wp-packages`,
    };
};