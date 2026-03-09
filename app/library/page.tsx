"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Lock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useOrderStore } from "@/store/order-store";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LibraryPage() {
  const { user, isLoading } = useAuth();
  const { purchasedBooks } = useOrderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = (bookId: string, bookTitle: string) => {
    window.open(`/api/books/${bookId}/download`, '_blank');
    toast.success(`Downloading "${bookTitle}"...`);
  };

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
                <Lock className="h-16 w-16 text-muted-foreground" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
                Login to access your library
              </h1>
              <p className="text-muted-foreground mb-6">
                Sign in to view and download your purchased eBooks.
              </p>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90">
                  Login
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

  if (purchasedBooks.length === 0) {
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
                <BookOpen className="h-16 w-16 text-muted-foreground" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
                Your library is empty
              </h1>
              <p className="text-muted-foreground mb-6">
                You have not purchased any eBooks yet. Start exploring our collection.
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
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">
            My Library
          </h1>
          <p className="text-muted-foreground mb-8">
            {purchasedBooks.length} book{purchasedBooks.length !== 1 ? "s" : ""} in your collection
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchasedBooks.map((book, index) => {
              const initials = book.title
                .split(" ")
                .slice(0, 2)
                .map((word) => word[0])
                .join("");

              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  <div
                    className={`aspect-[3/4] bg-gradient-to-br ${book.gradient} flex items-center justify-center`}
                  >
                    <span className="font-serif text-4xl font-bold text-white/90">
                      {initials}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/books/${book.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Read
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(book.id, book.title)}
                        className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
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
