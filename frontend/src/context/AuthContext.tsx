import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "@/types";
import api from "@/api/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credential: string) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credential: string) => {
    const res = await api.post("/auth/google", { credential });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const loginWithToken = async (token: string) => {
    localStorage.setItem("token", token);
    const res = await api.get("/auth/me");
    setUser(res.data);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const res = await api.put("/auth/profile", data);
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithToken, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
