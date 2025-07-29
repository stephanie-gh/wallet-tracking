<template>
  <div>
    <div class="text-subtitle1 q-mb-sm">Pay with Wallet</div>
    <div class="text-subtitle2 text-grey">
      Wallet balance: <strong>{{ wallet.formattedBalance }}</strong>
      <q-btn
        v-if="wallet.balance < totalPrice"
        flat
        dense
        size="sm"
        color="primary"
        label="Top up wallet"
        class="q-ml-sm"
        @click="$router.push('/top-up')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWalletStore } from 'src/stores/wallet';
defineProps<{ totalPrice: number }>();
const wallet = useWalletStore();
</script>
