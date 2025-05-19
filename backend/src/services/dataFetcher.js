const axios = require('axios');
const { getApi, disconnectApi } = require('./apiProvider');
const { queryIdentity } = require('./identity');

/**
 * Fetches the description of a proposal from Polkassembly API
 * @param {number} proposalId - The ID of the proposal to fetch description for
 * @returns {Promise<string>} The proposal description or empty string if fetch fails
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

/**
 * Main function to fetch and process referendum data from Polkassembly and Polkadot network
 * Fetches the latest 10 referendums, their descriptions, and voting information
 * Only includes proposals with 'spend' or 'spend_local' methods
 *
 * @returns {Promise<Array>} Array of processed referendum data including:
 * - Basic proposal info (ID, title, status, etc.)
 * - Voting tally (ayes, nays, support)
 * - Proposal description
 * - Proposer identity information
 */
async function fetchData() {
    const url = 'https://api.polkassembly.io/api/v1/listing/on-chain-posts';
    const headers = { 'x-network': 'polkadot' };
    const params = {
        proposalType: 'referendums_v2',
        listingLimit: 10,
        trackStatus: 'All',
        sortBy: 'newest'
    };

    try {
        // Initialize Polkadot API connection
        const api = await getApi();

        // Fetch basic proposal data from Polkassembly
        const response = await axios.get(url, { headers, params });
        const posts = response.data.posts;

        // Process each proposal to add additional information
        const postsWithDescriptions = await Promise.all(posts
            // Filter for spending proposals only
            .filter(post => post.method === 'spend' || post.method === 'spend_local')
            .map(async post => {
                // Fetch additional data for each proposal
                const description = await fetchProposalDescription(post.post_id);
                const referendumInfo = await api.query.referenda.referendumInfoFor(post.post_id);
                const proposerName = await queryIdentity(post.proposer);

                // Extract voting tally information if referendum is ongoing
                let tally = null;
                if (referendumInfo.isSome) {
                    const info = referendumInfo.unwrap();
                    if (info.isOngoing) {
                        const ongoing = info.asOngoing;
                        tally = {
                            ayes: ongoing.tally.ayes.toString().replace(/,/g, ''),
                            nays: ongoing.tally.nays.toString().replace(/,/g, ''),
                            support: ongoing.tally.support.toString().replace(/,/g, '')
                        };
                    }
                }

                // Return combined proposal data
                return {
                    post_id: post.post_id,
                    assetId: post.assetId,
                    created_at: post.created_at,
                    hash: post.hash,
                    method: post.method,
                    proposer: post.proposer,
                    requestedAmount: post.requestedAmount,
                    status: post.status,
                    title: post.title,
                    track_no: post.track_no,
                    ayes: tally ? tally.ayes : null,
                    nays: tally ? tally.nays : null,
                    support: tally ? tally.support : null,
                    topic_id: post.topic?.id || null,
                    topic_name: post.topic?.name || null,
                    description: description,
                    proposer_name: proposerName
                };
            }));

        // Clean up API connection
        await disconnectApi();
        return postsWithDescriptions;

    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

module.exports = {
    fetchData
};