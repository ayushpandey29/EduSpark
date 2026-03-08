"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("eduspark-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - accept any email/password
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem("eduspark-users") || "[]");
    const existingUser = users.find((u: { email: string }) => u.email === email);
    
    if (existingUser) {
      const loggedInUser = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      };
      setUser(loggedInUser);
      localStorage.setItem("eduspark-user", JSON.stringify(loggedInUser));
      return true;
    }
    
    // For demo, create user on the fly
    const newUser = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
    };
    setUser(newUser);
    localStorage.setItem("eduspark-user", JSON.stringify(newUser));
    return true;
  };

  const signup = async (name: string, email: string, _password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem("eduspark-users") || "[]");
    const existingUser = users.find((u: { email: string }) => u.email === email);
    
    if (existingUser) {
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
    };
    
    users.push(newUser);
    localStorage.setItem("eduspark-users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("eduspark-user", JSON.stringify(newUser));
    return true;
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (email === "admin@eduspark.com" && password === "admin123") {
      const adminUser = {
        id: "admin",
        name: "Admin",
        email: "admin@eduspark.com",
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem("eduspark-user", JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eduspark-user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, adminLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
