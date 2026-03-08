"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCart() {
  const pathname = usePathname();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const [itemCount, setItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setItemCount(getItemCount());
  }, [getItemCount]);

  // Hide on cart page, checkout, admin pages, and on mobile (where bottom nav exists)
  if (
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname.startsWith("/admin") ||
    pathname === "/order-confirmation"
  ) {
    return null;
  }

  if (!mounted || itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40"
      >
        <Link href="/cart">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-14 w-14 rounded-full bg-primary shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            <motion.span
              key={itemCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-accent text-sm font-medium flex items-center justify-center text-accent-foreground"
            >
              {itemCount}
            </motion.span>
          </motion.button>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
