<template>
  <div>
    <div class="text-subtitle1 q-mb-sm">Pay with Card</div>
    <q-input v-model="cardNumber" label="Card Number" outlined class="q-mb-md" />
    <q-input v-model="nameOnCard" label="Name on Card" outlined class="q-mb-md" />
    <q-input v-model="expiry" label="Expiry (MM/YY)" outlined class="q-mb-md" />
    <q-input v-model="cvv" label="CVV" type="password" outlined class="q-mb-md" />
  </div>
</template>

<script setup lang="ts">
const cardNumber = defineModel<string>('cardNumber');
const nameOnCard = defineModel<string>('nameOnCard');
const expiry = defineModel<string>('expiry');
const cvv = defineModel<string>('cvv');
</script>
