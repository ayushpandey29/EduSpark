"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Library, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";

export function MobileNav() {
  const pathname = usePathname();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const [itemCount, setItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setItemCount(getItemCount());
  }, [getItemCount]);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/books", label: "Browse", icon: BookOpen },
    { href: "/library", label: "Library", icon: Library },
    { href: "/cart", label: "Cart", icon: ShoppingCart, badge: itemCount },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {mounted && item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-accent text-[10px] font-medium flex items-center justify-center text-accent-foreground">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
