# OpenTGov Backend

## Description

OpenTGov Backend is the server-side component of opentgov, a platform for engagement with Polkadot's OpenGov through a Telegram bot interface. It handles proposal fetching and creates telegram's messages accordingly.

## Features

- Proposal fetching and management
- Voting on OpenGov referenda
- Telegram bot integration
- Polkadot blockchain interaction
- Supabase database integration
- Statistics and analytics endpoints

## Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn
- Supabase account
- Telegram Bot Token
- Polkadot node access

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mar1/opentgov/
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```plaintext
   BOT_TOKEN=your_telegram_bot_token
   CHANNEL_ID=your_telegram_channel_id
   SUBSCAN_API=your_subscan_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   FRONTEND_URL=your_frontend_url
   PORT=3001
   POLKADOT_NODE_URL=wss://rpc.polkadot.io
   PEOPLE_CHAIN_URL=wss://sys.ibp.network/people-polkadot
   ```

## Project Structure

The project follows a modular structure:

```plaintext
src/
├── app.js              # Main application setup
├── config/            # Configuration files
├── controllers/       # Request handlers
├── routes/           # API route definitions
├── services/         # External service interactions
└── middleware/       # Custom middleware functions
```

## API Endpoints

### Proposals

- `GET /api/proposals`: Fetch proposals
- `GET /api/proposals/:id`: Get specific proposal details

### Statistics

- `GET /api/stats`: Get platform statistics
- `GET /api/stats/votes`: Get voting statistics

## Dependencies

Key dependencies include:

- `@polkadot/api`: Polkadot blockchain interaction
- `@supabase/supabase-js`: Database management
- `express`: Web server framework
- `node-telegram-bot-api`: Telegram bot integration
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

## Development

To start the development server:

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3001).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
