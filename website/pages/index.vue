<!-- Main layout container with responsive design -->
<template>
  <div class="flex flex-col md:flex-row h-screen">
    <!-- Left section: Fixed on desktop, full width on mobile -->
    <LeftSection class="w-full md:w-1/2 md:fixed md:left-0 md:top-0 h-auto md:h-full" />
    <!-- Right section: Scrollable content area -->
    <RightSection class="w-full md:w-1/2 md:ml-auto overflow-y-auto h-full" />
  </div>
</template>

<script setup>
// SEO meta tags configuration for better search engine visibility and social sharing
useSeoMeta({
  title: 'Opentgov - Polkadot governance made easy',
  ogTitle: 'Opentgov',
  description: 'Empowering voters to engage with Polkadot OpenGov via Telegram',
  ogDescription: 'Empowering voters to engage with Polkadot OpenGov via Telegram',
  ogImage: 'https://opentgov.com/img/logo.png',
  twitterCard: 'summary_large_image',
})

// Import main layout components
import LeftSection from '~/components/LeftSection.vue'
import RightSection from '~/components/RightSection.vue'
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>