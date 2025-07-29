<template>
  <!-- <div style="max-width: 1200px; margin: 0 auto"> -->
  <div class="text-h5 text-weight-bold text-center q-mb-md">{{ title }}</div>
  <!-- </div> -->
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
