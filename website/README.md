# Opentgov Frontend

This is the frontend application for Opentgov. The application provides a clean, user-friendly and responsive interface for viewing and tracking OpenGov proposals and their voting status across the Polkadot ecosystem.

## Features

- Real-time display of active Polkadot OpenGov proposals

- Clear visualization of voting tallies and results

- Integration with Polkadot.js for blockchain interactions

- Modern, responsive UI with Tailwind CSS

- Real-time updates using RxJS

## Tech Stack

- [Nuxt 3](https://nuxt.com/) - The Vue.js Framework

- [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework

- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

- [Polkadot.js](https://polkadot.js.org/) - JavaScript API for interacting with Polkadot/Substrate nodes

- [Supabase](https://supabase.com/) - Backend as a Service

- [RxJS](https://rxjs.dev/) - Reactive programming library

- [Ethers.js](https://docs.ethers.org/) - Ethereum library for wallet implementation

## Prerequisites

- Node.js (Latest LTS version recommended)

- npm, yarn, pnpm, or bun package manager

- A Supabase account and project (for backend services)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env

SUPABASE_URL=your_supabase_url

SUPABASE_KEY=your_supabase_key

```

## Installation

Install the dependencies:

```bash

# npm

npm  install



# pnpm

pnpm  install



# yarn

yarn  install



# bun

bun  install

```

## Development

Start the development server on `http://localhost:3000`:

```bash

# npm

npm  run  dev



# pnpm

pnpm  run  dev



# yarn

yarn  dev



# bun

bun  run  dev

```

The development server includes:

- Hot Module Replacement (HMR)

- API proxy configuration for local backend development

- Development tools enabled

- Google Fonts integration

## Building for Production

Build the application for production:

```bash

# npm

npm  run  build



# pnpm

pnpm  run  build



# yarn

yarn  build



# bun

bun  run  build

```

Preview the production build locally:

```bash

# npm

npm  run  preview



# pnpm

pnpm  run  preview



# yarn

yarn  preview



# bun

bun  run  preview

```

## Project Structure

```plaintext

website/

├── assets/ # Static assets and global CSS

├── components/ # Vue components

├── pages/ # Application pages

├── plugins/ # Nuxt plugins

├── public/ # Public static files

└── server/ # Server-side code

```

## Key Dependencies

- `@polkadot/api`: For Polkadot blockchain interaction

- `@talismn/connect-wallets`: For wallet connection management

- `@supabase/supabase-js`: For backend services

- `rxjs`: For reactive programming

- `marked`: For markdown processing

- `dompurify`: For sanitizing HTML content

## Browser Support

The application is built with modern web technologies and supports the latest versions of:

- Chrome

- Firefox

- Safari

- Edge

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT
