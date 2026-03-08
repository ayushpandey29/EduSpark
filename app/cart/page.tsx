"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getGST,
    getTotal,
    getDiscount,
    promoCode,
    applyPromoCode,
    removePromoCode,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApplyPromo = () => {
    if (applyPromoCode(promoInput)) {
      toast.success("Promo code applied successfully!");
      setPromoInput("");
    } else {
      toast.error("Invalid promo code");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
                Your shelf is empty
              </h1>
              <p className="text-muted-foreground mb-6">
                Looks like you haven not added any books yet. Start exploring our
                collection to find your next great read.
              </p>
              <Link href="/books">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Browse Books
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl font-bold text-primary mb-8">
            Your Cart
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => {
                  const initials = item.book.title
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("");

                  return (
                    <motion.div
                      key={item.book.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="bg-secondary/50 rounded-xl p-4 flex gap-4"
                    >
                      {/* Cover */}
                      <Link href={`/books/${item.book.id}`}>
                        <div
                          className={`w-20 h-28 rounded-lg bg-gradient-to-br ${item.book.gradient} flex items-center justify-center flex-shrink-0`}
                        >
                          <span className="font-serif text-xl font-bold text-white/90">
                            {initials}
                          </span>
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/books/${item.book.id}`}>
                          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                            {item.book.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.book.author}
                        </p>
                        <p className="text-lg font-bold text-accent">
                          ₹{item.book.price}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.book.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>

                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.book.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.book.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/50 rounded-xl p-6 sticky top-24">
                <h2 className="font-serif text-xl font-semibold mb-6">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  {promoCode ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">
                          {promoCode} applied
                        </span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Promo code"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={!promoInput}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Try: PAGETURN10 for 10% off
                  </p>
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount</span>
                      <span>-₹{getDiscount()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{getGST()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
                    <span>Total</span>
                    <span className="text-primary">₹{getTotal()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" className="block mt-6">
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/books" className="block mt-3">
                  <Button variant="ghost" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
