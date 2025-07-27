<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar class="q-py-sm flex justify-between" style="max-width: 1200px; margin: 0 auto">
        <!-- Logo -->
        <div class="row items-center q-gutter-sm">
          <q-img src="/favicon.ico" width="35px" height="35px" fit="contain" />
        </div>

        <!-- Left nav (desktop only) -->
        <div class="row items-center q-gutter-sm q-ml-auto q-hidden md:flex" v-if="$q.screen.gt.sm">
          <q-btn
            push
            size="sm"
            icon="shopping_bag"
            label="Products"
            :class="buttonClass(route.path === '/')"
            @click="goTo('/')"
          />
          <q-btn
            push
            size="sm"
            icon="shopping_cart"
            label="Cart"
            :class="buttonClass(route.path === '/cart')"
            @click="goTo('/cart')"
            ><q-badge color="red" rounded floating>{{ totalQuantity }}</q-badge></q-btn
          >
          <q-btn
            push
            size="sm"
            icon="logout"
            label="Logout"
            color="red"
            class="hover-scale"
            @click="confirmLogout = true"
          />
        </div>

        <div class="row items-center q-gutter-sm q-ml-auto q-hidden md:flex" v-else>
          <q-btn
            push
            size="sm"
            icon="shopping_bag"
            :class="buttonClass(route.path === '/')"
            @click="goTo('/')"
          />
          <q-btn
            push
            size="sm"
            icon="shopping_cart"
            :class="buttonClass(route.path === '/cart')"
            @click="goTo('/cart')"
            ><q-badge color="red" rounded floating>{{ totalQuantity }}</q-badge></q-btn
          >
          <q-btn
            push
            size="sm"
            icon="logout"
            color="red"
            class="hover-scale"
            @click="confirmLogout = true"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Main content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Logout Confirmation -->
    <q-dialog v-model="confirmLogout" persistent backdrop-filter="blur(4px)">
      <q-card style="min-width: 300px">
        <q-card-section class="text-h6"> Are you sure you want to logout? </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Logout" color="negative" icon="logout" @click="logout" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useTransactionStore } from 'src/stores/transaction';
import type { Cart } from 'src/stores/transaction';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const transaction = useTransactionStore();
const $q = useQuasar();

const drawer = ref(false);
const confirmLogout = ref(false);
const totalQuantity = ref(0);

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchCurrentUser();
  }

  const carts = await transaction.getAllCarts(auth.user?.id);
  updateTotalQuantity(carts);
});

function updateTotalQuantity(orders: Cart[]) {
  totalQuantity.value = getTotalQuantity(orders);
}

function getTotalQuantity(orders: Cart[]) {
  return orders.reduce((total, order) => {
    const orderTotal = order.products.reduce((sum, product) => sum + product.quantity, 0);
    return total + orderTotal;
  }, 0);
}

const logout = async () => {
  auth.logout();
  $q.notify({ position: 'top', type: 'positive', icon: 'check', message: 'Logout success!' });
  await router.push('/login');
};

const goTo = async (path: string) => {
  drawer.value = false;
  await router.push(path);
};

const buttonClass = (isActive: boolean) => {
  return isActive ? 'bg-primary text-weight-medium text-white' : 'hover-scale';
};
</script>

<style scoped>
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}
</style>
