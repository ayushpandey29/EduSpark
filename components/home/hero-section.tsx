"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Premium eBooks Collection</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight text-balance">
              Ignite Your Learning Journey Today
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Discover a curated collection of transformative books in self-help, 
              finance, productivity, and more. Download instantly and start reading today.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/books">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Browse Books
                </Button>
              </Link>
              <Link href="#featured">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  View Featured
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-primary">10+</p>
                <p className="text-sm text-muted-foreground">Premium Books</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Readers</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Stacked Books Illustration */}
              <div className="relative w-80 h-96">
                {/* Book 1 */}
                <motion.div
                  initial={{ rotate: -10, y: 20 }}
                  animate={{ rotate: -8, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute bottom-0 left-0 w-48 h-64 bg-gradient-to-br from-[#1B5E2F] to-[#3BB25B] rounded-lg shadow-2xl transform -rotate-6"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white/30" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-2 w-3/4 bg-white/20 rounded" />
                    <div className="h-2 w-1/2 bg-white/20 rounded mt-2" />
                  </div>
                </motion.div>

                {/* Book 2 */}
                <motion.div
                  initial={{ rotate: 5, y: 30 }}
                  animate={{ rotate: 3, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute bottom-8 left-16 w-48 h-64 bg-gradient-to-br from-[#2E7D42] to-[#81C784] rounded-lg shadow-2xl transform rotate-3"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white/30" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-2 w-3/4 bg-white/20 rounded" />
                    <div className="h-2 w-1/2 bg-white/20 rounded mt-2" />
                  </div>
                </motion.div>

                {/* Book 3 */}
                <motion.div
                  initial={{ rotate: 15, y: 40 }}
                  animate={{ rotate: 12, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute bottom-16 left-32 w-48 h-64 bg-gradient-to-br from-[#388E3C] to-[#A5D6A7] rounded-lg shadow-2xl transform rotate-12"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white/30" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-2 w-3/4 bg-white/20 rounded" />
                    <div className="h-2 w-1/2 bg-white/20 rounded mt-2" />
                  </div>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
    </section>
  );
}
