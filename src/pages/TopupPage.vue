<template>
  <q-page class="q-pa-md bg-grey-1">
    <div style="max-width: 600px; margin: 0 auto">
      <q-btn flat dense icon="arrow_back" color="grey" label="Back" @click="$router.go(-1)" />
      <HeaderComponent title="Top Up Wallet" />

      <!-- Current Balance -->
      <q-card flat bordered class="q-pa-md q-mb-md">
        <div class="text-subtitle1">Current Balance:</div>
        <div class="text-h6 text-primary text-weight-bold">
          {{ wallet.formattedBalance }}
        </div>
      </q-card>

      <!-- Top Up Input -->
      <q-card flat bordered class="q-pa-md">
        <q-form @submit="handleTopUp">
          <q-input
            v-model.number="amount"
            type="number"
            label="Top Up Amount"
            outlined
            dense
            min="1"
            class="q-mb-md"
          />

          <q-btn
            label="Top Up"
            color="primary"
            unelevated
            class="full-width"
            type="submit"
            :loading="isLoading"
            :disable="!amount || amount <= 0"
          />
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWalletStore } from 'src/stores/wallet';
import { useQuasar } from 'quasar';
import router from 'src/router';
import HeaderComponent from 'src/components/HeaderComponent.vue';

const amount = ref<number>(0);
const wallet = useWalletStore();
const $q = useQuasar();
const isLoading = ref(false);

function handleTopUp() {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    try {
      wallet.add(amount.value);
      $q.notify({
        position: 'top',
        type: 'positive',
        message: `Successfully topped up $${amount.value.toLocaleString()}`,
      });
      amount.value = 0;
      router.go(-1);
    } catch (err) {
      console.log(err);
      $q.notify({
        position: 'top',
        type: 'negative',
        message: `Failed to top up. Please try again.`,
      });
    }
  }, 2000);
}
</script>
