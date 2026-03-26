import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockStore } from "@/lib/mockData";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  national_id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, method?: "email" | "phone") => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (email: string, otp: string, method?: "email" | "phone") => Promise<{ success: boolean }>;
  register: (data: { full_name: string; email: string; phone: string; national_id: string; password: string }) => Promise<{ success: boolean }>;
  logout: () => void;
  isAdmin: boolean;
  pendingEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem("user"); }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, method: "email" | "phone" = "email") => {
    try {
      await api.post("/auth/login", { email, password, method });
      setPendingEmail(email);
      return { success: true, message: "OTP sent! Check your email." };
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.response?.data?.message || "Invalid email or password");
    }
  };

  const verifyOtp = async (email: string, otp: string, method: "email" | "phone" = "email") => {
    try {
      const res = await api.post("/auth/verify-otp", { email, otp, method });
      const { accessToken, refreshToken, user: userData } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const u: User = {
        id: userData.id, email: userData.email, full_name: userData.full_name || userData.name,
        role: userData.role || "member", phone: userData.phone, national_id: userData.national_id
      };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      setPendingEmail(null);
      return { success: true };
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.response?.data?.message || "Invalid OTP");
    }
  };

  const register = async (data: { full_name: string; email: string; phone: string; national_id: string; password: string }) => {
    try {
      await api.post("/auth/register", data);
      return { success: true };
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      api.post("/auth/logout", { refresh_token: refreshToken }).catch(() => {});
    }
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setPendingEmail(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, verifyOtp, register, logout, isAdmin, pendingEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
