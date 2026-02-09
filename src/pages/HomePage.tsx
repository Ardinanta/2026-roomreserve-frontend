export default function HomePage() {
    return (
        <div className="w-full">
            {/* Hero */}
            <div className="w-full bg-slate-50">
                <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24 text-center">
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-5 tracking-tight">
                        Room<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reserve</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Sistem Peminjaman Ruangan Kampus — Kelola peminjaman ruangan dengan mudah, cepat, dan terorganisir.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all text-base">
                            Coba Login →
                        </a>
                        <a href="/register" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-10 py-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-base">
                            Register
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}