/**
 * Controller module for handling proposal-related operations in the Polkadot governance system.
 * This module provides functions to fetch and manage on-chain proposals (referendums).
 */

const supabase = require('../services/database');
const axios = require('axios');
const { createPolkadotApi } = require('../services/polkadot');
const { fetchData } = require('../services/dataFetcher');
const { queryIdentity } = require('../services/identity');

/**
 * Fetches a list of recent proposals (referendums) from the database
 * @param {number} limit - Maximum number of proposals to return (default: 10)
 * @returns {Promise<Array>} Array of proposal objects
 * @throws {Error} If database query fails
 */
async function fetchProposals(limit = 10) {
    const { data, error } = await supabase
        .from('referendums')
        .select('*')
        .limit(limit);

    if (error) throw error;
    return data;
}

/**
 * Retrieves the detailed description of a specific proposal from Polkassembly
 * @param {number} proposalId - The ID of the proposal to fetch
 * @returns {Promise<string>} The proposal's content/description
 * @returns {Promise<string>} Empty string if the fetch fails
 */
async function fetchProposalDescription(proposalId) {
    const url = 'https://api.polkassembly.io/api/v1/posts/on-chain-post';
    const headers = { 'x-network': 'polkadot' };
    const params = {
        proposalType: 'referendums_v2',
        postId: proposalId
    };

    try {
        const response = await axios.get(url, { headers, params });
        return response.data.content;
    } catch (err) {
        console.log(err);
        return '';
    }
}

module.exports = {
    fetchProposals,
    fetchProposalDescription,
    fetchData
};