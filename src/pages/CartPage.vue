<template>
  <q-page padding class="bg-grey-2">
    <div style="max-width: 1200px; margin: 0 auto">
      <HeaderComponent title="Shopping Cart" />

      <template v-if="transaction.mergedItems.length">
        <CartItem v-for="item in transaction.mergedItems" :key="item.productId" :item="item" />
        <q-separator class="q-my-md" />
      </template>

      <CartEmptyState v-else :loading="transaction.isLoading" />

      <CartSummary
        v-if="transaction.totalQuantity > 0"
        :quantity="transaction.totalQuantity"
        :total="transaction.totalPrice"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useProductStore } from 'src/stores/product';
import { useTransactionStore } from 'src/stores/transaction';
import HeaderComponent from 'src/components/HeaderComponent.vue';
import CartItem from 'src/components/cart/CartItem.vue';
import CartEmptyState from 'src/components/cart/CartEmptyState.vue';
import CartSummary from 'src/components/cart/CartSummary.vue';

const auth = useAuthStore();
const productStore = useProductStore();
const transaction = useTransactionStore();

onMounted(async () => {
  if (!auth.user) await auth.fetchCurrentUser();
  if (!transaction.mergedItems.length) {
    await productStore.getAllProduct();
    transaction.getMergedCartItems();
  }
});
</script>
