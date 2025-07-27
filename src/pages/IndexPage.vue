<template>
  <q-page padding class="bg-grey-2">
    <div class="flex flex-row justify-center text-h5 text-weight-bold q-my-md">Product List</div>

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
        <q-card class="my-card flex flex-center q-py-md horizontal" bordered hoverable>
          <img
            :src="product.image"
            class="rounded-borders"
            style="width: 150px; height: 150px; object-fit: fill"
          />

          <q-card-section class="q-pt-sm full-width q-px-md">
            <q-chip color="grey-2" text-color="primary" size="sm" class="q-mb-xs">
              {{ product.category }}
            </q-chip>
            <div class="text-h6 q-my-xs">
              {{ product.title.substring(0, 22) + (product.title.length > 22 ? '..' : '') }}
            </div>
            <div class="row no-wrap items-center q-mb-sm">
              <q-rating size="18px" v-model="product.rating.rate" :max="5" color="orange" />
              <span class="text-caption text-grey q-ml-sm"
                >{{ product.rating.rate }} ({{ product.rating.count }})</span
              >
            </div>
          </q-card-section>

          <q-card-actions class="full-width q-px-md flex items-center">
            <div class="text-bold text-h6 q-mt-sm">${{ product.price }}</div>

            <q-space />

            <q-btn
              push
              size="sm"
              label="Add to Cart"
              color="blue"
              icon="shopping_cart"
              @click="addToCart(product, 1)"
            />
            <q-btn
              push
              size="sm"
              label="Detail"
              color="blue"
              icon="info"
              @click="
                detailDialog = true;
                selectedProduct = product;
              "
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="detailDialog" v-if="selectedProduct">
      <q-card>
        <q-card-section class="flex flex-center">
          <img
            :src="selectedProduct.image"
            class="rounded-borders"
            style="width: 250px; object-fit: cover"
          />
        </q-card-section>

        <q-card-section class="q-pt-sm full-width q-px-md">
          <q-chip color="grey-2" text-color="primary" size="sm" class="q-mb-xs">
            {{ selectedProduct.category }}
          </q-chip>
          <div class="text-h6 q-my-xs">
            {{ selectedProduct.title }}
          </div>
          <div class="row no-wrap items-center q-mb-sm">
            <q-rating size="18px" v-model="selectedProduct.rating.rate" :max="5" color="orange" />
            <span class="text-caption text-grey q-ml-sm"
              >{{ selectedProduct.rating.rate }} ({{ selectedProduct.rating.count }})</span
            >
          </div>
          <div class="text-grey text-sm">{{ selectedProduct.description }}</div>

          <div class="text-bold text-h6 q-mt-sm" v-if="$q.screen.lt.sm">
            ${{ selectedProduct.price }}
          </div>
        </q-card-section>

        <q-card-actions class="full-width q-px-md flex justify-between">
          <div class="text-bold text-h6 q-mt-sm" v-if="$q.screen.gt.sm">
            ${{ selectedProduct.price }}
          </div>

          <q-space v-if="$q.screen.gt.sm" />

          <div class="quantity-wrapper q-mr-md">
            <q-btn
              round
              dense
              flat
              icon="remove"
              :disable="quantity <= 1"
              @click="quantity--"
              color="primary"
            />
            <div class="quantity-value">{{ quantity }}</div>
            <q-btn round dense flat icon="add" @click="quantity++" color="primary" />
          </div>

          <q-btn
            push
            size="sm"
            label="Add to Cart"
            color="blue-14"
            icon="shopping_cart"
            @click="addToCart(selectedProduct, quantity)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div v-if="!filteredProducts.length" class="text-center text-grey q-mt-xl">
      No products found.
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Product } from 'src/stores/product';
import { useProductStore } from 'src/stores/product';
import { useTransactionStore } from 'src/stores/transaction';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const auth = useAuthStore();
const productStore = useProductStore();
const transactionStore = useTransactionStore();
const $q = useQuasar();

const search = ref('');
const selectedCategory = ref(null);
const sortOrder = ref('');
const detailDialog = ref(false);
const selectedProduct = ref<Product>();
const quantity = ref(1);

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

const addToCart = async (product: Product, quantity: number) => {
  const productItems = Array.from({ length: quantity }, () => product);
  await transactionStore.addNewCart(auth.user?.id, productItems);

  $q.notify({
    position: 'top',
    color: 'positive',
    textColor: 'white',
    icon: 'check',
    message: 'Added to cart',
  });
  detailDialog.value = false;
};

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchCurrentUser();
  }

  await productStore.getAllProduct();
  productStore.products.forEach((p) => (p.expanded = false));
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 320px
  transition: all 0.2s ease-in-out

  &:hover
    transform: scale(1.05)

.quantity-wrapper
  display: flex
  align-items: center
  gap: 12px
  padding: 4px 0

.quantity-value
  min-width: 30px
  text-align: center
  font-weight: bold
  font-size: 16px

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
