<script setup lang="ts">
import AuthLayout from 'src/layouts/AuthLayout.vue';
import AuthForm from 'src/components/AuthForm.vue';
import type { Login, Register } from 'src/stores/auth';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const tab = ref('login');
const auth = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async ({ username, password }: Login) => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await auth.login(username, password);
    await router.push('/');
  } catch (e: unknown) {
    errorMessage.value = (e as string) || 'Login failed';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async ({ email, username, password }: Register) => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await auth.register(email, username, password);
    await auth.login(username, password);
    $q.notify({
      position: 'top',
      icon: 'check',
      type: 'positive',
      message: 'Register & login success!',
    });
    await router.push('/');
  } catch (e: unknown) {
    errorMessage.value = (e as string) || 'Register failed';
    $q.notify({ position: 'top', icon: 'info', type: 'negative', message: 'Register failed' });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthLayout>
    <q-tabs
      v-model="tab"
      dense
      align="justify"
      :breakpoint="0"
      active-color="white"
      active-bg-color="primary"
      :style="{ width: $q.screen.lt.sm ? '100vw' : '400px' }"
    >
      <q-tab name="login" label="Login" />
      <q-tab name="register" label="Register" />
    </q-tabs>
    <AuthForm
      title="Login"
      subtitle="Welcome back!"
      :submit-label="'Login'"
      :loading="loading"
      :error-message="errorMessage"
      @submit="handleLogin"
      v-if="tab === 'login'"
    />
    <AuthForm
      title="Register"
      subtitle="Please register to continue"
      :submit-label="'Register'"
      :is-register="true"
      :loading="loading"
      :error-message="errorMessage"
      @submit="handleRegister"
      v-else-if="tab === 'register'"
    />
  </AuthLayout>
</template>
