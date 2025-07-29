<template>
  <div class="row justify-between items-center q-mb-md">
    <div class="text-subtitle2">Total to Pay:</div>
    <div class="text-h6 text-primary text-weight-bold">${{ totalPrice.toFixed(2) }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ totalPrice: number }>();
</script>
