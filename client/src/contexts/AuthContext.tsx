/**
 * AuthContext: Manages password-based access control for the memory album.
 * Password is stored as a simple constant (can be changed by the user).
 * Auth state is persisted in sessionStorage so it resets on browser close.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// =============================================
// CHANGE YOUR PASSWORD HERE
// =============================================
const ALBUM_PASSWORD = "memories2024";
// =============================================

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("album_auth") === "true";
  });

  const login = (password: string): boolean => {
    if (password === ALBUM_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("album_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("album_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
