import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        role: "User",
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

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: form.fullName,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMsg("Registrasi berhasil! Silakan login.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMsg(data.message || "Registrasi gagal");
            }
        } catch {
            setMsg("Tidak dapat terhubung ke server");
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-72px)] px-4 py-8 bg-slate-50">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                            <span className="text-white text-2xl font-bold">R</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Buat Akun Baru</h2>
                        <p className="text-base text-slate-500 mt-2">Daftar untuk menggunakan RoomReserve</p>
                    </div>

                    {/* Message */}
                    {msg && (
                        <div className={`text-center text-base mb-6 p-4 rounded-xl font-medium ${
                            msg.includes("berhasil")
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                            {msg}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-base font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Masukkan nama lengkap"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="contoh@mail.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-slate-700 mb-2">Role</label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Minimal 6 karakter"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-slate-700 mb-2">Konfirmasi Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Ulangi password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 disabled:from-emerald-300 disabled:to-cyan-400 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? "Memproses..." : "Register"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-base text-slate-500 mt-6">
                        Sudah punya akun?{" "}
                        <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}