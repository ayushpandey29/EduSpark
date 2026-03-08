import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { FloatingCart } from "@/components/floating-cart";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedBooks } from "@/components/home/featured-books";
import { BookGrid } from "@/components/home/book-grid";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <HeroSection />
        <FeaturedBooks />
        <BookGrid />
      </main>
      <Footer />
      <MobileNav />
      <FloatingCart />
    </div>
  );
}
