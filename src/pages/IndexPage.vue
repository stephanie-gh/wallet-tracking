<template>
  <q-page padding class="bg-grey-2">
    <div style="margin: 0 auto">
      <HeaderComponent title="Products" />

      <!-- Controls: Search, Filter, Sort -->
      <div class="q-pa-md" v-if="$q.screen.gt.sm">
        <div
          class="q-gutter-md q-mb-md flex flex-col sm:flex-row justify-center items-stretch sm:items-center"
        >
          <!-- Search -->
          <q-input
            dense
            outlined
            debounce="300"
            class="filter-card"
            v-model="search"
            placeholder="Search product..."
            clearable
          />

          <!-- Filter by Category -->
          <q-select
            dense
            outlined
            class="filter-card"
            v-model="selectedCategory"
            :options="categories"
            option-label="label"
            option-value="value"
            clearable
            label="Category"
            emit-value
            map-options
            behavior="menu"
          />

          <!-- Sort by Price -->
          <q-select
            dense
            outlined
            class="filter-card"
            v-model="sortOrder"
            :options="[
              { label: 'Lowest Price', value: 'asc' },
              { label: 'Highest Price', value: 'desc' },
            ]"
            clearable
            label="Sort by Price"
            emit-value
            map-options
            behavior="menu"
          />
        </div>
      </div>
      <div class="q-pa-md" v-else>
        <!-- Mobile Filter Panel -->
        <q-expansion-item
          icon="filter_alt"
          label="Filter Products"
          dense
          class="bg-grey-1 rounded-borders"
          expand-icon="arrow_drop_down"
          header-class="text-primary text-weight-medium"
        >
          <div class="q-gutter-md q-mt-md">
            <!-- Search -->
            <q-input
              dense
              outlined
              debounce="300"
              v-model="search"
              placeholder="Search product..."
              clearable
              prepend-inner-icon="search"
            />

            <!-- Filter by Category -->
            <q-select
              dense
              outlined
              v-model="selectedCategory"
              :options="categories"
              option-label="label"
              option-value="value"
              clearable
              label="Category"
              emit-value
              map-options
            />

            <!-- Sort by Price -->
            <q-select
              dense
              outlined
              v-model="sortOrder"
              :options="[
                { label: 'Lowest Price', value: 'asc' },
                { label: 'Highest Price', value: 'desc' },
              ]"
              clearable
              label="Sort by Price"
              emit-value
              map-options
            />
          </div>
        </q-expansion-item>
      </div>

      <!-- Product Grid -->
      <div class="flex flex-row q-gutter-md justify-center items-center">
        <div v-for="product in filteredProducts" :key="product.id">
          <ProductCard :product="product" @open-detail="openDetail" @add-to-cart="addToCart" />
        </div>
      </div>

      <!-- Detail Dialog -->
      <ProductDetailDialog
        v-model="detailDialog"
        :product="selectedProduct"
        @add-to-cart="addToCart"
      />

      <div v-if="!filteredProducts.length" class="text-center text-grey q-mt-xl">
        No products found.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import HeaderComponent from 'src/components/HeaderComponent.vue';
import ProductCard from 'src/components/product/ProductCard.vue';
import ProductDetailDialog from 'src/components/product/ProductDetailDialog.vue';

import { useProductStore } from 'src/stores/product';
import { useTransactionStore } from 'src/stores/transaction';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import type { Product } from 'src/stores/product';

const $q = useQuasar();
const auth = useAuthStore();
const productStore = useProductStore();
const transactionStore = useTransactionStore();

const search = ref('');
const selectedCategory = ref(null);
const sortOrder = ref('');
const detailDialog = ref(false);
const selectedProduct = ref<Product>();

// Unique categories for dropdown
const categories = computed(() => {
  const cats = productStore.products.map((p) => p.category);
  const unique = [...new Set(cats)];
  return unique.map((c) => ({ label: c, value: c }));
});

// Filtering + sorting
const filteredProducts = computed(() => {
  let result = [...productStore.products];

  // Search
  if (search.value) {
    const keyword = search.value.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(keyword));
  }

  // Filter category
  if (selectedCategory.value) {
    result = result.filter((p) => p.category === selectedCategory.value);
  }

  // Sort
  result.sort((a, b) => {
    if (sortOrder.value === 'asc') {
      return a.price - b.price;
    } else if (sortOrder.value === 'desc') {
      return b.price - a.price;
    }
    return 0;
  });

  return result;
});

const addToCart = (product: Product, quantity = 1) => {
  transactionStore.addNewCart(product, quantity);
  $q.notify({
    position: 'top',
    color: 'positive',
    textColor: 'white',
    icon: 'check',
    message: 'Added to cart',
  });
  detailDialog.value = false;
};

const openDetail = (product: Product) => {
  selectedProduct.value = product;
  detailDialog.value = true;
};

onMounted(async () => {
  if (!auth.user) await auth.fetchCurrentUser();
  await productStore.getAllProduct();
});
</script>

<style lang="sass" scoped>
.filter-card
  width: 100%
  max-width: 250px
  transition: all 0.2s ease-in-out
  background-color: white
  border-radius: 12px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06)


@media (min-width: 600px)
  .filter-card
    width: 250px
</style>
