<!-- components/RightSection.vue -->
<!--
  RightSection Component
  Displays a grid of proposal cards with filtering capabilities and pagination.
  Features:
  - Two-column layout for proposals (single column on mobile)
  - Filtering by newest and ended proposals
  - Load more functionality
  - Vote percentage calculations
  - Amount formatting for different assets
-->
<template>
  <div class="p-8">
    <!-- Filter tags for proposal sorting -->
    <FilterTags :activeTag="activeFilter" @filter="setFilter" />
    <!-- Two-column grid layout for proposals -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Left column of proposals -->
      <div class="flex flex-col gap-4">
        <ProposalCard
          v-for="proposal in leftColumnProposals"
          :key="proposal.id"
          :proposal="proposal"
          :telegramLink="getTelegramLink(proposal.post_id)"
        />
      </div>
      <!-- Right column of proposals -->
      <div class="flex flex-col gap-4">
        <ProposalCard
          v-for="proposal in rightColumnProposals"
          :key="proposal.id"
          :proposal="proposal"
          :telegramLink="getTelegramLink(proposal.post_id)"
        />
      </div>
    </div>
    <!-- Load more button - only shown if there are more proposals to load -->
    <div class="mt-8 text-center" v-if="hasMoreProposals">
      <button
        @click="loadMoreProposals"
        class="px-6 py-2 blueBg text-white rounded-lg hover:bg-yellow-500 transition-colors"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ethers } from 'ethers'
import ProposalCard from './ProposalCard.vue'
import FilterTags from './FilterTags.vue'

// State management
const activeFilter = ref('Newest')
const proposals = ref([])
const visibleProposals = ref(10)
const totalProposals = ref(0)

/**
 * Calculates vote percentages for ayes and nays
 * @param {number} ayes - Number of aye votes
 * @param {number} nays - Number of nay votes
 * @returns {Object} Object containing formatted percentage strings for ayes and nays
 */
function calculateVotePercentages(ayes, nays) {
    // Calculate total votes
    ayes = parseInt(ayes)
    nays = parseInt(nays)
    const total = ayes + nays;

    // Calculate percentages
    const ayePercentage = ((ayes / total) * 100).toFixed(2); // rounding to 2 decimal places
    const nayPercentage = ((nays / total) * 100).toFixed(2); // rounding to 2 decimal places

    return {
        ayePercentage: `${ayePercentage}%`,
        nayPercentage: `${nayPercentage}%`,
    };
}

/**
 * Formats amount based on asset type
 * @param {string|number} amount - The amount to format
 * @param {string|number} assetId - The asset identifier
 * @returns {string} Formatted amount with appropriate currency symbol
 */
const formatAmount = (amount, assetId) => {
  // Handle null or undefined values
  if (amount === null || amount === undefined) {
    return '0 (Unknown Amount)';
  }

  try {
    if (assetId === null || assetId === undefined) {
      return `${parseInt(ethers.formatUnits(amount, 10)).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} DOT`;
    } else if (parseInt(assetId) === 1984 || parseInt(assetId) === 1337) {
      return `${parseInt(ethers.formatUnits(amount, 6)).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} USD`;
    }
    // Default case, shouldn't normally happen
    return `${amount} (Unknown Asset)`;
  } catch (error) {
    console.error('Error formatting amount:', error);
    return `${amount} (Format Error)`;
  }
}

/**
 * Generates Telegram link for a proposal
 * @param {number} postId - The proposal's post ID
 * @returns {string} Telegram link
 */
const getTelegramLink = (postId) => {
  return `https://t.me/opentgov/${postId}`
}

// Initialize component and fetch proposals
onMounted(async () => {
  const { $supabase } = useNuxtApp()

  let { data, error, count } = await $supabase
    .from('referendums')
    .select('*', { count: 'exact' })
    .order('post_id', { ascending: false })
    .limit(50)

  if (error) {
    console.error(error)
  } else {
    totalProposals.value = count
    // Apply formatAmount for each proposal
    proposals.value = data.map(proposal => ({
      ...proposal,
      formattedAmount: formatAmount(proposal.requestedAmount, proposal.assetId),
      formattedAye: calculateVotePercentages(proposal.ayes,proposal.nays).ayePercentage,
      formattedNay: calculateVotePercentages(proposal.ayes,proposal.nays).nayPercentage,
    }))
  }
})

// Filter and pagination handlers
const setFilter = (filter) => {
  activeFilter.value = filter
}

const loadMoreProposals = () => {
  visibleProposals.value += 10
}

// Computed properties for proposal management
const hasMoreProposals = computed(() => {
  return visibleProposals.value < proposals.value.length
})

/**
 * Filters and sorts proposals based on active filter
 * @returns {Array} Filtered and sorted proposals
 */
const filteredProposals = computed(() => {
  let sorted;
  switch (activeFilter.value) {
    case 'Newest':
      sorted = [...proposals.value].sort((a, b) => b.post_id - a.post_id)
      break;
    case 'Ended':
      sorted = proposals.value.filter(p => p.status === 'Executed')
      break;
    default:
      sorted = proposals.value
  }
  return sorted.slice(0, visibleProposals.value);
})

/**
 * Computed property for left column proposals
 * Returns all proposals on mobile, every other proposal on desktop
 */
const leftColumnProposals = computed(() => {
  const filtered = filteredProposals.value;
  if (process.client && window.innerWidth < 768) { // Mobile: return all proposals
    return filtered;
  }
  return filtered.filter((_, index) => index % 2 === 0);
});

/**
 * Computed property for right column proposals
 * Returns empty array on mobile, every other proposal on desktop
 */
const rightColumnProposals = computed(() => {
  const filtered = filteredProposals.value;
  if (process.client && window.innerWidth < 768) { // Mobile: return empty array
    return [];
  }
  return filtered.filter((_, index) => index % 2 === 1);
});
</script>

<style scoped>
.expanded {
  margin-top: 0 !important;
  height: 100vh !important;
}
</style>
