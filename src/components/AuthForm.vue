<template>
  <div :style="{ width: $q.screen.lt.sm ? '100vw' : '400px' }">
    <q-card class="q-pa-lg" style="width: 100%">
      <q-card-section>
        <div class="text-h5 text-weight-medium text-center">{{ title }}</div>
        <div class="text-subtitle2 text-center q-mt-xs">{{ subtitle }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="emitSubmit">
          <q-input
            v-if="isRegister"
            v-model="email"
            label="Email"
            outlined
            dense
            type="email"
            :rules="[(val) => !!val || 'Email is required']"
            class="q-mb-md"
            autofocus
          />

          <q-input
            v-model="username"
            label="Username"
            outlined
            dense
            :rules="[(val) => !!val || 'Username is required']"
            class="q-mb-md"
          />

          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
            dense
            :rules="[(val) => !!val || 'Password is required']"
            class="q-mb-md"
          />

          <q-input
            v-if="isRegister"
            v-model="repassword"
            label="Confirm Password"
            type="password"
            outlined
            dense
            :rules="[
              (val) => !!val || 'Please confirm your password',
              (val) => val === password || 'Passwords do not match',
            ]"
            class="q-mb-md"
          />

          <q-banner v-if="errorMessage" class="bg-red-1 text-negative q-mb-md" dense rounded>
            {{ errorMessage }}
          </q-banner>

          <q-btn
            type="submit"
            :label="submitLabel"
            color="primary"
            class="full-width q-mt-sm"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps<{
  title: string;
  subtitle?: string;
  isRegister?: boolean;
  submitLabel?: string;
  loading?: boolean;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { email: string; username: string; password: string }): void;
}>();

const email = ref('');
const username = ref('');
const password = ref('');
const repassword = ref('');

const emitSubmit = () => {
  if (props.isRegister && password.value !== repassword.value) return;

  emit('submit', {
    email: email.value,
    username: username.value,
    password: password.value,
  });
};
</script>
