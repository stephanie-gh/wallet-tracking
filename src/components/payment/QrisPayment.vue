<template>
  <div>
    <div class="text-subtitle1 q-mb-sm">Pay with QRIS</div>
    <div class="text-caption text-grey q-mb-sm">Scan this QR to complete the payment:</div>
    <q-img
      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DUMMY_PAYMENT_QRIS"
      style="width: 200px; margin: 0 auto"
      class="q-mb-md"
    />
  </div>
</template>
