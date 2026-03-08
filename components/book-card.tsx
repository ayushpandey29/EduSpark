"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import type { Book } from "@/data/books";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(book);
    toast.success(`${book.title} added to cart`);
  };

  const initials = book.title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/books/${book.id}`}>
        <div className="book-card bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {/* Cover */}
          <div
            className={`aspect-[3/4] bg-gradient-to-br ${book.gradient} flex items-center justify-center relative`}
          >
            <span className="font-serif text-4xl font-bold text-white/90">
              {initials}
            </span>
            {/* Category Badge */}
            <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              {book.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber text-amber" />
              <span className="text-sm font-medium text-foreground">{book.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({book.reviewCount.toLocaleString()})
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {book.shortDescription}
            </p>

            {/* Price & Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold text-accent">
                ₹{book.price}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
