export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  longDescription: string;
  pageCount: number;
  language: string;
  format: string;
  gradient: string;
}

export const books: Book[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    price: 299,
    category: "Self-Help",
    rating: 4.8,
    reviewCount: 2341,
    shortDescription: "Tiny changes, remarkable results.",
    longDescription: "A proven framework for building good habits and breaking bad ones. James Clear reveals how small 1% improvements compound into extraordinary results over time. Covers the four laws of behavior change, habit stacking, and environment design.",
    pageCount: 320,
    language: "English",
    format: "PDF",
    gradient: "from-[#6B1E2E] to-[#C9956C]"
  },
  {
    id: "2",
    title: "Deep Work",
    author: "Cal Newport",
    price: 349,
    category: "Productivity",
    rating: 4.7,
    reviewCount: 1892,
    shortDescription: "Rules for focused success in a distracted world.",
    longDescription: "Cal Newport argues that the ability to focus without distraction is the superpower of the 21st century. Learn how to cultivate deep focus, eliminate shallow work, and produce at your peak level.",
    pageCount: 296,
    language: "English",
    format: "PDF",
    gradient: "from-[#2C3E6B] to-[#6C8EC9]"
  },
  {
    id: "3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 399,
    category: "Finance",
    rating: 4.9,
    reviewCount: 3156,
    shortDescription: "Timeless lessons on wealth, greed, and happiness.",
    longDescription: "Through 19 short stories, Morgan Housel explores the strange ways people think about money and teaches you how to make better sense of one of life's most important topics.",
    pageCount: 256,
    language: "English",
    format: "PDF",
    gradient: "from-[#1A5C3A] to-[#6CC98E]"
  },
  {
    id: "4",
    title: "Ikigai",
    author: "Hector Garcia",
    price: 249,
    category: "Philosophy",
    rating: 4.6,
    reviewCount: 1567,
    shortDescription: "The Japanese secret to a long and happy life.",
    longDescription: "Ikigai is the Japanese concept of finding your reason for being. This book explores the lifestyle habits of the world's longest-living people in Okinawa and reveals the secrets to a purposeful, joyful life.",
    pageCount: 208,
    language: "English",
    format: "PDF",
    gradient: "from-[#5C3A1A] to-[#C99B6C]"
  },
  {
    id: "5",
    title: "Zero to One",
    author: "Peter Thiel",
    price: 449,
    category: "Business",
    rating: 4.5,
    reviewCount: 2089,
    shortDescription: "Notes on startups, or how to build the future.",
    longDescription: "Peter Thiel, co-founder of PayPal, shares his contrarian thinking on innovation. Every great business is built around a secret that others don't see. This book teaches you how to think for yourself and create something truly new.",
    pageCount: 224,
    language: "English",
    format: "PDF",
    gradient: "from-[#3A1A5C] to-[#9B6CC9]"
  },
  {
    id: "6",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    price: 299,
    category: "Self-Help",
    rating: 4.4,
    reviewCount: 4521,
    shortDescription: "A counterintuitive approach to living a good life.",
    longDescription: "Mark Manson argues that improving our lives hinges not on positivity but on identifying and prioritizing the things that truly matter. A raw, entertaining, and deeply human guide to living well.",
    pageCount: 224,
    language: "English",
    format: "PDF",
    gradient: "from-[#5C1A1A] to-[#C96C6C]"
  },
  {
    id: "7",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 499,
    category: "History",
    rating: 4.8,
    reviewCount: 5678,
    shortDescription: "A brief history of humankind.",
    longDescription: "From the Stone Age to Silicon Age, Harari explores how Homo sapiens came to dominate the Earth. Covers cognitive revolution, agricultural revolution, scientific revolution, and the future of our species.",
    pageCount: 464,
    language: "English",
    format: "PDF",
    gradient: "from-[#1A3A5C] to-[#6C9BC9]"
  },
  {
    id: "8",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 199,
    category: "Finance",
    rating: 4.6,
    reviewCount: 7892,
    shortDescription: "What the rich teach their kids about money.",
    longDescription: "Robert Kiyosaki shares the story of his two dads - his real father and the father of his best friend - and the ways in which both men shaped his thoughts about money, investing, and financial independence.",
    pageCount: 336,
    language: "English",
    format: "PDF",
    gradient: "from-[#3A5C1A] to-[#8CC96C]"
  },
  {
    id: "9",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 149,
    category: "Success",
    rating: 4.5,
    reviewCount: 3456,
    shortDescription: "The landmark bestseller on achieving personal goals.",
    longDescription: "After studying over 500 of America's most successful individuals, Napoleon Hill identified 13 principles of success including desire, faith, specialized knowledge, and persistence that anyone can apply.",
    pageCount: 320,
    language: "English",
    format: "PDF",
    gradient: "from-[#5C4A1A] to-[#C9B06C]"
  },
  {
    id: "10",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 99,
    category: "Fiction",
    rating: 4.7,
    reviewCount: 9123,
    shortDescription: "A magical fable about following your dreams.",
    longDescription: "Santiago, an Andalusian shepherd boy, travels from Spain to Egypt in search of treasure. Along the way he discovers that the real treasure lies within himself. A timeless story about destiny, dreams, and the language of the universe.",
    pageCount: 208,
    language: "English",
    format: "PDF",
    gradient: "from-[#1A4A5C] to-[#6CB8C9]"
  }
];

export const categories = [
  "All",
  "Self-Help",
  "Productivity",
  "Finance",
  "Philosophy",
  "Business",
  "History",
  "Success",
  "Fiction"
];

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id);
}

export function getBooksByCategory(category: string): Book[] {
  if (category === "All") return books;
  return books.filter(book => book.category === category);
}

export function getRelatedBooks(book: Book, limit: number = 3): Book[] {
  return books
    .filter(b => b.category === book.category && b.id !== book.id)
    .slice(0, limit);
}
