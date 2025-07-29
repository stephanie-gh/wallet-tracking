<template>
  <q-page class="q-pa-md bg-grey-1">
    <div style="max-width: 600px; margin: 0 auto">
      <q-btn flat dense icon="arrow_back" color="grey" label="Back" @click="$router.go(-1)" />
      <q-card flat bordered class="q-pa-lg q-mt-md">
        <HeaderComponent title="Choose Payment Method" />

        <q-option-group
          v-model="selectedMethod"
          :options="paymentMethods"
          color="primary"
          type="radio"
          class="q-mb-md"
        />

        <q-separator class="q-my-md" />

        <!-- Payment Content -->
        <div v-if="selectedMethod === 'wallet'">
          <WalletPayment :totalPrice="transaction.totalPrice" />
        </div>

        <div v-if="selectedMethod === 'card'">
          <CardPayment />
        </div>

        <div v-else-if="selectedMethod === 'va'">
          <div class="text-subtitle1 q-mb-sm">Pay via Virtual Account</div>
          <q-select
            options-dense
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
          <QrisPayment />
        </div>

        <q-separator class="q-my-md" />

        <!-- Total Summary -->
        <PaymentSummary :totalPrice="transaction.totalPrice" />

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
      <q-dialog v-model="dialog" persistent backdrop-filter="blur(4px)">
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

          <q-card-actions align="center"
            ><q-btn
              v-if="selectedMethod === 'va' && !vaPaid"
              label="Check Payment Status"
              color="primary"
              outline
              :loading="checkingStatus"
              @click="checkPaymentStatus"
            />
            <q-btn
              flat
              label="Back to Home"
              color="primary"
              v-close-popup
              @click="goToHome"
              :disable="checkingStatus"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from 'src/stores/wallet';
import { useTransactionStore } from 'src/stores/transaction';
import HeaderComponent from 'src/components/HeaderComponent.vue';
import PaymentSummary from 'src/components/payment/PaymentSummary.vue';
import CardPayment from 'src/components/payment/CardPayment.vue';
import QrisPayment from 'src/components/payment/QrisPayment.vue';
import WalletPayment from 'src/components/payment/WalletPayment.vue';

const transaction = useTransactionStore();
const wallet = useWalletStore();
const router = useRouter();
const $q = useQuasar();

const selectedMethod = ref('wallet');
const paymentMethods = [
  { label: 'Wallet', value: 'wallet' },
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
const vaPaid = ref(false);
const checkingStatus = ref(false);

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

// Simulate payment processing by VA
function checkPaymentStatus() {
  checkingStatus.value = true;

  setTimeout(() => {
    vaPaid.value = true;
    transaction.clearCart();
    checkingStatus.value = false;
    selectedMethod.value = 'paid';
  }, 2000);
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
  }

  if (selectedMethod.value === 'va') {
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
    return;
  }

  if (selectedMethod.value === 'wallet') {
    if (wallet.balance < transaction.totalPrice) {
      $q.notify({
        position: 'top',
        type: 'negative',
        message: 'Insufficient balance',
      });
    }

    // Deduct amount from wallet
    wallet.deduct(transaction.totalPrice);
    return;
  }

  transaction.clearCart();
  setTimeout(() => {
    dialog.value = true;
  }, 3000);
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
