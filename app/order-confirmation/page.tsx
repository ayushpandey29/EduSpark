"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download, BookOpen, ShoppingBag } from "lucide-react";
import { useOrderStore } from "@/store/order-store";
import { motion } from "framer-motion";
import { toast } from "sonner";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txn");
  const { getOrderByTransactionId } = useOrderStore();
  const order = txnId ? getOrderByTransactionId(txnId) : undefined;

  const [mounted, setMounted] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (order?.transactionId) {
      QRCode.toDataURL(order.transactionId, {
        width: 150,
        margin: 2,
        color: {
          dark: "#3BB25B",
          light: "#FFFFFF",
        },
      }).then(setQrCodeUrl);
    }
  }, [order?.transactionId]);

  const handleCopyTxnId = () => {
    if (order?.transactionId) {
      navigator.clipboard.writeText(order.transactionId);
      setCopied(true);
      toast.success("Transaction ID copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = `eduspark-order-${order?.transactionId}.png`;
      link.href = qrCodeUrl;
      link.click();
      toast.success("QR code downloaded!");
    }
  };

  const handleDownloadReceipt = () => {
    if (!order) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(59, 178, 91);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("EduSpark Books", 20, 25);
    
    // Order details
    doc.setTextColor(28, 28, 30);
    doc.setFontSize(12);
    doc.text("Order Receipt", 20, 55);
    
    doc.setFontSize(10);
    doc.text(`Transaction ID: ${order.transactionId}`, 20, 65);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 72);
    doc.text(`Customer: ${order.customerName}`, 20, 79);
    doc.text(`Email: ${order.customerEmail}`, 20, 86);

    // Table
    const tableData = order.items.map((item) => [
      item.book.title,
      item.book.author,
      item.quantity.toString(),
      `₹${item.book.price}`,
      `₹${item.book.price * item.quantity}`,
    ]);

    autoTable(doc, {
      startY: 95,
      head: [["Book Title", "Author", "Qty", "Price", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [59, 178, 91] },
      styles: { fontSize: 9 },
    });

    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // Totals
    doc.setFontSize(10);
    doc.text(`Subtotal: ₹${order.subtotal}`, 140, finalY);
    if (order.discount > 0) {
      doc.setTextColor(45, 106, 79);
      doc.text(`Discount: -₹${order.discount}`, 140, finalY + 7);
      doc.setTextColor(28, 28, 30);
    }
    doc.text(`GST (18%): ₹${order.gst}`, 140, finalY + (order.discount > 0 ? 14 : 7));
    doc.setFontSize(12);
    doc.setTextColor(59, 178, 91);
    doc.text(`Total: ₹${order.total}`, 140, finalY + (order.discount > 0 ? 24 : 17));

    // Footer
    doc.setTextColor(107, 124, 111);
    doc.setFontSize(8);
    doc.text("Thank you for your purchase! Your eBooks are ready to download.", 20, 280);

    doc.save(`eduspark-receipt-${order.transactionId}.pdf`);
    toast.success("Receipt downloaded!");
  };

  const handleDownloadBook = (bookTitle: string) => {
    toast.success(`Your eBook "${bookTitle}" is ready!`);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold mb-4">Order not found</h1>
            <Link href="/">
              <Button>Go Home</Button>
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
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-8"
            >
              <svg
                className="w-24 h-24 mx-auto"
                viewBox="0 0 100 100"
              >
                <circle
                  className="circle-animation"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3BB25B"
                  strokeWidth="4"
                />
                <path
                  className="checkmark-animation"
                  d="M30 50 L45 65 L70 35"
                  fill="none"
                  stroke="#3BB25B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-serif text-3xl font-bold text-primary mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. Your eBooks are ready to download.
              </p>

              {/* Transaction ID */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 mb-6">
                <span className="text-sm font-medium text-accent">
                  Transaction ID: {order.transactionId}
                </span>
                <button
                  onClick={handleCopyTxnId}
                  className="text-accent hover:text-accent/80"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* QR Code */}
              <div className="bg-card rounded-xl border border-border p-6 inline-block mb-6">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="Order QR Code" className="mx-auto" />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadQR}
                  className="mt-4"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save QR
                </Button>
              </div>

              {/* Download Receipt */}
              <div className="mb-8">
                <Button
                  onClick={handleDownloadReceipt}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Receipt
                </Button>
              </div>

              {/* Purchased Books */}
              <div className="bg-secondary/50 rounded-xl p-6 text-left mb-8">
                <h2 className="font-serif text-xl font-semibold mb-4">
                  Your eBooks
                </h2>
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const initials = item.book.title
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("");

                    return (
                      <div
                        key={item.book.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-16 rounded bg-gradient-to-br ${item.book.gradient} flex items-center justify-center`}
                          >
                            <span className="font-serif text-sm font-bold text-white/90">
                              {initials}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{item.book.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.book.author}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBook(item.book.title)}
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/library">
                  <Button className="bg-primary hover:bg-primary/90">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Go to My Library
                  </Button>
                </Link>
                <Link href="/books">
                  <Button
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
