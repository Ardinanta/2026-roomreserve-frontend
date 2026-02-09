import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, LoginRequest, RegisterRequest } from "../types";
import { mockUsers } from "../data/mockData";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<{ success: boolean; message: string }>;
    register: (data: RegisterRequest) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            try { setUser(JSON.parse(saved)); }
            catch { localStorage.removeItem("user"); }
        }
    }, []);

    const login = async (data: LoginRequest) => {
        const found = mockUsers.find(u => u.email === data.email && u.password === data.password);
        if (!found) return { success: false, message: "Email atau password salah!" };

        const userData: User = { id: found.id, fullName: found.fullName, email: found.email, role: found.role };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", "mock-token-" + found.id);
        return { success: true, message: "Login berhasil!" };
    };

    const register = async (data: RegisterRequest) => {
        if (data.password !== data.confirmPassword)
            return { success: false, message: "Password tidak sama!" };
        if (mockUsers.find(u => u.email === data.email))
            return { success: false, message: "Email sudah terdaftar!" };

        const newUser = { id: mockUsers.length + 1, fullName: data.fullName, email: data.email, password: data.password, role: "User" as const };
        mockUsers.push(newUser);

        const userData: User = { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", "mock-token-" + newUser.id);
        return { success: true, message: "Registrasi berhasil!" };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth harus di dalam AuthProvider");
    return ctx;
}