"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Package, Clock, Truck, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useOrderStore, type Order } from "@/store/order-store";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
  Processing: {
    color: "bg-accent/10 text-accent",
    icon: Clock,
  },
  Shipped: {
    color: "bg-amber/10 text-amber",
    icon: Truck,
  },
  Delivered: {
    color: "bg-success/10 text-success",
    icon: CheckCircle,
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { orders } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/login");
    }
  }, [mounted, isLoading, user, router]);

  if (!mounted || isLoading) {
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

  if (!user) {
    return null;
  }

  if (orders.length === 0) {
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
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
                No orders yet
              </h1>
              <p className="text-muted-foreground mb-6">
                You have not placed any orders. Start exploring our collection.
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
            Order History
          </h1>

          <div className="space-y-4">
            {orders.map((order, index) => {
              const StatusIcon = statusConfig[order.status].icon;
              const isExpanded = expandedOrder === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex h-12 w-12 rounded-lg bg-primary/10 items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{order.transactionId}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                          statusConfig[order.status].color
                        }`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {order.status}
                      </span>
                      <span className="font-semibold text-primary">
                        ₹{order.total}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Order Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-border bg-secondary/30">
                          {/* Status Badge Mobile */}
                          <div className="sm:hidden mb-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                                statusConfig[order.status].color
                              }`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              {order.status}
                            </span>
                          </div>

                          {/* Items */}
                          <div className="space-y-3 mb-4">
                            {order.items.map((item) => {
                              const initials = item.book.title
                                .split(" ")
                                .slice(0, 2)
                                .map((word) => word[0])
                                .join("");

                              return (
                                <div
                                  key={item.book.id}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    className={`w-10 h-14 rounded bg-gradient-to-br ${item.book.gradient} flex items-center justify-center flex-shrink-0`}
                                  >
                                    <span className="font-serif text-xs font-bold text-white/90">
                                      {initials}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm line-clamp-1">
                                      {item.book.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity} × ₹{item.book.price}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium">
                                    ₹{item.book.price * item.quantity}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Totals */}
                          <div className="border-t border-border pt-3 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>₹{order.subtotal}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-success">
                                <span>Discount</span>
                                <span>-₹{order.discount}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">GST</span>
                              <span>₹{order.gst}</span>
                            </div>
                            <div className="flex justify-between font-semibold pt-2 border-t border-border">
                              <span>Total</span>
                              <span className="text-primary">₹{order.total}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
