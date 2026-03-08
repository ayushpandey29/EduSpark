"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function FeaturedBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books');
        const data = await response.json();
        setBooks(data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    }
    fetchBooks();
  }, []);

  const featuredBooks = books;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="featured" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary">
              Featured Books
            </h2>
            <p className="text-muted-foreground mt-2">
              Handpicked recommendations for you
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="border-border hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="border-border hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4"
        >
          {featuredBooks.map((book, index) => {
            const initials = book.title
              .split(" ")
              .slice(0, 2)
              .map((word: string) => word[0])
              .join("");

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-shrink-0 w-72"
              >
                <Link href={`/books/${book.id}`}>
                  <div className="book-card bg-card rounded-2xl border border-border overflow-hidden shadow-sm h-full">
                    <div
                      className={`aspect-[4/3] bg-gradient-to-br ${book.gradient} flex items-center justify-center relative`}
                    >
                      <span className="font-serif text-5xl font-bold text-white/90">
                        {initials}
                      </span>
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {book.author}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber text-amber" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold text-accent">
                          ₹{book.price}
                        </span>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.preventDefault();
                            addItem(book);
                            toast.success(`${book.title} added to cart`);
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile scroll indicators */}
        <div className="flex md:hidden justify-center gap-2 mt-4">
          {featuredBooks.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${index === 0 ? "w-6 bg-accent" : "w-1.5 bg-border"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
