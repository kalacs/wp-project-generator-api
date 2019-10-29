"use strict"

const compose = require('docker-compose');
const { Docker, Options } = require('docker-cli-js');
const path = require('path');
const { sitesPath } = require('./config')();

const createDocker = cwd => new Docker(new Options(null, cwd));

module.exports = function() {
    return {
        createServices: projectFullPath => compose.upAll({ cwd: projectFullPath }),
        queryServices: async ({ projectName }) => {
            const { containerList } = await createDocker(sitesPath).command(`ps -a --filter "label=com.wp-manager.project.name=${projectName}"`);
            return containerList || [];
        },
        destroyServices: projectFullPath => compose.down({
            cwd: projectFullPath,
            commandOptions: ['-v']
        }),
        installWP: ({
            projectFullPath,
            container,
            network,
            url,
            title,
            adminName,
            adminPassword,
            adminEmail,
        }) => {

            return createDocker(projectFullPath).command(`run --rm --volumes-from ${container} --network ${network} wordpress:cli core install --url='${url}' --title='${title}' --admin_name='${adminName}' --admin_password='${adminPassword}' --admin_email='${adminEmail}'`);
        }
    }
}