<template>
  <q-page class="q-pa-md">
    <div class="text-h5">Welcome to Home Page</div>
    <q-btn color="negative" label="Logout" @click="logout" class="q-mt-md" />
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

const auth = useAuthStore();
const router = useRouter();

const logout = async () => {
  auth.logout();
  await router.push('/login');
};
</script>
