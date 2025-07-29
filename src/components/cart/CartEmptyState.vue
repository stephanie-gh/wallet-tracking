<template>
  <div class="text-center q-mt-xl">
    <q-spinner v-if="loading" color="primary" size="3em" />
    <div v-else class="text-grey">Your cart is empty.</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ loading: boolean }>();
</script>
