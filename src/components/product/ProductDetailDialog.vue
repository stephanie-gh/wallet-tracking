<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card v-if="product">
      <q-card-section class="flex flex-center">
        <img :src="product.image" class="rounded-borders" style="width: 250px; object-fit: cover" />
      </q-card-section>

      <q-card-section class="q-pt-sm full-width q-px-md">
        <q-chip color="grey-2" text-color="primary" size="sm" class="q-mb-xs">{{
          product.category
        }}</q-chip>
        <div class="text-h6 q-my-xs">{{ product.title }}</div>
        <div class="row no-wrap items-center q-mb-sm">
          <q-rating size="18px" :model-value="product.rating.rate" :max="5" color="orange" />
          <span class="text-caption text-grey q-ml-sm"
            >{{ product.rating.rate }} ({{ product.rating.count }})</span
          >
        </div>
        <div class="text-grey text-sm">{{ product.description }}</div>
        <div class="text-bold text-h6 q-mt-sm" v-if="$q.screen.lt.sm">${{ product.price }}</div>
      </q-card-section>

      <q-card-actions class="full-width q-px-md flex justify-between">
        <div class="text-bold text-h6 q-mt-sm" v-if="$q.screen.gt.sm">${{ product.price }}</div>
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
          @click="onAddToCart"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from 'src/stores/product';
import { useQuasar } from 'quasar';

const props = defineProps<{
  modelValue: boolean;
  product: Product | undefined;
}>();
const emit = defineEmits(['update:modelValue', 'add-to-cart']);

const quantity = ref(1);
const $q = useQuasar();

const onAddToCart = () => {
  emit('add-to-cart', props.product, quantity.value);
  emit('update:modelValue', false);
  quantity.value = 1;
};
</script>

<style scoped>
.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}
.quantity-value {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
