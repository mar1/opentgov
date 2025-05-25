
# OpenTGov

  OpenTGov is a tool that makes Polkadot governance accessible and user-friendly through Telegram integration. It enables users to participate in Polkadot's OpenGov directly from their Telegram app, making the governance process more accessible to the broader community.

This version is fully self-custodial and uses a governance proxy in order to keep your funds fully safe and under your control.

It is currently funded by the [Open-Source Bounty](https://github.com/PolkadotOpenSourceGrants).

## 🌟 Key Features

- **Telegram Bot Integration**: Vote on OpenGov referenda directly from Telegram

- **Fully Non-Custodial**: Your private keys never leave your machine

- **User-Friendly Interface**: Simple commands for voting and checking status

- **Voting History**: Track your governance participation

- **Balance Checking**: Monitor your account balance

- **Conviction Voting**: Support for Polkadot's conviction voting mechanism

- **Web Dashboard**: Visual interface for proposal tracking and voting

- **Proxy-Based**: The bot is using the governance proxy type to keep your funds safe.

## 🏗️ Project Structure

The project is organized into three main components:

### 1. Bot (`/bot`)

- Telegram bot implementation

- Handles user interactions and voting commands

- Self-custodial voting mechanism

- Local vote history storage

- Key features:

-- Vote on referenda

-- Check balance

-- View voting history

-- Conviction voting support

### 2. Backend (`/backend`)

- Server-side component

- Proposal fetching and updating

- Integration with Polkassembly API

- Supabase database integration

- Key feature:

-- Proposal tracking

-- Blockchain interaction

-- Telegram group automated management

### 3. Website (`/website`)

- Frontend application built with Nuxt 3

- Modern UI with Tailwind CSS

- Integration with Polkadot.js

- Key features:

-- Proposal visualization (title, description, tally)

-- Real-time updates

## 💡 Usage

### Telegram Bot Commands

- `/start` - Begin using the bot

- `/vote <proposal_id> <aye/nay> <balance> [conviction]` - Vote on a referendum

- `/history` - View your voting history

- `/balance` - Check your current balance

- `/help` - Show help message

### Conviction Voting

The platform supports Polkadot's conviction voting mechanism:

- 0 - No conviction (0.1x)

- 1 - 1x voting power, locked for 7 days

- 2 - 2x voting power, locked for 14 days

- 3 - 3x voting power, locked for 28 days

- 4 - 4x voting power, locked for 56 days

- 5 - 5x voting power, locked for 112 days

- 6 - 6x voting power, locked for 224 days

## 🔒 Security Considerations

- Run the bot on a secure machine

- Never share your `.env` file

- Use a governance proxy for the bot, not your main wallet

- Regularly backup your `votes.json` file

- Keep your proxy private keys secure

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🌞 Socials

- [X account](https://x.com/opentgov)
- [Telegram Group](https://t.me/opentgov)
- [Website](https://opentgov.com)
