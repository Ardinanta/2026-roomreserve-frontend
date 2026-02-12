import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import DemoPage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RoomListPage from "./pages/rooms/RoomListPage";
import RoomDetailPage from "./pages/rooms/RoomDetailPage";
import AdminRoomListPage from "./pages/admin/AdminRoomListPage";
import AdminRoomFormPage from "./pages/admin/AdminRoomFormPage";
import BorrowingsPage from "./pages/borrowing/BorrowingsPage";
import CreateBorrowingPage from "./pages/borrowing/CreateBorrowingPage";
import BorrowingDetailPage from "./pages/borrowing/BorrowingDetailPage";
import EditBorrowingPage from "./pages/borrowing/EditBorrowingPage";

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

// Guard: harus login
function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Guard: harus login + Admin
function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== "Admin") return <Navigate to="/" replace />;
    return <>{children}</>;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-white">
                    <Navbar />
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<DemoPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* User: Ruangan */}
                        <Route path="/rooms" element={<PrivateRoute><RoomListPage /></PrivateRoute>} />
                        <Route path="/rooms/:id" element={<PrivateRoute><RoomDetailPage /></PrivateRoute>} />

                        {/* Admin: Kelola Ruangan */}
                        <Route path="/admin/rooms" element={<AdminRoute><AdminRoomListPage /></AdminRoute>} />
                        <Route path="/admin/rooms/create" element={<AdminRoute><AdminRoomFormPage /></AdminRoute>} />
                        <Route path="/admin/rooms/edit/:id" element={<AdminRoute><AdminRoomFormPage /></AdminRoute>} />

                        {/* Placeholder */}
                        <Route path="/borrowings" element={<PrivateRoute><BorrowingsPage /></PrivateRoute>} />
                        <Route path="/borrowings/create" element={<PrivateRoute><CreateBorrowingPage /></PrivateRoute>} />
                        <Route path="/borrowings/:id" element={<PrivateRoute><BorrowingDetailPage /></PrivateRoute>} />
                        <Route path="/borrowings/:id/edit" element={<PrivateRoute><EditBorrowingPage /></PrivateRoute>} />
                        <Route path="/admin" element={<AdminRoute><Placeholder icon="📊" text="Dashboard Admin" /></AdminRoute>} />
                        <Route path="/admin/borrowings" element={<AdminRoute><Placeholder icon="📋" text="Semua Peminjaman" /></AdminRoute>} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}
