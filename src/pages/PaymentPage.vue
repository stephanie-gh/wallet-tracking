<template>
  <q-page class="q-pa-md bg-grey-1">
    <div style="max-width: 600px; margin: 0 auto">
      <q-card flat bordered class="q-pa-lg">
        <div class="text-h5 text-weight-bold text-center q-mb-md">Choose Payment Method</div>

        <q-option-group
          v-model="selectedMethod"
          :options="paymentMethods"
          color="primary"
          type="radio"
          class="q-mb-md"
        />

        <q-separator class="q-my-md" />

        <!-- Payment Content -->
        <div v-if="selectedMethod === 'card'">
          <div class="text-subtitle1 q-mb-sm">Pay with Card</div>
          <q-input v-model="cardNumber" label="Card Number" outlined class="q-mb-md" />
          <q-input v-model="nameOnCard" label="Name on Card" outlined class="q-mb-md" />
          <q-input v-model="expiry" label="Expiry (MM/YY)" outlined class="q-mb-md" />
          <q-input v-model="cvv" label="CVV" type="password" outlined class="q-mb-md" />
        </div>

        <div v-else-if="selectedMethod === 'va'">
          <div class="text-subtitle1 q-mb-sm">Pay via Virtual Account</div>
          <q-select
            v-model="selectedBank"
            :options="vaBanks"
            label="Select Bank"
            outlined
            class="q-mb-md"
          />
          <div v-if="selectedBank" class="text-caption text-grey">
            Virtual Account will be generated for <strong>{{ selectedBank }}</strong
            >.
          </div>
        </div>

        <div v-else-if="selectedMethod === 'qris'">
          <div class="text-subtitle1 q-mb-sm">Pay with QRIS</div>
          <div class="text-caption text-grey q-mb-sm">Scan this QR to complete the payment:</div>
          <q-img
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DUMMY_PAYMENT_QRIS"
            style="width: 200px; margin: 0 auto"
            class="q-mb-md"
          />
        </div>

        <q-separator class="q-my-md" />

        <!-- Total Summary -->
        <div class="row justify-between items-center q-mb-md">
          <div class="text-subtitle2">Total to Pay:</div>
          <div class="text-h6 text-primary text-weight-bold">${{ totalFormatted }}</div>
        </div>

        <q-btn
          label="Pay Now"
          color="primary"
          class="full-width"
          size="lg"
          unelevated
          @click="pay"
        />
      </q-card>

      <!-- Success Dialog -->
      <q-dialog v-model="dialog" persistent>
        <q-card>
          <q-card-section class="text-center">
            <div class="text-h6 text-weight-bold text-green">
              {{ selectedMethod === 'va' ? 'Virtual Account Generated!' : 'Payment Successful!' }}
            </div>

            <div v-if="selectedMethod === 'va'" class="q-mt-md">
              <div class="text-subtitle2 q-mb-sm">Bank: {{ vaBankLabel }}</div>
              <div class="text-h6 q-mb-xs">VA Number:</div>
              <div class="text-h5 text-weight-bold">
                {{ vaNumber }}
                <q-btn
                  icon="content_copy"
                  flat
                  round
                  dense
                  class="q-ml-sm"
                  @click="copyToClipboard(vaNumber)"
                />
              </div>
              <div class="text-caption text-grey q-mt-sm">Valid until: {{ vaExpiryTime }}</div>
              <q-separator class="q-my-md" />
              <div class="text-caption">
                Please complete payment via your bank's mobile app, ATM, or internet banking using
                the Virtual Account number above.
              </div>
            </div>

            <div v-else class="q-mt-sm text-caption">Thank you for your purchase.</div>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn flat label="Close" color="primary" v-close-popup @click="goToHome" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const total = ref(Number(route.query.total) || 0);
const totalFormatted = computed(() => total.value.toLocaleString());

const selectedMethod = ref('card');
const paymentMethods = [
  { label: 'Credit/Debit Card', value: 'card' },
  { label: 'Virtual Account (VA)', value: 'va' },
  { label: 'QRIS', value: 'qris' },
];

// Card fields
const cardNumber = ref('');
const nameOnCard = ref('');
const expiry = ref('');
const cvv = ref('');

// VA fields
const vaBanks = ['BCA', 'BNI', 'BRI', 'Mandiri'];
const selectedBank = ref('');
const vaNumber = ref('');
const vaExpiryTime = ref('');
const vaBankLabel = computed(() => selectedBank.value || 'Your Bank');

// Dialog
const dialog = ref(false);

// Generate dummy 16-digit VA number
function generateVANumber(bank: string) {
  const bankCodes: Record<string, string> = {
    BCA: '014',
    BNI: '009',
    BRI: '002',
    Mandiri: '008',
  };
  const prefix = bankCodes[bank] || '000';
  const randomDigits = Math.floor(Math.random() * 1e12)
    .toString()
    .padStart(12, '0');
  return prefix + randomDigits;
}

// Format expiry 24 hours from now
function getExpiryTime() {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date.toLocaleString();
}

function pay() {
  if (selectedMethod.value === 'card') {
    if (!cardNumber.value || !nameOnCard.value || !expiry.value || !cvv.value) {
      return $q.notify({
        position: 'top',
        type: 'negative',
        message: 'Please fill in all card details',
      });
    }
  } else if (selectedMethod.value === 'va') {
    if (!selectedBank.value) {
      $q.notify({
        position: 'top',
        type: 'negative',
        message: 'Please select a bank',
      });
      return;
    }
    vaNumber.value = generateVANumber(selectedBank.value);
    vaExpiryTime.value = getExpiryTime();
    dialog.value = true;
  }

  dialog.value = true;
}

function goToHome() {
  void router.push('/');
}

function copyToClipboard(text: string) {
  if (!navigator.clipboard) {
    // fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  } else {
    navigator.clipboard.writeText(text).catch(() => {
      $q.notify({
        position: 'top',
        message: 'Failed to copy text',
        color: 'negative',
        icon: 'error',
      });
      return;
    });
  }

  $q.notify({
    position: 'top',
    message: 'Copied to clipboard!',
    color: 'positive',
    icon: 'check',
  });
}
</script>
