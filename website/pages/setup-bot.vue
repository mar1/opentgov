<!-- pages/setup-bot.vue -->
<!-- Main setup guide page for the OpenGov Telegram voting bot -->
<template>
  <!-- Main container with dark theme styling -->
  <div class="min-h-screen bg-gray-800 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Page header with emoji and styled title -->
      <h1 class="text-4xl font-extrabold mb-8">
        🗳️ <span class="yellow">Setup</span> Your Own Telegram Voting Bot
      </h1>

      <!-- Main content container with inverted prose styling -->
      <div class="prose prose-invert max-w-none">
        <!-- Introduction section -->
        <p class="text-xl mb-6">
          Learn how to set up your own Telegram bot to participate in Polkadot governance voting. Your governance proxy account's private key never leaves your machine, ensuring maximum security.
        </p>

        <!-- How it Works section with security note -->
        <div class="bg-gray-700 p-6 rounded-lg mb-8">
          <h2 class="text-2xl font-bold mb-4 yellow">How it Works</h2>
          <p class="mb-4">The bot operates using the secure governance proxy account:</p>
          <ol class="list-decimal pl-6 space-y-2">
            <li>You create a governance proxy account that has control over your main wallet's voting power</li>
            <li>You run a Telegram bot locally on your computer that only you control</li>
            <li>The bot uses the proxy account's mnemonic to sign transactions</li>
            <li>When you vote through Telegram, the bot creates and signs the transaction using your proxy account</li>
            <li>Your main account's voting power is used, but the governance proxy account's private key never leaves your device</li>
            <li>The bot is secured with your Telegram user ID, ensuring only you can interact with it</li>
          </ol>
          <div class="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-500/20">
            <p class="font-semibold text-green-300 mb-2">🔒 Security Note</p>
            <p class="text-green-100">The governance proxy account you create can only vote on your behalf. It cannot transfer or move your funds, ensuring your assets remain secure even if the proxy account is compromised.</p>
          </div>
        </div>

        <!-- Prerequisites section -->
        <div class="bg-gray-700 p-6 rounded-lg mb-8">
          <h2 class="text-2xl font-bold mb-4 blue">▶️ Prerequisites</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>A Telegram account</li>
            <li><a href="https://nodejs.org/en/download/" target="_blank" class="text-yellow-400 hover:text-yellow-300">Node.js</a> (v16 or higher) installed on your system</li>
            <li>A Polkadot account with voting power</li>
            <li>20 DOT in your main account to lock for the governance proxy account</li>
            <li>Basic understanding of command line operations</li>
          </ul>
        </div>

        <!-- Step-by-step setup instructions -->
        <div class="space-y-8">
          <!-- Step 1: Download instructions -->
          <section>
            <h2 class="text-2xl font-bold mb-4">1. Download the Bot Code</h2>
            <p class="mb-4">Get the bot code on your computer:</p>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Click this link to download the bot: <a href="https://github.com/mar1/opentgov/archive/refs/heads/main.zip" target="_blank" class="text-yellow-400 hover:text-yellow-300">Download Bot</a></li>
              <li>Once downloaded, find the zip file in your Downloads folder</li>
              <li>Double-click the zip file to extract it</li>
              <li>Open the extracted folder named "opentgov-main"</li>
              <li>Inside that folder, you'll find a folder named "bot" - that's what we need</li>
            </ol>
          </section>

          <!-- Step 2: Installation guide -->
          <section>
            <h2 class="text-2xl font-bold mb-4">2. Install Dependencies</h2>
            <p class="mb-4">Now we need to install the required software:</p>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Open Terminal (on Mac) or Command Prompt (on Windows)</li>
              <li>Type <code class="bg-gray-700 px-2 py-1 rounded">cd</code> followed by a space</li>
              <li>Drag and drop the "bot" folder into the terminal window</li>
              <li>Press Enter</li>
              <li>Type <code class="bg-gray-700 px-2 py-1 rounded">npm install</code> and press Enter</li>
              <li>Wait for the installation to complete</li>
            </ol>
          </section>

          <!-- Step 3: Telegram bot creation -->
          <section>
            <h2 class="text-2xl font-bold mb-4">3. Create Your Telegram Bot</h2>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Open Telegram and search for <a href="https://t.me/botfather" target="_blank" class="text-yellow-400 hover:text-yellow-300">@BotFather</a></li>
              <li>Send the <code class="bg-gray-600 px-2 py-1 rounded">/newbot</code> command</li>
              <li>Follow the instructions to create your bot</li>
              <li>Save the API token you receive, we will need it later to configure the .env file</li>
            </ol>
          </section>

          <!-- Step 4: Telegram user ID setup -->
          <section>
            <h2 class="text-2xl font-bold mb-4">4. Get Your Telegram User ID</h2>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Open Telegram and search for <a href="https://t.me/userinfobot" target="_blank" class="text-yellow-400 hover:text-yellow-300">@UserInfoBot</a></li>
              <li>Click "Start" or send <code class="bg-gray-700 px-2 py-1 rounded">/start</code> to the bot</li>
              <li>The bot will reply with your user information, including your user ID</li>
              <li>Copy the number shown as "Id:" - this is your Telegram user ID</li>
              <li>Save your Telegram ID, we will need it later to configure the .env file</li>
            </ol>
          </section>

          <!-- Step 5: Polkadot proxy account setup -->
          <section>
            <h2 class="text-2xl font-bold mb-4">5. Set Up Your Polkadot Governance Proxy Account</h2>
            <div class="mb-4 p-4 bg-gray-700/50 rounded-lg">
              <p class="text-gray-300 mb-2">💡 In order to create a governance proxy account, you need to lock 20 DOT. You can get them back when you remove the proxy.</p>
            </div>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Create a new account on <a href="https://polkadot.js.org/apps/#/accounts" target="_blank" class="text-yellow-400 hover:text-yellow-300">Polkadot.js Apps</a></li>
              <li>Save the mnemonic phrase securely, we will need it later to configure the .env file</li>
              <li>Fund this account with at least 1 DOT in order to pay for the proxy transaction</li>
              <li>Link your new account as a governance proxy to your main account (the one holding your voting power):
                <ol class="list-decimal pl-6 mt-2">
                  <li>Go to <a href="https://polkadot.js.org/apps/#/accounts/" target="_blank" class="text-yellow-400 hover:text-yellow-300">Accounts > Proxies</a></li>
                  <li>Select your main account</li>
                  <li>Click on the three dots, select "Add proxy", select your new account</li>
                  <li>Choose "Governance" as proxy type</li>
                  <li>Submit and sign the transaction</li>
                </ol>
              </li>
            </ol>
            <div class="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <NuxtImg src="/img/proxy_creation.png" class="rounded-lg shadow-lg w-full" />
              <p class="text-sm text-gray-400 mt-2 text-center">Screenshot showing the proxy creation process in Polkadot.js Apps</p>
            </div>
          </section>

          <!-- Step 6: Bot configuration -->
          <section>
            <h2 class="text-2xl font-bold mb-4">6. Configure Your Bot</h2>
            <p class="mb-4">Create a <code class="bg-gray-700 px-2 py-1 rounded">.env</code> file in the bot directory with the following variables:</p>
            <div class="mb-4 p-4 bg-gray-700/50 rounded-lg">
              <p class="text-gray-300 mb-2">💡 The <code class="bg-gray-600 px-2 py-1 rounded">.env</code> file is a simple text file. You can create it using any text editor (like Notepad, TextEdit, or VS Code). Just create a new file, save it as <code class="bg-gray-600 px-2 py-1 rounded">.env</code> (including the dot), and copy and fill in the content below into it.</p>
            </div>
            <pre class="bg-gray-700 p-4 rounded-lg overflow-x-auto">
BOT_TOKEN=your_telegram_bot_token // cf step 3
AUTHORIZED_USER_ID=your_telegram_user_id // cf step 4
POLKADOT_PROXY_MNEMONIC=your_governance_proxy_mnemonic_phrase // cf step 5
POLKADOT_RPC=wss://rpc.polkadot.io  # Optional, defaults to this</pre>
            <div class="mt-4 p-4 bg-red-900/30 rounded-lg">
              <p class="font-extrabold">⚠️ IMPORTANT:</p>
              <ul class="list-disc pl-6 space-y-2">
                <li>Set <b>AUTHORIZED_USER_ID</b> to your Telegram user ID to ensure only you can use the bot. You can get your user ID by messaging <a href="https://t.me/userinfobot" target="_blank" class="text-yellow-400 hover:text-yellow-300">@UserInfoBot</a> on Telegram.</li>
                <li>Set <b>POLKADOT_MNEMONIC</b> to the mnemonic phrase of your governance proxy account (the new account you just created), NOT your main account's mnemonic. The bot needs to sign transactions with the proxy account's key.</li>
              </ul>
            </div>
          </section>

          <!-- Step 7: Bot startup -->
          <section>
            <h2 class="text-2xl font-bold mb-4">7. Start the Bot</h2>
            <pre class="bg-gray-700 p-4 rounded-lg overflow-x-auto">
npm start</pre>
            <p class="mt-4">
              If you see a message like this in your terminal, congrats, your bot is running successfully:
            </p>
            <pre class="bg-gray-700 p-4 rounded-lg overflow-x-auto mt-2">
✅ Self-custodial OpenGov voting bot is running...
📱 To start using the bot, open Telegram and send /start to @your_bot_name</pre>
            <p class="mt-4">
              The bot will display its actual username instead of @your_bot_name. You can now open Telegram and start interacting with your bot!
            </p>
          </section>

          <!-- Step 8: Bot interaction -->
          <section>
            <h2 class="text-2xl font-bold mb-4">8. Open a Chat with Your Bot</h2>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Open Telegram</li>
              <li>Search for your bot's username</li>
              <li>Click on your bot to open a chat</li>
              <li>Send the <code class="bg-gray-700 px-2 py-1 rounded">/start</code> command to initialize the bot</li>
              <li>You should receive a welcome message confirming the bot is working</li>
            </ol>
            <div class="mt-4 p-4 bg-gray-700/50 rounded-lg">
              <p class="text-gray-300 mb-2">💡 If you don't see your bot in the search results, make sure you've started it correctly in the terminal and that you're using the correct username.</p>
            </div>
          </section>

          <!-- Bot commands reference -->
          <section>
            <h2 class="text-2xl font-bold mb-4">Available Commands</h2>
            <ul class="list-disc pl-6 space-y-2">
              <li><code class="bg-gray-700 px-2 py-1 rounded">/start</code> - Initialize the bot</li>
              <li><code class="bg-gray-700 px-2 py-1 rounded">/help</code> - Show help message</li>
              <li><code class="bg-gray-700 px-2 py-1 rounded">/vote &lt;proposal_id&gt; &lt;aye/nay&gt; &lt;balance&gt; [conviction]</code> - Vote on a referendum</li>
              <li><code class="bg-gray-700 px-2 py-1 rounded">/history</code> - View voting history</li>
              <li><code class="bg-gray-700 px-2 py-1 rounded">/balance</code> - Check your balance</li>
            </ul>
          </section>
        </div>

        <!-- Version information and changelog -->
        <div class="mt-12 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-lg border border-purple-500/20">
          <div class="flex items-center mb-4">
            <span class="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mr-3">v1.0.0-beta</span>
            <span class="text-purple-300 text-sm">Released May 2025</span>
          </div>
          <h2 class="text-2xl font-bold mb-4 text-purple-300">Changelog</h2>
          <div class="space-y-4">
            <div class="bg-purple-900/20 p-4 rounded-lg">
              <h3 class="font-semibold text-purple-200 mb-2">Initial Beta Release</h3>
              <ul class="list-disc pl-6 space-y-2 text-purple-100">
                <li>Self-custodial Telegram bot for OpenGov voting</li>
                <li>Secure proxy-based voting system</li>
                <li>User authentication via Telegram ID</li>
                <li>Local voting history storage</li>
                <li>Support for conviction voting</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Help and support section with navigation -->
        <div class="mt-12 bg-blue-900/30 p-6 rounded-lg">
          <h2 class="text-2xl font-bold mb-4">Need Help?</h2>
          <p class="mb-4">Join our community for support and updates:</p>
          <div class="flex space-x-4">
            <a href="https://t.me/opentgov" target="_blank" class="text-white hover:text-yellow-500 transition-colors">
              Telegram Channel
            </a>
            <a href="https://github.com/mar1/opentgov" target="_blank" class="text-white hover:text-yellow-500 transition-colors">
              GitHub Repository
            </a>
            <a href="https://wiki.polkadot.network/" target="_blank" class="text-white hover:text-yellow-500 transition-colors">
              Polkadot Wiki
            </a>
          </div>
          <div class="mt-6 pt-6 border-t border-gray-600">
            <NuxtLink to="/" class="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back to Home
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Page metadata setup -->
<script setup>
definePageMeta({
  layout: 'default'
})

// SEO Meta Tags
useHead({
  title: 'Setup Your Own Telegram Voting Bot - OpenTGov',
  meta: [
    {
      name: 'description',
      content: 'Learn how to set up your own Telegram bot to participate in Polkadot governance voting. Your governance proxy account\'s private key never leaves your machine, ensuring maximum security.'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Setup Your Own Telegram Voting Bot - OpenTGov'
    },
    {
      property: 'og:description',
      content: 'Learn how to set up your own Telegram bot to participate in Polkadot governance voting. Your governance proxy account\'s private key never leaves your machine, ensuring maximum security.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://opentgov.com/setup-bot'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Setup Your Own Telegram Voting Bot - OpenTGov'
    },
    {
      name: 'twitter:description',
      content: 'Learn how to set up your own Telegram bot to participate in Polkadot governance voting. Your governance proxy account\'s private key never leaves your machine, ensuring maximum security.'
    }
  ]
})
</script>