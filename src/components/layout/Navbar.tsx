import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setMenuOpen(false);
    };

    const isActive = (path: string) => location.pathname === path;

    const linkClass = (path: string) =>
        `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            isActive(path)
                ? "bg-blue-500/15 text-blue-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
        }`;

    const closeMenu = () => setMenuOpen(false);

    const isAdmin = user?.role === "Admin";

    return (
        <nav className="bg-slate-950 sticky top-0 z-50 shadow-lg shadow-black/10">
            <div className="w-full px-6">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                            <span className="text-white font-bold text-sm">R</span>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">
                            Room<span className="text-blue-400">Reserve</span>
                        </span>
                    </Link>

                    {/* Desktop Nav - Center */}
                    <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-sm rounded-full px-1.5 py-1 border border-white/5">
                        {isAuthenticated && !isAdmin && (
                            <>
                                <Link to="/" className={linkClass("/")} onClick={closeMenu}>
                                    <span className="flex items-center gap-2">Dashboard</span>
                                </Link>
                                <Link to="/borrowings" className={linkClass("/borrowings")} onClick={closeMenu}>
                                    <span className="flex items-center gap-2">Peminjaman Saya</span>
                                </Link>
                                <Link to="/rooms" className={linkClass("/rooms")} onClick={closeMenu}>
                                    <span className="flex items-center gap-2">Ruangan</span>
                                </Link>
                                <Link to="/borrowings/create" className={linkClass("/borrowings/create")} onClick={closeMenu}>
                                    <span className="flex items-center gap-2">Ajukan</span>
                                </Link>
                            </>
                        )}
                        {isAuthenticated && isAdmin && (
                            <>
                                <Link to="/admin" className={linkClass("/admin")} onClick={closeMenu}>
                                    <span className="flex items-center gap-2">Dashboard</span>
                                </Link>
                                <Link to="/admin/borrowings" className={linkClass("/admin/borrowings")} onClick={closeMenu}>
                                    <span className="flex items-center gap-2">Semua Peminjaman</span>
                                </Link>
                                <Link to="/admin/rooms" className={linkClass("/admin/rooms")} onClick={closeMenu}>
                                    <span className="flex items-center gap-2">Kelola Ruangan</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Desktop Auth - Right */}
                    <div className="hidden md:flex items-center gap-3 ml-auto">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-3.5 py-1.5 hover:bg-white/10 transition-all duration-200">
                                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/20">
                                        {user?.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-white leading-tight">{user?.fullName}</span>
                                        <span className={`text-[10px] font-semibold leading-tight ${
                                            user?.role === "Admin" ? "text-amber-400" : "text-blue-400"
                                        }`}>
                                            {user?.role === "Admin" ? "👑 Admin" : "👤 User"}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={handleLogout}
                                    className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-red-500/25">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-white/5 transition-all" onClick={closeMenu}>
                                    Login
                                </Link>
                                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-1.5 rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all" onClick={closeMenu}>
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Hamburger menu */}
                    <button className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer group" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                        <span className={`block w-6 h-0.5 bg-slate-400 group-hover:bg-white rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block w-6 h-0.5 bg-slate-400 group-hover:bg-white rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-6 h-0.5 bg-slate-400 group-hover:bg-white rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-2">
                    {isAuthenticated && !isAdmin && (
                        <>
                            <Link to="/" className={linkClass("/") + " block rounded-xl"} onClick={closeMenu}>🏠 Dashboard</Link>
                            <Link to="/borrowings" className={linkClass("/borrowings") + " block rounded-xl"} onClick={closeMenu}>📋 Peminjaman Saya</Link>
                            <Link to="/rooms" className={linkClass("/rooms") + " block rounded-xl"} onClick={closeMenu}>🏢 Ruangan</Link>
                            <Link to="/borrowings/create" className={linkClass("/borrowings/create") + " block rounded-xl"} onClick={closeMenu}>➕ Ajukan</Link>
                        </>
                    )}
                    {isAuthenticated && isAdmin && (
                        <>
                            <Link to="/admin" className={linkClass("/admin") + " block rounded-xl"} onClick={closeMenu}>📊 Dashboard</Link>
                            <Link to="/admin/borrowings" className={linkClass("/admin/borrowings") + " block rounded-xl"} onClick={closeMenu}>📋 Semua Peminjaman</Link>
                            <Link to="/admin/rooms" className={linkClass("/admin/rooms") + " block rounded-xl"} onClick={closeMenu}>🏢 Kelola Ruangan</Link>
                        </>
                    )}
                    <div className="border-t border-white/5 pt-4 mt-3 space-y-3">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-4 py-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                        {user?.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-white">{user?.fullName}</span>
                                        <span className={`text-xs font-semibold ${user?.role === "Admin" ? "text-amber-400" : "text-blue-400"}`}>
                                            {user?.role === "Admin" ? "👑 Admin" : "👤 User"}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={handleLogout}
                                    className="w-full py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-sm font-semibold rounded-lg transition-all cursor-pointer">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link to="/login" className="text-center text-slate-400 hover:text-white text-sm font-medium py-3 rounded-xl hover:bg-white/5 transition-all" onClick={closeMenu}>Login</Link>
                                <Link to="/register" className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold py-3 rounded-xl shadow-lg transition-all" onClick={closeMenu}>Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}