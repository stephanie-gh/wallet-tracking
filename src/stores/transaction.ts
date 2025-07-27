import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Product, Rating } from './product';

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: {
    productId: number;
    quantity: number;
  }[];
  __v: number;
}

export interface MergedProduct {
  productId: number;
  quantity: number;
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    carts: [] as Cart[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async getAllCarts(userId: number | undefined, retries = 3) {
      this.isLoading = true;
      this.error = null;

      while (retries > 0) {
        try {
          const res = await api.get('/carts');
          this.carts = res.data.filter((cart: Cart) => cart.userId === userId);
          return res.data.filter((cart: Cart) => cart.userId === userId);
        } catch (err: unknown) {
          console.error('Fetch carts error:', err);
          this.error = (err as string) || 'Unknown error';
          retries -= 1;
          if (retries === 0) throw err;
        } finally {
          this.isLoading = false;
        }
      }
    },
    async addNewCart(userId: number | undefined, product: Product[]) {
      try {
        const res = await api.post('/carts', {
          userId,
          product,
        });

        console.log('Product added to cart:', res.data);
      } catch (err) {
        console.error('Add to cart error:', err);
        throw err;
      }
    },
  },
});
