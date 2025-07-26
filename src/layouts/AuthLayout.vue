<template>
  <div class="column flex-center window-height" style="width: 100%">
    <!-- Left image -->
    <q-img
      src="/src/assets/auth.svg"
      style="max-width: 350px; max-height: 350px"
      spinner-color="primary"
      v-if="$q.screen.gt.sm"
    />

    <!-- Right form area -->
    <div class="column">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
