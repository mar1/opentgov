<!-- components/FilterTags.vue -->
<!--
  FilterTags component displays a row of filter buttons that allow users to filter content.
  Each button represents a filter tag (e.g., 'Newest', 'Ended') and emits a 'filter' event
  when clicked to notify the parent component of the selected filter.
-->
<template>
  <!-- Container for filter tag buttons with centered layout and spacing -->
  <div class="flex justify-center space-x-2 mb-6">
    <!--
      Dynamic button generation for each filter tag
      - Emits 'filter' event with the selected tag
      - Applies different styles based on whether the tag is active
    -->
    <button
      v-for="tag in tags"
      :key="tag"
      @click="$emit('filter', tag)"
      :class="[
        'px-4 py-2 rounded-full text-md font-medium',
        activeTag === tag
          ? 'blueBg text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      ]"
    >
      {{ tag }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props definition
const props = defineProps({
  // Currently active filter tag
  activeTag: {
    type: String,
    required: true
  }
})

// Available filter tags
const tags = ref(['Newest', 'Ended'])

// Define events that this component can emit
defineEmits(['filter'])
</script>