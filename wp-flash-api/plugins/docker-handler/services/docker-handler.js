'use strict'

const Docker = require('dockerode');
const docker = new Docker();
const each_series = require('p-each-series');

module.exports = {
    async isNetworkExists(networkName){
        const [ dockerNetwork, ] = await docker.listNetworks({filters: {"name":{[networkName]:true}}});
        return !!dockerNetwork;
    },
    async createNetwork(networkName) {
        return docker.createNetwork({
            name: networkName,
            CheckDuplicate: true,
            Attachable: true
        });
    },
    async removeNetwork(networkName) {
        try {
            const [ { Id: networkId }, ] = await docker.listNetworks({filters: {"name":{[networkName]:true}}});
            const network = await docker.getNetwork(networkId);
            await network.remove({ force: true });
        } catch (error) {
            console.log('REMOVE error', error);
        }
    },
    async isContainerExists(containerName){
        const [ container, ] = await docker.listContainers({filters: {"name":{[containerName]:true}}});
        return !!container;
    },
    async createContainer(options) {
        const container = await docker.createContainer(options)
        await container.start();
        return container;
    },
    async removeContainer(containerName) {
        try {
            const [ { Id: containerId }, ] = await docker.listContainers({filters: {"name":{[containerName]:true}}});
            const container = await docker.getContainer(containerId);
            await container.remove({ force: true });
        } catch (error) {
            console.log('REMOVE error', error);
        }
    },
    getContainersByLabel: (label, labelValue) => docker.listContainers({
        all: true,
        filters: {"label":{[`${label}=${labelValue}`]:true}}
    }),
    getId: ({ Id }) => Id,
    async connectContainersToNetwork(networkName, containers = []) {
        try {
            const [ { Id: networkId }, ] = await docker.listNetworks({filters: {"name":{[networkName]:true}}});
            const network = await docker.getNetwork(networkId);
            await each_series(containers, async containerId => await network.connect({ Container: containerId}))
        } catch (error) {
            console.log('CONNECT ERROR', error)
            return false;
        }
        return true;
    },
    async disconnectContainersFromNetwork(networkName, containers = []) {
        try {
            const [ { Id: networkId }, ] = await docker.listNetworks({filters: {"name":{[networkName]:true}}});
            const network = await docker.getNetwork(networkId);
            await each_series(containers, async containerId => await network.disconnect({ Container: containerId, Force: true}))
        } catch (error) {
            console.log('DISCONNECT ERROR', error)
            return false;
        }
        return true;
    },
}