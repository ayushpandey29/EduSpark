"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Copy,
  Download,
  Loader2,
  CreditCard,
  Building2,
  Smartphone
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { motion } from "framer-motion";
import { toast } from "sonner";
import QRCode from "qrcode";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getGST, getTotal, getDiscount, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    isGift: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const total = getTotal();
  const upiId = "eduspark@upi";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && total > 0) {
      // Use the actual PhonePe QR code image instead of generating one
      setQrCodeUrl("/images/phonepe-qr.jpeg");
    }
  }, [mounted, total]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = "eduspark-payment-qr.jpeg";
      link.href = qrCodeUrl;
      link.click();
      toast.success("QR code downloaded!");
    }
  };

  const handlePaymentComplete = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    // Simulate payment verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const transactionId = `ES${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const order = {
      id: Date.now().toString(),
      transactionId,
      items: items.map((item) => ({ book: item.book, quantity: item.quantity })),
      subtotal: getSubtotal(),
      discount: getDiscount(),
      gst: getGST(),
      total: getTotal(),
      status: "Processing" as const,
      createdAt: new Date().toISOString(),
      customerName: formData.fullName,
      customerEmail: formData.email,
      isGift: formData.isGift,
    };

    const orderData = {
      userEmail: formData.email,
      items: items.map((item) => ({
        bookId: item.book.id,
        title: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
      })),
      totalAmount: getTotal(),
      status: 'pending',
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to save order to database');
      }

      addOrder(order);
      clearCart();
      toast.success("Payment successful!");
      router.push(`/order-confirmation?txn=${transactionId}`);
    } catch (error) {
      console.error('Error saving order to MongoDB:', error);
      toast.error("There was an issue processing your order. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold mb-4">No items in cart</h1>
            <Link href="/books">
              <Button>Browse Books</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium hidden sm:block">Cart</span>
              </div>
              <div className="w-12 h-0.5 bg-primary" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-sm font-medium hidden sm:block">Checkout</span>
              </div>
              <div className="w-12 h-0.5 bg-border" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Customer Info */}
            <div>
              <div className="bg-secondary/50 rounded-xl p-6">
                <h2 className="font-serif text-xl font-semibold mb-6">
                  Customer Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                    <div>
                      <p className="font-medium">Gift this book</p>
                      <p className="text-sm text-muted-foreground">
                        Send as a gift to someone special
                      </p>
                    </div>
                    <Switch
                      checked={formData.isGift}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isGift: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-xl border border-border p-6 mt-6">
                <h3 className="font-serif text-lg font-semibold mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.book.id} className="flex justify-between text-sm">
                      <span>
                        {item.book.title} x {item.quantity}
                      </span>
                      <span>₹{item.book.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 space-y-2">
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
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">₹{getTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Payment */}
            <div>
              <div className="bg-secondary/50 rounded-xl p-6">
                <h2 className="font-serif text-xl font-semibold mb-6">
                  Payment Method
                </h2>

                <Tabs defaultValue="upi" className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="upi" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      UPI
                    </TabsTrigger>
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="netbanking" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Net Banking
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upi" className="mt-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      {/* QR Code */}
                      <div className="bg-card rounded-xl border border-primary/20 p-4 inline-block">
                        {qrCodeUrl && (
                          <img
                            src={qrCodeUrl}
                            alt="PhonePe Payment QR Code"
                            className="mx-auto max-w-[280px] rounded-lg"
                          />
                        )}
                      </div>

                      {/* Amount */}
                      <p className="text-3xl font-bold text-accent">₹{total}</p>

                      {/* UPI ID */}
                      <div className="flex items-center justify-center gap-2">
                        <div className="px-4 py-2 rounded-lg bg-card border border-border flex items-center gap-2">
                          <span className="text-sm font-medium">{upiId}</span>
                          <button
                            onClick={handleCopyUpi}
                            className="text-accent hover:text-accent/80"
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Instructions */}
                      <p className="text-sm text-muted-foreground italic">
                        Scan with GPay, PhonePe, or Paytm
                      </p>

                      {/* App icons */}
                      <div className="flex items-center justify-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                          Google Pay
                        </span>
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-medium">
                          PhonePe
                        </span>
                        <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-600 text-xs font-medium">
                          Paytm
                        </span>
                      </div>

                      {/* Timer */}
                      <p className="text-sm text-muted-foreground">
                        QR expires in{" "}
                        <span className="font-medium text-foreground">
                          {formatTime(timeLeft)}
                        </span>
                      </p>

                      {/* Save QR */}
                      <Button
                        variant="outline"
                        onClick={handleDownloadQR}
                        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Save QR Code
                      </Button>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="card" className="mt-6">
                    <div className="text-center py-12">
                      <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                        Coming Soon
                      </div>
                      <p className="text-muted-foreground">
                        Card payments will be available soon. Please use UPI for now.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="netbanking" className="mt-6">
                    <div className="text-center py-12">
                      <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                        Coming Soon
                      </div>
                      <p className="text-muted-foreground">
                        Net banking will be available soon. Please use UPI for now.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Complete Payment Button */}
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-primary to-[#2E7D42] hover:opacity-90"
                  size="lg"
                  onClick={handlePaymentComplete}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying payment...
                    </>
                  ) : (
                    "I Have Completed the Payment"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
