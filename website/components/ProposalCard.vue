<!--
  ProposalCard.vue
  A reusable component that displays a detailed card view of a governance proposal/referendum.
  Features:
  - Displays proposal metadata (ID, title, status, track)
  - Shows financial information (requested amount)
  - Displays proposer details
  - Shows voting tally (if available)
  - Renders markdown description with sanitization
  - Provides links to discussion and full proposal
-->
<template>
  <div>
    <!-- Main card container with hover effects and styling -->
    <div class="bg-gray-800 rounded-lg p-6 text-white hover:bg-gray-900 transition-all duration-200 transform hover:scale-[1.02] blueBorder">
      <!-- Header section with proposal ID and title -->
      <div class="border-b-2 border-gray-700 pb-2 mb-4">
        <h2 class="text-xl font-bold">🗳 Referendum #{{ proposal.post_id }}</h2>
        <p class="font-semibold yellow">{{ proposal.title }}</p>
      </div>

      <div class="space-y-4">
        <!-- Overview section with key proposal details -->
        <section>
          <h3 class="text-lg font-semibold mb-2">ℹ️ Overview</h3>
          <ul class="list-disc list-inside">
            <li>Status: <span class="font-bold">{{ proposal.status }}</span></li>
            <li>Track: <span class="font-bold">{{ proposal.topic_name }}</span></li>
            <li>Requested: <span class="font-bold">{{ proposal.formattedAmount }}</span></li>
          </ul>
        </section>

        <!-- Proposer information section -->
        <section>
          <h3 class="text-lg font-semibold mb-2">👤 Proposer</h3>
          <p class="break-all">→ {{ proposal.proposer_name }}</p>
        </section>

        <!-- Voting tally section - only shown if voting data is available -->
        <section v-if="proposal.formattedAye !== 'NaN%'">
          <h3 class="text-lg font-semibold mb-2">📊 Current Tally</h3>
          <ul class="list-disc list-inside">
            <li>✅ Ayes: <span class="font-bold">{{ proposal.formattedAye }}</span></li>
            <li>❌ Nays: <span class="font-bold">{{ proposal.formattedNay }}</span></li>
          </ul>
        </section>

        <!-- Description section with markdown rendering and action buttons -->
        <section>
          <h3 class="text-lg font-semibold mb-2">📝 Description</h3>
          <div class="text-sm markdown-content" v-html="formatDescription(proposal.description)"></div>
          <!-- Action buttons for discussion and full proposal -->
          <div class="mt-4 flex flex-row justify-center gap-4">
            <a
              :href="telegramLink"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 text-center px-4 py-2 blueBg text-white rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Discuss on Telegram
            </a>
            <a
              :href="`https://polkadot.polkassembly.io/referenda/${proposal.post_id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 text-center px-4 py-2 blueBg text-white rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Read the full proposal
            </a>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Component props definition
const props = defineProps({
  proposal: {
    type: Object,
    required: true
  }
})

// Computed property for Telegram discussion link
const telegramLink = computed(() => `https://t.me/opentgov/${props.proposal.thread_id}`)

/**
 * Formats and sanitizes the proposal description
 * @param {string} desc - The raw markdown description
 * @returns {string} - Sanitized HTML with truncated content if needed
 */
const formatDescription = (desc) => {
  if (!desc) return ''

  // Truncate markdown text first
  const maxLength = 750
  let truncatedDesc = desc
  if (desc.length > maxLength) {
    // Find the last complete word before maxLength
    const lastSpace = desc.lastIndexOf(' ', maxLength)
    truncatedDesc = desc.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...'
  }

  // Configure marked options for markdown parsing
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false
  })

  // Convert markdown to HTML and sanitize to prevent XSS
  const html = marked(truncatedDesc)
  return DOMPurify.sanitize(html)
}
</script>

<style scoped>
/* Base markdown content styling */
.markdown-content {
  max-width: none;
}

/* Heading styles for markdown content */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

/* Paragraph and list styling */
.markdown-content :deep(p) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  list-style-type: disc;
  list-style-position: inside;
  margin-left: 1rem;
  margin-bottom: 0.5rem;
}

/* Link styling */
.markdown-content :deep(a) {
  color: #60a5fa;
  text-decoration: underline;
}

.markdown-content :deep(a:hover) {
  color: #93c5fd;
}

/* Text formatting */
.markdown-content :deep(strong) {
  font-weight: bold;
}

.markdown-content :deep(em) {
  font-style: italic;
}

/* Code block styling */
.markdown-content :deep(code) {
  background-color: #374151;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.markdown-content :deep(pre) {
  background-color: #374151;
  padding: 0.5rem;
  border-radius: 0.25rem;
  overflow-x: auto;
}

/* Blockquote styling */
.markdown-content :deep(blockquote) {
  border-left: 4px solid #4b5563;
  padding-left: 1rem;
  font-style: italic;
}
</style>
