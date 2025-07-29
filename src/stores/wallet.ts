import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Cookies } from 'quasar';

export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
}
export const useWalletStore = defineStore('wallet', {
  persist: true,
  state: () => ({
    token: Cookies.get('token') || null,
    user: null as User | null,
    balance: ref(1000),
  }),
  getters: {
    formattedBalance: (state) => `$${state.balance.toLocaleString()}`,
  },
  actions: {
    add(amount: number) {
      this.balance += amount;
    },
    deduct(amount: number) {
      if (amount <= this.balance) {
        this.balance -= amount;
      } else {
        throw new Error('Insufficient balance');
      }
    },
    reset() {
      this.balance = 1000;
    },
  },
});
