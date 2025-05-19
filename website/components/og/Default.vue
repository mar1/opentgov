<!-- components/og/Default.vue -->
<template>
  <div class="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 p-12">
    <div class="flex flex-col items-center justify-center text-center">
      <h1 class="text-6xl font-bold text-white mb-4">
        OpenTGov
      </h1>
      <p class="text-2xl text-gray-300 max-w-2xl">
        Telegram Voting Bot for Polkadot Governance
      </p>
    </div>
  </div>
</template>

<script setup>
defineOgImage({
  title: 'OpenTGov - Telegram Voting Bot for Polkadot Governance',
  description: 'Set up your own Telegram bot to participate in Polkadot governance voting. Secure, self-custodial, and easy to use.',
})
</script>