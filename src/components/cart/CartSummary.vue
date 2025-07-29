<template>
  <q-card flat bordered class="q-pa-md bg-white">
    <div class="row justify-between items-center">
      <div class="text-subtitle1 text-weight-medium">Total:</div>
      <div class="text-h6 text-primary text-weight-bold">
        <span class="text-caption text-grey">({{ quantity }} items)</span>
        ${{ total.toFixed(2) }}
      </div>
    </div>
    <q-btn
      label="Checkout"
      color="primary"
      class="full-width q-mt-md"
      unelevated
      @click="router.push('/payment')"
    />
  </q-card>
</template>

<script setup lang="ts">
import router from 'src/router';

defineProps<{
  quantity: number;
  total: number;
}>();
</script>
