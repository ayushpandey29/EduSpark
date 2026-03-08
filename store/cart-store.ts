"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/data/books";

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getGST: () => number;
  getItemCount: () => number;
  promoCode: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  getDiscount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      
      addItem: (book: Book) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.book.id === book.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.book.id === book.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { book, quantity: 1 }] };
        });
      },
      
      removeItem: (bookId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.book.id !== bookId),
        }));
      },
      
      updateQuantity: (bookId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(bookId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.book.id === bookId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [], promoCode: null });
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.book.price * item.quantity,
          0
        );
      },
      
      getGST: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return Math.round((subtotal - discount) * 0.18);
      },
      
      getDiscount: () => {
        if (get().promoCode === "PAGETURN10") {
          return Math.round(get().getSubtotal() * 0.1);
        }
        return 0;
      },
      
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const gst = get().getGST();
        return subtotal - discount + gst;
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      
      applyPromoCode: (code: string) => {
        if (code.toUpperCase() === "PAGETURN10") {
          set({ promoCode: "PAGETURN10" });
          return true;
        }
        return false;
      },
      
      removePromoCode: () => {
        set({ promoCode: null });
      },
    }),
    {
      name: "pageturn-cart",
    }
  )
);
