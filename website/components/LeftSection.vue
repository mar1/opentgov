<!-- components/LeftSection.vue -->
<!--
  LeftSection Component
  This component represents the left side of the landing page, containing:
  - Logo and branding
  - Main call-to-action button
  - Social media links
  - Mobile-responsive behavior with scroll-based hiding
-->
<template>
  <!-- Main container with responsive padding and mobile slide-up animation -->
  <div
    class="flex flex-col justify-center items-center h-full bg-gray-800 text-white p-4 md:p-8 transition-transform duration-300"
    :class="{ 'translate-y-[-100%]': isHidden }"
  >
    <!-- Logo section -->
    <div class="mb-4">
      <NuxtImg alt="OpenTGOV logo" src="/img/LOGO.PNG" class="w-24 md:w-40"></NuxtImg>
    </div>
    <!-- Brand name with styled underline -->
    <p class="text-3xl md:text-4xl font-extrabold yellow my-4">
      Opent<span class="underline blueDecoration decoration-dotted">gov</span>
    </p>
    <!-- Tagline and description -->
    <p class="text-xl md:text-2xl mb-4 text-center">
      <span class="font-bold italic blue">Your daily dose of Polkadot governance</span>
      <br>
      🗳️ Vote and discuss proposals on Telegram
    </p>
    <!-- Call-to-action button section -->
    <form @submit.prevent="submitForm" class="w-full max-w-sm">
      <div class="flex items-center py-2">
        <a href="https://t.me/opentgov" target="_blank" class="mx-auto">
        <button class="flex-shrink-0 blueBg hover:bg-yellow-500 text-xl md:text-2xl text-white py-2 md:py-3 px-4 font-extrabold rounded mx-auto" type="button">
          ✨ JOIN US
        </button>
      </a>
      </div>
    </form>
    <!-- Setup guide link -->
    <div class="mt-4 text-center">
      <NuxtLink to="/setup-bot" class="text-white hover:text-yellow-500 transition-colors underline">
        Learn how to setup your own voting bot
      </NuxtLink>
    </div>
    <!-- Social media links section -->
    <div class="flex justify-center space-x-6 mt-4">
      <!-- Twitter/X link -->
      <a href="https://x.com/opentgov" target="_blank" class="text-white hover:text-yellow-500 transition-colors">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
      </a>
      <!-- Telegram link -->
      <a href="https://t.me/opentgov" target="_blank" class="text-white hover:text-yellow-500 transition-colors">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.23 3.58-1.44 3.98-1.44.09 0 .28.02.4.12.11.08.14.19.16.27.02.07.01.24-.01.38z"></path>
        </svg>
      </a>
      <!-- GitHub link -->
      <a href="https://github.com/mar1/opentgov" target="_blank" class="text-white hover:text-yellow-500 transition-colors">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
// State management for mobile responsiveness
const isHidden = ref(false)
let lastScrollY = 0
let isMobile = false
let rightSection = null

// Handle scroll events to show/hide the left section on mobile
const handleScroll = (event) => {
  if (!isMobile) return

  const currentScrollY = event.target.scrollTop
  isHidden.value = currentScrollY > lastScrollY && currentScrollY > 1
  lastScrollY = currentScrollY
}

// Check if the device is mobile and setup scroll listeners accordingly
const checkMobile = () => {
  isMobile = window.innerWidth < 768 // 768px is the md breakpoint in Tailwind
  if (isMobile) {
    // Find the RightSection element
    rightSection = document.querySelector('.overflow-y-auto')
    if (rightSection) {
      rightSection.addEventListener('scroll', handleScroll)
    }
  } else {
    if (rightSection) {
      rightSection.removeEventListener('scroll', handleScroll)
    }
  }
}

// Watch for changes in isHidden state to adjust RightSection positioning
watch(isHidden, (newValue) => {
  if (isMobile && rightSection) {
    if (newValue) {
      rightSection.style.height = '100vh'
      rightSection.style.position = 'fixed'
      rightSection.style.top = '0'
      rightSection.style.left = '0'
      rightSection.style.width = '100%'
    } else {
      rightSection.style.height = ''
      rightSection.style.position = ''
      rightSection.style.top = ''
      rightSection.style.left = ''
      rightSection.style.width = ''
    }
  }
})

// Lifecycle hooks for setup and cleanup
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  if (rightSection) {
    rightSection.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('resize', checkMobile)
})
</script>
