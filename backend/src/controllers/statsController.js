/**
 * Stats Controller
 * Handles the retrieval of system-wide statistics and metrics
 */

const supabase = require('../config/supabase');

/**
 * Retrieves system statistics including proposal counts
 * @returns {Promise<Object>} Object containing opentgov's proposal statistics
 * @throws {Error} If there's an error fetching data from Supabase
 */
exports.getStats = async () => {
    // Get total count of referendum proposals from the database
    const { count: proposalCount, error: proposalError } = await supabase
        .from('referendums')
        .select('*', { count: 'exact', head: true });

    if (proposalError) throw proposalError;

    return {
        proposalCount
    };
};