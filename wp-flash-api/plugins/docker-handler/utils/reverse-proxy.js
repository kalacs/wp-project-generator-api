'use strict'

const {
	isNetworkExists,
	createNetwork,
	isContainerExists,
	createContainer,
	getContainersByLabel,
	getId,
	connectContainersToNetwork,
	disconnectContainersFromNetwork,
	removeContainer,
	removeNetwork
} = require('../services/docker-handler');
const getProxyNetworkContainers = async (label, labelValue) => (await getContainersByLabel(label, labelValue)).map(getId);

module.exports = ({
    containerOptions,
    networkName,
    reverseProxyContainerName,
    networkLabelName,
    networkLabelValue
}) => {
	return {
		async start() {
			console.log('START RP')

			try {
				// 1. checkIfNetworkExists
				if(!await isNetworkExists(networkName)) {
					// 1.b createNetwork
					await createNetwork(networkName)
				}
				// 1.c checkIfReveseProxyExists
				if (!await isContainerExists(reverseProxyContainerName)) {
						// 1.d createReverseProxy
						await createContainer(containerOptions)
				}
				// 1.e getWPContainers
				const containers = [...(await getProxyNetworkContainers(networkLabelName, networkLabelValue)), reverseProxyContainerName];
				// 1.f connectContainersToNetwork
				if(await connectContainersToNetwork(networkName, containers)) {
						console.log('Connect successfully');
				} else {
						console.log('Connect containers failed');
				}		
			} catch (error) {
				console.log(error)
			}
		},
		async stop() {
			console.log('STOP RP')
			try {
				const containers = [...(await getProxyNetworkContainers(networkLabelName, networkLabelValue)), reverseProxyContainerName];
				// 1.f connectContainersToNetwork
				await disconnectContainersFromNetwork(networkName, containers)
				console.log('Disconnect successfully');
				await removeNetwork(networkName);
				await removeContainer(reverseProxyContainerName);
			} catch (error) {
				console.log('Disconnect containers failed');
			}    
		},
	};
};