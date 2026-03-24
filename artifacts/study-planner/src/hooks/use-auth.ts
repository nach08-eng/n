import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export interface User {
  name: string;
  email: string;
}

export function useAuth() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth-user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const login = (email: string, name: string) => {
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem("auth-user", JSON.stringify(newUser));
    setLocation("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-user");
    setLocation("/login");
  };

  return { user, login, logout, isAuthenticated: !!user };
}
