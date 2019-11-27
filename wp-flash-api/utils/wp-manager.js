"use strict"

const compose = require('docker-compose');
const { Docker, Options } = require('docker-cli-js');
const getConfig = require('../utils/config'); 
const {
    sitesPath,
    packagesPathOnHost: packagesPath
} = getConfig();
const globby = require('globby');
const objectPath = require('object-path');
const path = require('path');
const createDocker = cwd => new Docker(new Options(null, cwd));

module.exports = function() {
    return {
        createServices: projectFullPath => compose.upAll({ cwd: projectFullPath }),
        stopServices: projectFullPath => compose.stop({ cwd: projectFullPath }),
        restartServices: projectFullPath => compose.restartAll({ cwd: projectFullPath }),
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
        },
        installPlugin: async ({
            projectFullPath,
            container,
            network,
            plugins = []
        }) => {
            const pluginsString = plugins.join(' ');
            const {
                packagesPathInContainer,
                packagesPathOnHost
            } = getConfig();
            const pluginNames = plugins.map(plugin => plugin.split(path.sep).pop().split('.').shift()).join(' ')
            await createDocker(projectFullPath).command(`run --rm -v ${packagesPathOnHost}:${packagesPathInContainer} --volumes-from ${container} --network ${network} wordpress:cli plugin install ${pluginsString} --force`);
            return createDocker(projectFullPath).command(`run --rm -v ${packagesPathOnHost}:${packagesPathInContainer} --volumes-from ${container} --network ${network} wordpress:cli plugin activate ${pluginNames}`);
        },
        installTheme: ({
            projectFullPath,
            container,
            network,
            theme
        }) => {
            const {
                packagesPathInContainer,
                packagesPathOnHost
            } = getConfig();
            return createDocker(projectFullPath).command(`run --rm  -v ${packagesPathOnHost}:${packagesPathInContainer} --volumes-from ${container} --network ${network} wordpress:cli theme install ${theme} --activate --force`);
        },
        listPackages: async () => {
            const initial = {};
            const matches = await globby([
                '*.*',
                '*/',
                '*/*',
                '/*',
                '*/**/*.zip',
                '**/'
            ], {
                expandDirectories: true,
                objectMode: true,
                cwd: packagesPath
            });
            return matches.reduce((acc, { name, path }) => {
                const [ packageName, type, ] = path.split('/');

                if (!(packageName in acc)) {
                    acc[packageName] = { plugins: [], themes: [] }
                }

                objectPath.push(acc, `${packageName}.${type}`, {
                    name: name.split('.')[0],
                    path,
                });
                return acc;
            }, initial);
        },
        async listPackageContent(name) {
            const data = await this.listPackages();
            return data[name] || {}
        }
    }
}