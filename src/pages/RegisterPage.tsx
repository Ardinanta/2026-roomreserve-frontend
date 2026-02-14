import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        if (form.password !== form.confirmPassword) {
            setMsg("Password dan konfirmasi password tidak cocok");
            setLoading(false);
            return;
        }

        const result = await register({
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
        });
        setMsg(result.message);
        if (result.success) window.location.href = "/";
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-56px)] px-4 py-6 bg-slate-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 p-7">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/25">
                            <span className="text-white text-base font-bold">R</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Buat Akun Baru</h2>
                        <p className="text-sm text-slate-500 mt-1">Daftar untuk menggunakan RoomReserve</p>
                    </div>

                    {/* Message */}
                    {msg && (
                        <div className={`text-center text-sm mb-4 p-3 rounded-lg font-medium ${
                            msg.includes("berhasil")
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                            {msg}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Masukkan nama lengkap"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="contoh@mail.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Minimal 6 karakter"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konfirmasi Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Ulangi password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-base font-semibold rounded-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all disabled:opacity-60"
                        >
                            {loading ? "Mendaftar..." : "Daftar"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-500 mt-5">
                        Sudah punya akun?{" "}
                        <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}