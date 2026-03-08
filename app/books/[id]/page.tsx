"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { FloatingCart } from "@/components/floating-cart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, BookOpen, Globe, FileText, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BookCard } from "@/components/book-card";

const mockReviews = [
  {
    id: "1",
    name: "Amit Kumar",
    rating: 5,
    date: "2 weeks ago",
    comment: "Absolutely life-changing! The concepts are practical and easy to implement. Highly recommend for anyone looking to improve their habits.",
  },
  {
    id: "2",
    name: "Priya Sharma",
    rating: 4,
    date: "1 month ago",
    comment: "Great read with actionable insights. The examples really help illustrate the points. Would have loved more case studies.",
  },
  {
    id: "3",
    name: "Rahul Verma",
    rating: 5,
    date: "2 months ago",
    comment: "This book changed my perspective completely. The writing is engaging and the advice is timeless. A must-read!",
  },
];

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<any>(null);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchBookData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/books/${params.id}`);
        if (!response.ok) throw new Error('Book not found');
        const data = await response.json();
        setBook(data);

        // Fetch related books (books in same category)
        const relatedResponse = await fetch(`/api/books?category=${data.category}`);
        const relatedData = await relatedResponse.json();
        setRelatedBooks(relatedData.filter((b: any) => b.id !== data.id).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchBookData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-xl text-muted-foreground font-serif">
            Loading book details...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground mb-4">
              Book not found
            </h1>
            <Link href="/books">
              <Button>Browse Books</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = book.title
    .split(" ")
    .slice(0, 2)
    .map((word: string) => word[0])
    .join("");

  const handleAddToCart = () => {
    addItem(book);
    toast.success(`${book.title} added to cart`);
  };

  const handleBuyNow = () => {
    addItem(book);
    window.location.href = "/cart";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Books
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Book Cover */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`aspect-[3/4] max-w-md mx-auto lg:mx-0 bg-gradient-to-br ${book.gradient} rounded-2xl flex items-center justify-center shadow-2xl`}
              >
                <span className="font-serif text-8xl font-bold text-white/90">
                  {initials}
                </span>
              </div>
            </motion.div>

            {/* Book Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-3">
                  {book.category}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-muted-foreground">by {book.author}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(book.rating)
                          ? "fill-amber text-amber"
                          : "text-border"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{book.rating}</span>
                <span className="text-muted-foreground">
                  ({book.reviewCount.toLocaleString()} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-foreground leading-relaxed">
                {book.longDescription}
              </p>

              {/* Book Info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm">{book.pageCount} pages</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-sm">{book.language}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm">{book.format}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                <span className="text-4xl font-bold text-accent">
                  ₹{book.price}
                </span>
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 mb-6">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
                >
                  Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-0">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-serif text-xl font-semibold mb-4">
                    About this book
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.longDescription}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    {book.shortDescription} This comprehensive guide provides readers
                    with actionable insights and practical strategies that can be
                    immediately applied to everyday life. Whether you are just starting
                    your journey or looking to refine your existing knowledge, this
                    book offers valuable perspectives that will help you achieve your
                    goals.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-card rounded-xl border border-border p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{review.name}</h4>
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating
                                    ? "fill-amber text-amber"
                                    : "text-border"
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-serif text-xl font-semibold mb-4">
                    Book Details
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Title</ dt>
                      <dd className="font-medium">{book.title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Author</dt>
                      <dd className="font-medium">{book.author}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Category</dt>
                      <dd className="font-medium">{book.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Pages</dt>
                      <dd className="font-medium">{book.pageCount}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Language</dt>
                      <dd className="font-medium">{book.language}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Format</dt>
                      <dd className="font-medium">{book.format}</dd>
                    </div>
                  </dl>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                You might also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBooks.map((relatedBook) => (
                  <BookCard key={relatedBook.id} book={relatedBook} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
      <FloatingCart />
    </div>
  );
}
