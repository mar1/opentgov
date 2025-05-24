const supabase = require('./database');
const { fetchData } = require('./dataFetcher');
const { createTopic, sendMessage, editMessage, updateTopicName } = require('./telegramChannel');

/**
 * Compares new and old referendum data to identify updated or new proposals
 * @param {Array} oldData - Array of old referendum data
 * @param {Array} newData - Array of new referendum data
 * @returns {Object} Object containing new and updated posts
 */
async function compareData(oldData, newData) {
    const newPosts = [];
    const updatedPosts = [];

    newData.forEach(newPost => {
        const oldPost = oldData.find(post => post.post_id === newPost.post_id);

        if (oldPost) {
            let isUpdated = false;
            let updateReason = '';

            // Special handling for title to ensure we detect changes
            if (newPost.title && (!oldPost.title || newPost.title !== oldPost.title)) {
                isUpdated = true;
                updateReason = `Title changed from "${oldPost.title || 'none'}" to "${newPost.title}"`;
            }

            // Check other fields if title hasn't changed
            if (!isUpdated) {
                for (const key in newPost) {
                    if (['created_at', 'updated_at'].includes(key)) continue;

                    if (typeof newPost[key] === 'number' || typeof oldPost[key] === 'number') {
                        if (Number(newPost[key]) !== Number(oldPost[key])) {
                            isUpdated = true;
                            updateReason = `${key} changed from ${oldPost[key]} to ${newPost[key]}`;
                            break;
                        }
                    } else if (newPost[key] !== oldPost[key]) {
                        isUpdated = true;
                        updateReason = `${key} changed from "${oldPost[key]}" to "${newPost[key]}"`;
                        break;
                    }
                }
            }

            if (isUpdated) {
                console.log(`Post #${newPost.post_id} updated: ${updateReason}`);
                updatedPosts.push(newPost);
            }
        } else {
            console.log(`New post detected: #${newPost.post_id} - ${newPost.title || 'No title yet'}`);
            newPosts.push(newPost);
        }
    });

    return { newPosts, updatedPosts };
}

/**
 * Updates the database with new referendum data
 * @param {Array} newData - Array of new referendum data
 */
async function updateDatabase(newData) {
    const { data, error } = await supabase
        .from('referendums')
        .upsert(newData, { onConflict: 'post_id' });

    if (error) {
        console.error('Error updating Supabase:', error);
    } else {
        console.log('Supabase updated.');
    }
}

/**
 * Main function to fetch and process referendum data from Polkassembly and Polkadot network
 * Fetches the latest 10 referendums, their descriptions, and voting information
 * Only includes proposals with 'spend' or 'spend_local' methods
 *
 * @returns {Promise<void>}
 */
async function runPeriodically() {
    console.log('Fetching new data...');
    const newData = await fetchData();
    const { data: storedData, error } = await supabase
        .from('referendums')
        .select('*');

    if (error) {
        console.error('Error fetching stored data:', error);
        return;
    }

    const { newPosts, updatedPosts } = await compareData(storedData, newData);

    console.log('Updating database...');
    await updateDatabase(newData);

    if (newPosts.length > 0) {
        console.log(`New posts detected: ${newPosts.length}`);
        for (const post of newPosts) {
            console.log(`Creating topic for post #${post.post_id}`);
            const threadId = await createTopic(post);
            if (threadId) {
                await sendMessage(post, threadId);
            }
        }
    }

    if (updatedPosts.length > 0) {
        console.log(`Updated posts detected: ${updatedPosts.length}`);
        for (const post of updatedPosts) {
            console.log(`Updating message for post #${post.post_id}`);
            const { data, error } = await supabase
                .from('referendums')
                .select('tg_id, thread_id')
                .eq('post_id', post.post_id)
                .single();

            if (error) {
                console.error(`Error fetching IDs for post #${post.post_id}:`, error);
            } else if (data) {
                if (data.tg_id) {
                    await editMessage(post, data.tg_id);
                }
                if (data.thread_id) {
                    await updateTopicName(post, data.thread_id);
                }
            }
        }
    }

    if (newPosts.length === 0 && updatedPosts.length === 0) {
        console.log('No changes detected.');
    }

    console.log('Periodic run completed.');
}

module.exports = {
    runPeriodically
};