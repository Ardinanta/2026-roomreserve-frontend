import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "../types";
import api from "../api/axios";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (data: LoginRequest) => Promise<{ success: boolean; message: string }>;
    register: (data: RegisterRequest) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (saved && token) {
            try { setUser(JSON.parse(saved)); }
            catch { localStorage.removeItem("user"); localStorage.removeItem("token"); }
        }
        setLoading(false);
    }, []);

    const login = async (data: LoginRequest) => {
        try {
            const res = await api.post<AuthResponse>("/auth/login", data);
            const { token, user: userData } = res.data;

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", token);
            return { success: true, message: "Login berhasil!" };
        } catch (err: any) {
            const msg = err.response?.data?.message || "Login gagal!";
            return { success: false, message: msg };
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const res = await api.post<AuthResponse>("/auth/register", data);
            const { token, user: userData } = res.data;

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", token);
            return { success: true, message: "Registrasi berhasil!" };
        } catch (err: any) {
            const msg = err.response?.data?.message || "Registrasi gagal!";
            return { success: false, message: msg };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: user !== null, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth harus di dalam AuthProvider");
    return ctx;
}