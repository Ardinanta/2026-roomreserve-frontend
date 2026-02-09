import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import DemoPage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function Placeholder({ text, icon }: { text: string; icon: string }) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">{icon}</span>
            </div>
            <p className="text-lg font-medium text-slate-400">{text}</p>
            <p className="text-sm text-slate-300">Halaman ini sedang dalam pengembangan</p>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-white">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<DemoPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/borrowings" element={<Placeholder icon="📋" text="Halaman Peminjaman" />} />
                        <Route path="/borrowings/create" element={<Placeholder icon="➕" text="Ajukan Peminjaman" />} />
                        <Route path="/rooms" element={<Placeholder icon="🏠" text="Halaman Ruangan" />} />
                        <Route path="/rooms/create" element={<Placeholder icon="⚙️" text="Kelola Ruangan" />} />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}
