"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Search,
  Download,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Clock,
  Truck,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useOrderStore, type Order } from "@/store/order-store";
import { books } from "@/data/books";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const statusConfig = {
  Processing: {
    color: "bg-accent/10 text-accent border-accent/20",
    icon: Clock,
  },
  Shipped: {
    color: "bg-amber/10 text-amber border-amber/20",
    icon: Truck,
  },
  Delivered: {
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { orders, updateOrderStatus } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!user || !user.isAdmin)) {
      router.push("/admin/login");
    }
  }, [mounted, user, router]);

  if (!mounted || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#121A14] flex items-center justify-center">
        <div className="animate-pulse text-primary-foreground">Loading...</div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalBooks = books.length;
  const pendingOrders = orders.filter((o) => o.status === "Processing").length;

  const filteredOrders = orders.filter(
    (order) =>
      order.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
    toast.success(`Order status updated to ${status}`);
  };

  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Customer", "Email", "Total", "Status", "Date"];
    const rows = orders.map((order) => [
      order.transactionId,
      order.customerName,
      order.customerEmail,
      order.total,
      order.status,
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "eduspark-orders.csv";
    link.click();
    toast.success("Orders exported to CSV");
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: Package },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "customers", label: "Customers", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#121A14] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1B5E2F] transform transition-transform lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.jpeg" alt="EduSpark" className="h-8 w-8 rounded-full" />
              <span className="font-serif text-xl font-semibold text-white">
                EduSpark
              </span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-primary-foreground/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#1A2A1E] border-b border-border/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-primary-foreground"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="font-serif text-xl font-semibold text-primary-foreground">
                {navItems.find((i) => i.id === activeTab)?.label || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Revenue",
                    value: `₹${totalRevenue.toLocaleString()}`,
                    icon: DollarSign,
                    trend: "+12.5%",
                  },
                  {
                    label: "Total Orders",
                    value: totalOrders,
                    icon: ShoppingCart,
                    trend: "+8.2%",
                  },
                  {
                    label: "Total Books",
                    value: totalBooks,
                    icon: BookOpen,
                    trend: "0%",
                  },
                  {
                    label: "Pending Orders",
                    value: pendingOrders,
                    icon: Clock,
                    trend: pendingOrders > 0 ? "Active" : "None",
                  },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-card rounded-xl p-6 border border-border"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-accent flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-serif text-lg font-semibold">Recent Orders</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("orders")}
                  >
                    View All
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary text-primary-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Transaction ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order, i) => {
                        const StatusIcon = statusConfig[order.status].icon;
                        return (
                          <tr
                            key={order.id}
                            className={i % 2 === 0 ? "bg-background" : "bg-secondary/30"}
                          >
                            <td className="px-4 py-3 text-sm font-medium">
                              {order.transactionId}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {order.customerName}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-primary">
                              ₹{order.total}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                  statusConfig[order.status].color
                                }`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              {/* Search & Export */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleExportCSV}
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              {/* Orders Table */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary text-primary-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Transaction ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, i) => (
                        <tr
                          key={order.id}
                          className={i % 2 === 0 ? "bg-background" : "bg-secondary/30"}
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            {order.transactionId}
                          </td>
                          <td className="px-4 py-3 text-sm">{order.customerName}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {order.customerEmail}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-primary">
                            ₹{order.total}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                handleStatusChange(order.id, value as Order["status"])
                              }
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "books" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-serif text-lg font-semibold mb-4">Book Catalog</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => {
                  const initials = book.title
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("");
                  return (
                    <div
                      key={book.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                    >
                      <div
                        className={`w-12 h-16 rounded bg-gradient-to-br ${book.gradient} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="font-serif text-sm font-bold text-white/90">
                          {initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                        <p className="text-sm font-medium text-accent">₹{book.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(activeTab === "customers" || activeTab === "settings") && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Coming Soon
              </div>
              <h2 className="font-serif text-xl font-semibold mb-2">
                {activeTab === "customers" ? "Customer Management" : "Settings"}
              </h2>
              <p className="text-muted-foreground">
                This feature is currently under development.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
