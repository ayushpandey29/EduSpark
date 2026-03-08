"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, Shield } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, adminLogin } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      router.push("/admin");
    }
  }, [user, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const success = await adminLogin(formData.email, formData.password);
    setIsLoading(false);

    if (success) {
      toast.success("Welcome, Admin!");
      router.push("/admin");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#121A14] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary mb-4">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src="/images/logo.jpeg" alt="EduSpark" className="h-8 w-8 rounded-full" />
              <span className="font-serif text-xl font-semibold">EduSpark</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Admin Login
            </h1>
            <p className="text-muted-foreground mt-2">
              Access the admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@pageturn.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In as Admin"
              )}
            </Button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Demo credentials:</strong>
              <br />
              Email: admin@eduspark.com
              <br />
              Password: admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
