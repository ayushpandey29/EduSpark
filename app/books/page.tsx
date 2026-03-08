import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { FloatingCart } from "@/components/floating-cart";
import { BookGrid } from "@/components/home/book-grid";

export default function BooksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="py-8">
          <BookGrid />
        </div>
      </main>
      <Footer />
      <MobileNav />
      <FloatingCart />
    </div>
  );
}
