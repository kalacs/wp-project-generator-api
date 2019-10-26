"use strict"

const compose = require('docker-compose');
const { Docker, Options } = require('docker-cli-js');
const path = require('path');

const createDocker = cwd => new Docker(new Options(null, cwd));

module.exports = function() {
    return {
        createServices: projectFullPath => compose.upAll({ cwd: projectFullPath }),
        queryServices: projectFullPath => compose.ps({ cwd: projectFullPath}),
        destroyServices: projectFullPath => compose.down({
            cwd: projectFullPath,
            commandOptions: ['-v']
        }),
        installWP: ({
            projectFullPath,
            volume,
            network,
            url,
            title,
            adminName,
            adminPassword,
            adminEmail,
        }) => {

            return createDocker(projectFullPath).command(`run --rm --volumes-from ${volume} --network ${network} wordpress:cli core install --url='${url}' --title='${title}' --admin_name='${adminName}' --admin_password='${adminPassword}' --admin_email='${adminEmail}'`);
        }
    }
}