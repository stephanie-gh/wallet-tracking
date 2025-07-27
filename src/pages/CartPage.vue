<template>
  <q-page class="q-pa-md bg-grey-2">
    <div style="max-width: 1200px; margin: 0 auto">
      <div class="text-h5 text-weight-bold q-my-md text-center">Shopping Cart</div>

      <div v-if="cartItems.length">
        <!-- Cart Items -->
        <q-card flat bordered class="q-my-md" v-for="item in cartItems" :key="item.productId">
          <q-card-section class="row items-center q-col-gutter-md">
            <!-- Product Image -->
            <div class="col-12 col-sm-2 flex flex-center">
              <q-img :src="item.image" contain style="width: 80px; object-fit: cover" />
            </div>

            <!-- Product Info -->
            <div class="col-12 col-sm-4">
              <div class="text-subtitle1">{{ item.title }}</div>
              <div class="text-caption text-grey">${{ item.price.toLocaleString() }}</div>
            </div>

            <!-- Quantity -->
            <div class="col-6 col-sm-2 flex items-center">
              <q-btn flat dense round color="primary" icon="remove" @click="decreaseQty(item)" />
              <div class="q-mx-sm">{{ item.quantity }}</div>
              <q-btn flat dense round color="primary" icon="add" @click="increaseQty(item)" />
            </div>

            <!-- Subtotal -->
            <div class="col-6 col-sm-2 text-weight-bold text-right">
              ${{ (item.price * item.quantity).toLocaleString() }}
            </div>

            <!-- Delete Button -->
            <div class="col-12 col-sm-2 text-right">
              <q-btn flat round icon="delete" color="red" @click="confirmDelete(item)" />
            </div>
          </q-card-section>
        </q-card>

        <!-- Cart Summary -->
        <q-card flat bordered class="q-pa-md bg-white" v-if="totalQuantity > 0">
          <div class="row justify-between items-center">
            <div class="text-subtitle1 text-weight-medium">Total:</div>
            <div class="text-h6 text-primary text-weight-bold">
              <span class="text-caption text-grey">({{ totalQuantity }} items)</span>
              ${{ totalPrice.toLocaleString() }}
            </div>
          </div>
          <q-btn
            label="Checkout"
            color="primary"
            class="full-width q-mt-md"
            unelevated
            @click="checkout"
          />
        </q-card>
      </div>

      <!-- Loading Spinner -->
      <div class="text-center q-my-md" v-else>
        <q-spinner-tail color="primary" size="xl" />
      </div>

      <q-dialog v-model="confirmDeleteDialog" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span
              >Are you sure you want to delete <strong>{{ selectedItem?.title }}</strong> from your
              cart?</span
            >
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Delete"
              color="negative"
              @click="removeItem(selectedItem?.productId)"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useTransactionStore } from 'src/stores/transaction';
import { useProductStore } from 'src/stores/product';
import type { MergedProduct } from 'src/stores/transaction';
import router from 'src/router';

const auth = useAuthStore();
const transaction = useTransactionStore();
const product = useProductStore();
const productStore = useProductStore();

const cartItems = ref<MergedProduct[]>([]);
const confirmDeleteDialog = ref(false);
const selectedItem = ref<MergedProduct | null>(null);
const totalQuantity = computed(() =>
  cartItems.value.reduce((total, item) => total + item.quantity, 0),
);

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchCurrentUser();
  }

  await Promise.all([productStore.getAllProduct(), transaction.getAllCarts(auth.user?.id)]);

  cartItems.value = Array.from(mergedByProductId.value);
});

const mergedByProductId = computed(() => {
  const productsInCart = transaction.carts;
  const allProducts = product.products;
  const mergedItems: MergedProduct[] = [];

  productsInCart.forEach((cart) => {
    cart.products.forEach((cartProduct) => {
      const productData = allProducts.find((p) => p.id === cartProduct.productId);
      if (productData) {
        mergedItems.push({
          ...cartProduct,
          ...productData,
        });
      }
    });
  });

  return mergeCartItems(mergedItems);
});

function mergeCartItems(items: MergedProduct[]) {
  const mergedMap = new Map();

  for (const item of items) {
    const existing = mergedMap.get(item.productId);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      mergedMap.set(item.productId, { ...item });
    }
  }

  return Array.from(mergedMap.values());
}

const totalPrice = computed(() =>
  cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0),
);

function increaseQty(item: MergedProduct) {
  item.quantity++;
}

function decreaseQty(item: MergedProduct) {
  if (item.quantity > 1) item.quantity--;
}

function confirmDelete(item: MergedProduct) {
  confirmDeleteDialog.value = true;
  selectedItem.value = item;
}

function removeItem(productId: number | undefined) {
  cartItems.value = cartItems.value.filter((item) => item.productId !== productId);
}

function checkout() {
  void router
    .push({
      name: 'payment',
      query: {
        total: totalPrice.value.toString(),
      },
    })
    .catch((err) => console.error(err));
}
</script>

<style scoped>
@media (max-width: 600px) {
  .q-card-section {
    text-align: center;
  }
}
</style>
