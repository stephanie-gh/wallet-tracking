import { defineStore } from 'pinia';
import type { Product, Rating } from './product';

export interface Cart {
  product: Product;
  quantity: number;
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
  persist: true,
  state: () => ({
    carts: [] as Cart[],
    isLoading: false,
    error: null as string | null,
    mergedItems: [] as MergedProduct[],
  }),
  getters: {
    totalQuantity: (state) => state.mergedItems.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) =>
      state.mergedItems.reduce((total, item) => total + item.price * item.quantity, 0),
  },
  actions: {
    addNewCart(product: Product, quantity = 1) {
      try {
        const existing = this.carts.find((item) => item.product.id === product.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          this.carts.push({ product, quantity });
        }
        this.getMergedCartItems();
        console.log('Product added to cart:', product);
      } catch (err) {
        console.error('Add to cart error:', err);
        throw err;
      }
    },
    getMergedCartItems() {
      const merged: MergedProduct[] = [];
      this.carts.forEach((cartItem) => {
        const { product, quantity } = cartItem;
        merged.push({
          productId: product.id,
          quantity,
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          rating: product.rating,
        });
      });
      this.mergedItems = this._mergeCartItems(merged);
    },
    _mergeCartItems(items: MergedProduct[]) {
      const mergedMap = new Map<number, MergedProduct>();
      for (const item of items) {
        const existing = mergedMap.get(item.productId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          mergedMap.set(item.productId, { ...item });
        }
      }
      return Array.from(mergedMap.values());
    },
    increaseQty(productId: number) {
      const item = this.mergedItems.find((i) => i.productId === productId);
      if (item) item.quantity++;
    },
    decreaseQty(productId: number) {
      const item = this.mergedItems.find((i) => i.productId === productId);
      if (item && item.quantity > 1) item.quantity--;
    },
    removeItem(productId: number) {
      this.mergedItems = this.mergedItems.filter((item) => item.productId !== productId);
    },
    clearCart() {
      this.carts = [];
      this.mergedItems = [];
    },
  },
});
