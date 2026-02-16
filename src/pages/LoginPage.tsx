import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        const result = await login({ email, password });
        setMsg(result.message);
        if (result.success) window.location.href = "/";
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-56px)] px-4 bg-slate-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 p-7">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/25">
                            <span className="text-white text-base font-bold">R</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Selamat Datang</h2>
                        <p className="text-sm text-slate-500 mt-1">Masuk ke akun RoomReserve</p>
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
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                placeholder="contoh@mail.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-400 disabled:to-indigo-400 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? "Memproses..." : "Login"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-500 mt-5">
                        Belum punya akun?{" "}
                        <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">Register</a>
                    </p>
                </div>

                {/* Demo Info */}
                {/* <div className="mt-3 bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 mb-1.5">Akun Demo</p>
                    <div className="space-y-1 text-xs text-slate-400">
                        <p>Admin: <span className="font-mono text-slate-600">admin@roomreserve.com</span> / <span className="font-mono text-slate-600">password123</span></p>
                        <p>User: <span className="font-mono text-slate-600">ahmad@mail.com</span> / <span className="font-mono text-slate-600">password123</span></p>
                    </div>
                </div> */}
            </div>
        </div>
    );
}