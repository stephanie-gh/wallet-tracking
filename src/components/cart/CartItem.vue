<template>
  <q-card flat bordered class="q-my-md">
    <q-card-section class="row items-center q-col-gutter-md">
      <div class="col-12 col-sm-2 flex flex-center">
        <q-img :src="props.item.image" contain style="width: 80px; object-fit: cover" />
      </div>

      <div class="col-12 col-sm-4">
        <div class="text-subtitle1">{{ props.item.title }}</div>
        <div class="text-caption text-grey">${{ props.item.price.toLocaleString() }}</div>
      </div>

      <div class="col-6 col-sm-2 flex items-center">
        <q-btn
          flat
          dense
          round
          color="primary"
          icon="remove"
          @click="transaction.decreaseQty(props.item.productId)"
        />
        <div class="q-mx-sm">{{ props.item.quantity }}</div>
        <q-btn
          flat
          dense
          round
          color="primary"
          icon="add"
          @click="transaction.increaseQty(props.item.productId)"
        />
      </div>

      <div class="col-6 col-sm-2 text-weight-bold text-right">
        ${{ (props.item.price * props.item.quantity).toLocaleString() }}
      </div>

      <div class="col-12 col-sm-2 text-right">
        <q-btn
          flat
          round
          icon="delete"
          color="red"
          @click="transaction.removeItem(props.item.productId)"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { MergedProduct } from 'src/stores/transaction';
import { useTransactionStore } from 'src/stores/transaction';

const props = defineProps<{
  item: MergedProduct;
}>();

const transaction = useTransactionStore();
</script>
