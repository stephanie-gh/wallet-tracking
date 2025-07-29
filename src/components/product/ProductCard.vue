<template>
  <q-card class="my-card flex flex-center q-py-md horizontal" bordered hoverable>
    <img
      :src="product.image"
      class="rounded-borders"
      style="width: 150px; height: 150px; object-fit: fill"
    />

    <q-card-section class="q-pt-sm full-width q-px-md">
      <q-chip color="grey-2" text-color="primary" size="sm" class="q-mb-xs">{{
        product.category
      }}</q-chip>
      <div class="text-h6 q-my-xs">{{ shortenedTitle }}</div>
      <div class="row no-wrap items-center q-mb-sm">
        <q-rating size="18px" :model-value="product.rating.rate" :max="5" color="orange" />
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
        @click="onAddToCart"
      />
      <q-btn
        push
        size="sm"
        label="Detail"
        color="blue"
        icon="info"
        @click="$emit('open-detail', product)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import type { Product } from 'src/stores/product';
import { computed } from 'vue';

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits(['open-detail', 'add-to-cart']);

const onAddToCart = () => {
  emit('add-to-cart', props.product);
};

const shortenedTitle = computed(() =>
  props.product.title.length > 22
    ? props.product.title.substring(0, 22) + '..'
    : props.product.title,
);
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 320px;
  transition: all 0.2s ease-in-out;
}
.my-card:hover {
  transform: scale(1.05);
}
</style>
