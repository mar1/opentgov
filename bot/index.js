require('dotenv').config();
const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { BN } = require('@polkadot/util');
const axios = require('axios');

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const POLKADOT_MNEMONIC = process.env.POLKADOT_PROXY_MNEMONIC;
const POLKADOT_RPC = process.env.POLKADOT_RPC || 'wss://rpc.polkadot.io';
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'votes.json');
const AUTHORIZED_USER_ID = process.env.AUTHORIZED_USER_ID;

// Initialize the Telegram bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Get bot info and display startup message
bot.getMe().then((botInfo) => {
    console.log('✅ Self-custodial OpenGov voting bot is running...');
    console.log(`📱 To start using the bot, open Telegram and send /start to @${botInfo.username}`);
}).catch((error) => {
    console.error('❌ Error fetching bot info:', error);
    console.log('✅ Self-custodial OpenGov voting bot is running...');
    console.log('📱 To start using the bot, open Telegram and send /start to your bot');
});

// Authentication check function
function isAuthorizedUser(telegramId) {
    return telegramId.toString() === AUTHORIZED_USER_ID;
}

// Create data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ votes: [] }, null, 2));
}

// Load votes data
let votesData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Save votes data
function saveVotesData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(votesData, null, 2));
}

// Connect to Polkadot network
async function connectToPolkadot() {
    const provider = new WsProvider(POLKADOT_RPC);
    const api = await ApiPromise.create({ provider });
    return api;
}

// Store vote in local JSON file
async function storeVoteInLocal(proposalId, voteDecision, voteBalance, voteHash, conviction) {
    const vote = {
        telegram_id: 'self', // Since it's self-custodial
        proposal_id: proposalId,
        vote_decision: voteDecision,
        vote_balance: voteBalance,
        vote_hash: voteHash,
        vote_conviction: conviction,
        created_at: new Date().toISOString(),
        title: await getProposalTitle(proposalId)
    };

    votesData.votes.push(vote);
    saveVotesData();
    console.log('Vote stored locally successfully');
}

// Get proposal title from Polkassembly
async function getProposalTitle(proposalId) {
    try {
        const url = 'https://api.polkassembly.io/api/v1/posts/on-chain-post';
        const headers = { 'x-network': 'polkadot' };
        const params = {
            proposalType: 'referendums_v2',
            postId: proposalId
        };

        const response = await axios.get(url, { headers, params });
        return response.data.title || `Referendum #${proposalId}`;
    } catch (error) {
        console.error('Error fetching proposal title:', error);
        return `Referendum #${proposalId}`;
    }
}

// Vote on a referendum
async function voteOnReferendum(chatId, proposalId, vote, balance, conviction) {
    try {
        // Connect to Polkadot network
        const api = await connectToPolkadot();

        // Create keyring and add account from mnemonic
        const keyring = new Keyring({ type: 'sr25519' });
        const account = keyring.addFromMnemonic(POLKADOT_MNEMONIC);

        // Get the address from the account
        const address = account.address;

        // Check account balance
        const { data: accountInfo } = await api.query.system.account(address);
        const freeBalance = accountInfo.free.toBn();
        const requiredBalance = new BN(balance * 1e10); // Convert to Planck

        if (freeBalance.lt(requiredBalance)) {
            throw new Error(`Insufficient balance. You have ${freeBalance.div(new BN(1e10)).toString()} DOT, but you're trying to vote with ${balance} DOT.`);
        }

        // Prepare the vote
        const voteValue = vote === 'aye';
        const convictionType = api.createType('Conviction', conviction);
        const voteBalance = api.createType('Balance', requiredBalance);

        // Create the vote extrinsic
        const extrinsic = api.tx.convictionVoting.vote(proposalId, {
            Standard: {
                vote: { aye: voteValue, conviction: convictionType },
                balance: voteBalance
            }
        });

        // Sign and send the extrinsic
        const hash = await new Promise((resolve, reject) => {
            extrinsic.signAndSend(account, ({ status, events, dispatchError, txHash }) => {
                if (dispatchError) {
                    reject(new Error(dispatchError.toString()));
                } else if (status.isInBlock || status.isFinalized) {
                    resolve(txHash.toHex());
                }
            }).catch(reject);
        });

        // Store the vote locally
        await storeVoteInLocal(proposalId, vote, balance, hash, conviction);

        // Disconnect from the API
        await api.disconnect();

        // Return the extrinsic hash
        return hash;
    } catch (error) {
        console.error('Error processing vote:', error);
        throw error;
    }
}

// Format voting history
function formatVotingHistory(history) {
    if (!history || history.length === 0) {
        return "You haven't cast any votes yet. 🤔";
    }

    const formattedHistory = history.map((vote, index) => {
        const emoji = vote.vote_decision === 'aye' ? '✅' : '❌';
        const date = new Date(vote.created_at).toLocaleDateString();
        const convictionInfo = vote.vote_conviction > 0 ? `   🔒 Conviction: ${vote.vote_conviction}\n` : '';
        return `${index + 1}. ${emoji} Referendum #${vote.proposal_id}: ${vote.title}
   📅 ${date}
   💰 ${vote.vote_balance} DOT
${convictionInfo}   🔗 [View on Subscan](https://polkadot.subscan.io/extrinsic/${vote.vote_hash})
`;
    }).join('\n');

    return `🗳 Your Voting History:\n\n${formattedHistory}`;
}

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;

    if (!isAuthorizedUser(telegramId)) {
        bot.sendMessage(chatId, '⛔️ Unauthorized access. This bot is private.');
        return;
    }

    bot.sendMessage(chatId, `Welcome to your Self-Custodial OpenGov Voting Bot! 🤖

This bot allows you to vote directly on Polkadot OpenGov referenda using your own private key.

Available commands:
/vote <proposal_id> <aye/nay> <balance> [conviction] - Vote on a referendum
/history - View your voting history
/balance - Check your current balance
/help - Show this help message

Your votes are stored locally and your private key never leaves your machine.`);
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;

    if (!isAuthorizedUser(telegramId)) {
        bot.sendMessage(chatId, '⛔️ Unauthorized access. This bot is private.');
        return;
    }

    bot.sendMessage(chatId, `Self-Custodial OpenGov Voting Bot Help 🤖

Commands:
/vote <proposal_id> <aye/nay> <balance> [conviction] - Vote on a referendum
/history - View your voting history
/balance - Check your current balance

Vote Parameters:
• proposal_id - The referendum number to vote on
• aye/nay - Your vote (support or oppose)
• balance - Amount of DOT to vote with
• conviction - Optional (0-6), defaults to 0:
  0 - No conviction (0.1x)
  1 - 1x voting power, locked for 7 days
  2 - 2x voting power, locked for 14 days
  3 - 3x voting power, locked for 28 days
  4 - 4x voting power, locked for 56 days
  5 - 5x voting power, locked for 112 days
  6 - 6x voting power, locked for 224 days

Example:
/vote 123 aye 10 1
Votes "aye" on referendum #123 with 10 DOT and conviction level 1.`);
});

// Handle /vote command
bot.onText(/\/vote(\s+(\d+))?\s*(aye|nay)?\s*(\d+)?\s*(\d+)?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;

    if (!isAuthorizedUser(telegramId)) {
        bot.sendMessage(chatId, '⛔️ Unauthorized access. This bot is private.');
        return;
    }

    const proposalId = match[2] ? parseInt(match[2]) : null;
    const vote = match[3] ? match[3].toLowerCase() : null;
    const balance = match[4] ? parseInt(match[4]) : null;
    const convictionInput = match[5] ? parseInt(match[5]) : 0; // Default to 0 if not provided

    // Check for missing parameters
    const missingParams = [];
    if (proposalId === null) missingParams.push('proposal ID');
    if (vote === null) missingParams.push('vote (aye/nay)');
    if (balance === null) missingParams.push('balance');

    if (missingParams.length > 0) {
        const missingParamsStr = missingParams.join(', ');
        bot.sendMessage(chatId, `Missing parameter(s): ${missingParamsStr}.
Please use the format: /vote <proposal_id> <aye/nay> <balance> [conviction]
Conviction is optional (0-6). If not provided, it defaults to 0 (No conviction).

Conviction levels:
0 - No conviction (0.1x)
1 - 1x voting power, locked for 7 days
2 - 2x voting power, locked for 14 days
3 - 3x voting power, locked for 28 days
4 - 4x voting power, locked for 56 days
5 - 5x voting power, locked for 112 days
6 - 6x voting power, locked for 224 days`);
        return;
    }

    // Validate conviction input
    if (convictionInput < 0 || convictionInput > 6) {
        bot.sendMessage(chatId, 'Invalid conviction value. Please use a number between 0 and 6.');
        return;
    }

    try {
        // Show a message that the bot is processing the vote
        bot.sendMessage(chatId, `Processing your vote on referendum #${proposalId}...`);

        // Vote on the referendum
        const hash = await voteOnReferendum(chatId, proposalId, vote, balance, convictionInput);

        // Send success message with extrinsic hash, conviction info, and Subscan link
        const convictionInfo = convictionInput > 0 ? `with conviction ${convictionInput} ` : '';
        const subscanLink = `https://polkadot.subscan.io/extrinsic/${hash}`;
        bot.sendMessage(chatId, `✅ Vote submitted successfully ${convictionInfo}!

👀 Check your vote on Subscan: ${subscanLink}`);
    } catch (error) {
        console.error('Error processing vote:', error);
        bot.sendMessage(chatId, `Error: ${error.message}`);
    }
});

// Handle /history command
bot.onText(/\/history/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;

    if (!isAuthorizedUser(telegramId)) {
        bot.sendMessage(chatId, '⛔️ Unauthorized access. This bot is private.');
        return;
    }

    try {
        const formattedHistory = formatVotingHistory(votesData.votes);
        bot.sendMessage(chatId, formattedHistory, { parse_mode: 'Markdown', disable_web_page_preview: true });
    } catch (error) {
        console.error('Error processing history command:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error retrieving your voting history.');
    }
});

// Handle /balance command
bot.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;

    if (!isAuthorizedUser(telegramId)) {
        bot.sendMessage(chatId, '⛔️ Unauthorized access. This bot is private.');
        return;
    }

    try {
        // Connect to Polkadot network
        const api = await connectToPolkadot();

        // Create keyring and add account from mnemonic
        const keyring = new Keyring({ type: 'sr25519' });
        const account = keyring.addFromMnemonic(POLKADOT_MNEMONIC);

        // Get the address from the account
        const address = account.address;

        // Check account balance
        const { data: accountInfo } = await api.query.system.account(address);
        const freeBalance = accountInfo.free.toBn().div(new BN(1e10)).toString();
        const reservedBalance = accountInfo.reserved.toBn().div(new BN(1e10)).toString();
        const totalBalance = (parseFloat(freeBalance) + parseFloat(reservedBalance)).toFixed(4);

        // Disconnect from the API
        await api.disconnect();

        bot.sendMessage(chatId, `💰 Your Polkadot Wallet Balance:

🏦 Address: ${address}

💵 Free balance: ${freeBalance} DOT
🔒 Reserved: ${reservedBalance} DOT
🏦 Total: ${totalBalance} DOT

You can use your free balance for voting.`);
    } catch (error) {
        console.error('Error checking balance:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error checking your balance.');
    }
});

// Handle all other messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;

    if (!isAuthorizedUser(telegramId)) {
        bot.sendMessage(chatId, '⛔️ Unauthorized access. This bot is private.');
        return;
    }

    // Ignore commands
    if (msg.text && (msg.text.startsWith('/vote') || msg.text.startsWith('/history') ||
        msg.text.startsWith('/start') || msg.text.startsWith('/help') ||
        msg.text.startsWith('/balance'))) {
        return;
    }

    // Respond to other messages
    bot.sendMessage(chatId, `Welcome to your self-custodial OpenGov voting bot! Use /help to see available commands.`);
});