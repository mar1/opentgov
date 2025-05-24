const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const supabase = require('./database');

const bot = new TelegramBot(config.BOT_TOKEN);

// Emoji per proposal status
const titleEmoji = {
    'Submitted': '⌛️',
    'Deciding': '🗳️',
    'Executed': '✅',
    'Rejected': '❌',
    'ConfirmStarted': '⌛️',
    'TimedOut': '❌',
    'Confirmed': '✅',
    'DecisionDepositPlaced': '⌛️',
    'Cancelled': '❌',
    'ExecutionFailed': '❌',
    'Killed': '❌',
};

// Mapping per track number
const tracks = {
    0: 'Root',
    1: 'Whitelisted Caller',
    10: 'Staking Admin',
    11: 'Treasurer',
    12: 'Lease Admin',
    13: 'Fellowship Admin',
    14: 'General Admin',
    15: 'Auction Admin',
    20: 'Referendum Canceller',
    21: 'Referendum Killer',
    30: 'Small Tipper',
    31: 'Big Tipper',
    32: 'Small Spender',
    33: 'Medium Spender',
    34: 'Big Spender'
};

/**
 * Formats the amount of DOT or USD based on the asset ID
 * @param {number} amount - The amount to format
 * @param {number} assetId - The asset ID
 * @returns {string} The formatted amount
 */
function formatAmount(amount, assetId) {
    if (assetId === null) {
        return `${parseInt(amount / 1e10).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} DOT`;
    } else if (parseInt(assetId) === 1984) {
        return `${parseInt(amount / 1e6).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} USD`;
    }
    return `${amount} (Unknown Asset)`;
}

/**
 * Formats the vote percentages for a proposal
 * @param {number} ayes - The number of ayes
 * @param {number} nays - The number of nays
 * @returns {Object} Object containing the formatted vote percentages
 */
function formatVotePercentages(ayes, nays) {
    if (!ayes || !nays) return { ayes: 'N/A', nays: 'N/A' };

    const total = parseInt(ayes) + parseInt(nays);
    if (total === 0) return { ayes: '0%', nays: '0%' };

    const ayePercentage = ((parseInt(ayes) / total) * 100).toFixed(2);
    const nayPercentage = ((parseInt(nays) / total) * 100).toFixed(2);

    return {
        ayes: `${ayePercentage}%`,
        nays: `${nayPercentage}%`,
    };
}

/**
 * Creates a message for a proposal
 * @param {Object} post - The proposal object
 * @returns {Promise<string>} The formatted message
 */
async function createMessage(post) {
    // Convert HTML to Telegram-friendly format
    let description = post.description
        .replace(/<p>/g, '')
        .replace(/<\/p>\s*<p>&nbsp;<\/p>/g, '\n\n')
        .replace(/<\/p>/g, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"(?:[^>]*?)>(.*?)<\/a>/g, (match, url, text) => {
            const safeUrl = url.replace(/\(/g, '%28').replace(/\)/g, '%29');
            return `[${text}](${safeUrl})`;
        })
        .replace(/\((.*?)\)/g, (match, p1) => p1.includes("http") ? match : `(${p1})`)
        .replace(/&nbsp;/g, ' ')
        .replace(/&rsquo;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&bull;/g, '•')
        .replace(/&lsquo;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&mdash;/g, '—')
        .replace(/<\/?(strong|b)>/g, '*')
        .replace(/<\/?(em|i)>/g, '_')
        .replace(/<\/?(u)>/g, '__')
        .replace(/<\/?(s|strike|del)>/g, '~')
        .replace(/<h2(?:\s+id="[^"]*")?>([^<]*)<\/h2>/g, '\n\n*$1*\n')
        .replace(/<h3(?:\s+id="[^"]*")?>([^<]*)<\/h3>/g, '\n\n_$1_\n')
        .replace(/<ol[^>]*>/g, '\n')
        .replace(/<\/ol>/g, '\n')
        .replace(/<li>([\s\S]*?)<\/li>/g, (match, p1) => {
            return '• ' + p1.split(/\n\s*•\s*/).map(item => item.trim()).join('\n  • ') + '\n';
        })
        .replace(/<img.*?src="(.*?)".*?>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, 3000);

    // Remove any remaining HTML tags
    description = description.replace(/<[^>]*>/g, '');

    // Capping the max size of a message at 3000 characters
    if (description.length === 3000) {
        description += '...';
    }

    const formattedAmount = formatAmount(post.requestedAmount, post.assetId);
    const formattedVotes = formatVotePercentages(post.ayes, post.nays);
    const statusEmoji = titleEmoji[post.status] || '📝';
    const trackInfo = tracks[post.track_no] || 'Unknown Track';

    // Format the message using telegram-format
    const message = `
╔══ 🗳 *Referendum #${post.post_id}* ══╗
*${post.title.replace(/([*_`[\]])/g, '\\$1')}*
╚════════════════════════════╝

ℹ️ *Overview*
• Status: *${post.status.replace(/([*_`[\]])/g, '\\$1')}* ${statusEmoji}
• Track: *${trackInfo.replace(/([*_`[\]])/g, '\\$1')}* 🛤
• Requested: *${formattedAmount.replace(/([*_`[\]])/g, '\\$1')}* 💰

👤 *Proposer*
${post.proposer_name.replace(/([*_`[\]])/g, '\\$1')} - ${post.proposer.replace(/([*_`[\]])/g, '\\$1')}

📝 *Description*
─────────────────────────
${description
            // Convert HTML to markdown first
            .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"(?:[^>]*?)>(.*?)<\/a>/g, (match, url, text) => {
                return `[${text.trim()}](${url.replace(/\\/g, '')})`;
            })
            .replace(/<strong>(.*?)<\/strong>/g, '*$1*')
            .replace(/<em>(.*?)<\/em>/g, '_$1_')
            .replace(/<p>/g, '\n\n')
            .replace(/<\/p>/g, '')
            .replace(/<ul>/g, '\n')
            .replace(/<\/ul>/g, '\n')
            .replace(/<li>/g, '• ')
            .replace(/<\/li>/g, '\n')
            .replace(/<hr\s*\/?>/g, '\n─────────────────────────\n')
            .replace(/<img[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&rsquo;/g, "'")
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            .replace(/&bull;/g, '•')
            .replace(/&lsquo;/g, "'")
            .replace(/&rsquo;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&mdash;/g, '—')
            // Then handle markdown links
            .replace(/\[(.*?)\s*\]\((.*?)\)/g, (match, text, url) => {
                return `[${text.trim()}](${url.replace(/\\/g, '')})`;
            })
            // Convert markdown formatting to Telegram format
            .replace(/\*\*(.*?)\*\*/g, '*$1*')
            .replace(/\*(.*?)\*/g, '*$1*')
            .replace(/_(.*?)_/g, '_$1_')
            // Escape any remaining special characters that aren't part of formatting
            .replace(/(?<![*_])([*_])(?![*_])/g, '\\$1')
            // Clean up multiple newlines
            .replace(/\n{3,}/g, '\n\n')
            .trim()}

📊 *Current Tally*
─────────────────────────
• ✅ Ayes: *${formattedVotes.ayes.replace(/([*_`[\]])/g, '\\$1')}*
• ❌ Nays: *${formattedVotes.nays.replace(/([*_`[\]])/g, '\\$1')}*
`.trim();

    return message;
}

/**
 * Creates a topic for a proposal
 * @param {Object} post - The proposal object
 * @returns {Promise<number>} The thread ID of the created topic
 */
async function createTopic(post) {
    try {
        const response = await bot.createForumTopic(config.CHANNEL_ID, `${titleEmoji[post.status]} ${post.post_id}: ${post.title}`);

        if (response) {
            console.log(`Topic created successfully for post #${post.post_id}`);
            // Store both message_thread_id and tg_id in the database
            const { error } = await supabase
                .from('referendums')
                .update({
                    thread_id: response.message_thread_id,
                    tg_id: null // Will be set when message is sent
                })
                .eq('post_id', post.post_id);

            if (error) {
                console.error('Error updating thread_id in database:', error);
            }
            return response.message_thread_id;
        } else {
            console.error(`Failed to create topic for post #${post.post_id}`);
            return null;
        }
    } catch (error) {
        console.error(`Error creating topic for post #${post.post_id}:`, error.message);
        return null;
    }
}

/**
 * Sends a message to a specific thread in the Telegram channel
 * @param {Object} post - The proposal object
 * @param {number} threadId - The thread ID of the topic
 * @returns {Promise<number>} The message ID of the sent message
 */
async function sendMessage(post, threadId) {
    const message = await createMessage(post);

    try {
        const response = await bot.sendMessage(config.CHANNEL_ID, message, {
            message_thread_id: threadId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'View on Polkassembly',
                            url: `https://polkadot.polkassembly.io/referenda/${post.post_id}`
                        },
                        {
                            text: 'View on Subsquare',
                            url: `https://polkadot.subsquare.io/referenda/${post.post_id}`
                        }
                    ],
                ]
            }
        });

        if (response) {
            console.log('Message sent successfully:', response.message_id);
            // Update the tg_id (message ID) in the database
            const { error } = await supabase
                .from('referendums')
                .update({ tg_id: response.message_id })
                .eq('post_id', post.post_id);

            if (error) {
                console.error('Error updating tg_id in database:', error);
            }
            return response.message_id;
        }
    } catch (error) {
        console.error('Error sending message:', error);
        return null;
    }
}

/**
 * Edits a message in the Telegram channel
 * @param {Object} post - The proposal object
 * @param {number} messageId - The ID of the message to edit
 * @returns {Promise<boolean>} True if the message was edited successfully, false otherwise
 */
async function editMessage(post, messageId) {
    const newMessage = await createMessage(post);

    try {
        const response = await bot.editMessageText(newMessage, {
            chat_id: config.CHANNEL_ID,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'View on Polkassembly',
                            url: `https://polkadot.polkassembly.io/referenda/${post.post_id}`
                        },
                        {
                            text: 'View on Subsquare',
                            url: `https://polkadot.subsquare.io/referenda/${post.post_id}`
                        }
                    ]
                ]
            }
        });

        if (response) {
            console.log(`Message edited successfully for post #${post.post_id}`);
            return true;
        }
    } catch (error) {
        console.error(`Error editing message for post #${post.post_id}:`, error);
        return false;
    }
}

/**
 * Updates the name of a topic in the Telegram channel
 * @param {Object} post - The proposal object
 * @param {number} threadId - The thread ID of the topic
 * @returns {Promise<boolean>} True if the topic name was updated successfully, false otherwise
 */
async function updateTopicName(post, threadId) {
    try {
        // Validate input
        if (!post.title) {
            console.error(`Cannot update topic name for post #${post.post_id}: No title available`);
            return false;
        }

        if (!threadId) {
            console.error(`Cannot update topic name for post #${post.post_id}: No thread ID provided`);
            return false;
        }

        const newTopicName = `${titleEmoji[post.status]} ${post.post_id}: ${post.title}`;
        console.log(`Attempting to update topic name for post #${post.post_id}:`);
        console.log(`- Thread ID: ${threadId}`);
        console.log(`- New name: ${newTopicName}`);

        const response = await bot.editForumTopic(config.CHANNEL_ID, threadId, {
            name: newTopicName
        });

        if (response) {
            console.log(`Topic name updated successfully for post #${post.post_id}`);
            return true;
        } else {
            console.error(`Failed to update topic name for post #${post.post_id}: No response from Telegram API`);
            return false;
        }
    } catch (error) {
        console.error(`Error updating topic name for post #${post.post_id}:`, error);
        if (error.response) {
            console.error('Telegram API response:', error.response.data);
        }
        return false;
    }
}

module.exports = {
    createTopic,
    sendMessage,
    editMessage,
    updateTopicName
};