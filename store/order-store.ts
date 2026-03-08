"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/data/books";

export interface Order {
  id: string;
  transactionId: string;
  items: { book: Book; quantity: number }[];
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  createdAt: string;
  customerName: string;
  customerEmail: string;
  isGift: boolean;
}

interface OrderState {
  orders: Order[];
  purchasedBooks: Book[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByTransactionId: (transactionId: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      purchasedBooks: [],
      
      addOrder: (order: Order) => {
        set((state) => {
          const newPurchasedBooks = [...state.purchasedBooks];
          order.items.forEach(item => {
            if (!newPurchasedBooks.find(b => b.id === item.book.id)) {
              newPurchasedBooks.push(item.book);
            }
          });
          return {
            orders: [order, ...state.orders],
            purchasedBooks: newPurchasedBooks,
          };
        });
      },
      
      updateOrderStatus: (orderId: string, status: Order["status"]) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },
      
      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },
      
      getOrderByTransactionId: (transactionId: string) => {
        return get().orders.find((order) => order.transactionId === transactionId);
      },
    }),
    {
      name: "pageturn-orders",
    }
  )
);
