/**
 * API Provider Module
 * This module manages the connection to the Polkadot network using @polkadot/api.
 * It implements a singleton pattern to maintain a single API instance across the application.
 */

const { ApiPromise, WsProvider } = require('@polkadot/api');
const config = require('../config');

// Singleton instance of the Polkadot API
let api = null;

/**
 * Gets or creates a Polkadot API instance.
 * Implements lazy initialization - the API connection is only established when first needed.
 * @returns {Promise<ApiPromise>} The Polkadot API instance
 */
async function getApi() {
    if (!api) {
        const provider = new WsProvider(config.POLKADOT_NODE_URL);
        api = await ApiPromise.create({ provider, noInitWarn: true });
    }
    return api;
}

/**
 * Disconnects the current API instance and cleans up resources.
 * This should be called when the application is shutting down or when
 * the API connection needs to be reset.
 */
async function disconnectApi() {
    if (api) {
        await api.disconnect();
        api = null;
    }
}

module.exports = {
    getApi,
    disconnectApi
};