
# Self-Custodial OpenGov Voting Bot

A Telegram bot for voting on Polkadot OpenGov referendas using your own governance proxy private key, running locally on your machine.

To learn more about how to setup the bot, please check [the full guide.](https://opentgov.com/setup-bot)

## Features

- Vote on OpenGov referenda directly from Telegram

- Handles conviction voting

- View your voting history

- Check your account balance

- Self-custodial: your private key never leaves your machine

- Locally stored voting history

- No centralized database needed

## Setup

1. **Download the Bot**

- Click [here](https://github.com/mar1/opentgov/archive/refs/heads/main.zip) to download the bot

- Find the downloaded zip file in your Downloads folder

- Double-click to extract it

- Open the "opentgov-main" folder

- Inside, you'll find the "bot" folder

2. **Install Dependencies**

- Open Terminal (on Mac) or Command Prompt (on Windows)

- Type `cd` followed by a space

- Drag and drop the "bot" folder into the terminal window

- Press Enter

- Type `npm install` and press Enter

- Wait for the installation to complete

3. **Create your Telegram bot**

- Talk to [BotFather](https://t.me/botfather) on Telegram

- Send `/newbot` command and follow the instructions

- Copy your bot API token

4. **Create a Polkadot governance proxy account**

- Visit [Polkadot.js Apps](https://polkadot.js.org/apps/#/accounts)

- Click "Add account" to create a new account

- Save the mnemonic phrase securely

- Fund this account with at least 1 DOT from your main account

- Set up this account as a governance proxy:

1. Go to [Accounts > Proxies](https://polkadot.js.org/apps/#/accounts/proxy)

2. Select your main account

3. Add proxy, select your new account, and choose "Governance" as the proxy type

4. Submit and sign the transaction

5. **Configure environment variables**

- Create a new file named `.env` in the bot directory

- Add your Telegram bot token

- Add your Polkadot governance proxy's mnemonic phrase

- Add your Telegram user ID

```plaintext

BOT_TOKEN=your_telegram_bot_token

POLKADOT_MNEMONIC=your_governance_proxy_mnemonic_phrase

AUTHORIZED_USER_ID=your_telegram_user_id

```

> ⚠️ **IMPORTANT**:

>

> - Use the mnemonic phrase of your governance proxy account (the new account you just created), NOT your main account's mnemonic. The bot needs to sign transactions with the proxy account's key.

> - Set AUTHORIZED_USER_ID to your Telegram user ID to ensure only you can use the bot. You can get your user ID by messaging [@userinfobot](https://t.me/userinfobot) on Telegram.

6. **Start the bot**

- In the same terminal window, type `npm start` and press Enter

- Your bot is now running!

## Usage

- `/start` - Start the bot and see available commands

- `/vote <proposal_id> <aye/nay> <balance> [conviction]` - Vote on a referendum

- `/history` - View your voting history

- `/balance` - Check your current balance

- `/help` - Show help message

### Voting with Conviction

Conviction voting lets you lock your tokens for a period of time to get more voting power:

- 0 - No conviction (0.1x)

- 1 - 1x voting power, locked for 7 days

- 2 - 2x voting power, locked for 14 days

- 3 - 3x voting power, locked for 28 days

- 4 - 4x voting power, locked for 56 days

- 5 - 5x voting power, locked for 112 days

- 6 - 6x voting power, locked for 224 days

Example:

```plaintext

/vote 123 aye 10 1

```

This votes "aye" on referendum #123 with 10 DOT and conviction level 1.

## Security Considerations

Since this bot uses your governance proxy private key to sign transactions, it's important to:

- Run this bot on a secure machine only

- Never share your `.env` file

- Only uses your governance proxy seed to mitigate risks

- Regularly backup your `votes.json` file

## License

MIT
