import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  expanded: boolean;
}

export const useProductStore = defineStore('product', {
  persist: true,
  state: () => ({
    products: [] as Product[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async getAllProduct(retries = 3) {
      this.isLoading = true;
      this.error = null;

      while (retries > 0) {
        try {
          const res = await api.get('/products');
          this.products = res.data;
          break;
        } catch (err: unknown) {
          console.error('Fetch product error:', err);
          this.error = (err as string) || 'Unknown error';
          retries -= 1;
          if (retries === 0) throw err;
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
});
