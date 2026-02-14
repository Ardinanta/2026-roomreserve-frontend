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

import AdminBorrowingsPage from "./pages/admin/AdminBorrowingsPage";
import AdminBorrowingDetailPage from "./pages/admin/AdminBorrowingDetailPage";

// Guard: hanya untuk pengguna login
function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Guard: hanya Admin yang bisa masuk
function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== "Admin") return <Navigate to="/" replace />;
    return <>{children}</>;
}

// Redirect home sesuai role
function HomeRedirect() {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return null;
    if (!isAuthenticated) return <DemoPage />;
    if (user?.role === "Admin") return <Navigate to="/admin/borrowings" replace />;
    return <Navigate to="/borrowings" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-white">
                    <Navbar />

                    <Routes>

                        {/* Public Routes */}
                        <Route path="/" element={<HomeRedirect />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* User: Ruangan */}
                        <Route path="/rooms" element={<PrivateRoute><RoomListPage /></PrivateRoute>} />
                        <Route path="/rooms/:id" element={<PrivateRoute><RoomDetailPage /></PrivateRoute>} />

                        {/* User: Borrowings */}
                        <Route path="/borrowings" element={<PrivateRoute><BorrowingsPage /></PrivateRoute>} />
                        <Route path="/borrowings/create" element={<PrivateRoute><CreateBorrowingPage /></PrivateRoute>} />
                        <Route path="/borrowings/:id" element={<PrivateRoute><BorrowingDetailPage /></PrivateRoute>} />
                        <Route path="/borrowings/:id/edit" element={<PrivateRoute><EditBorrowingPage /></PrivateRoute>} />

                        {/* Admin: Kelola Ruangan */}
                        <Route path="/admin/rooms" element={<AdminRoute><AdminRoomListPage /></AdminRoute>} />
                        <Route path="/admin/rooms/create" element={<AdminRoute><AdminRoomFormPage /></AdminRoute>} />
                        <Route path="/admin/rooms/edit/:id" element={<AdminRoute><AdminRoomFormPage /></AdminRoute>} />

                        {/* Admin: Borrowings */}
                        <Route path="/admin/borrowings" element={<AdminRoute><AdminBorrowingsPage /></AdminRoute>} />
                        <Route path="/admin/borrowings/:id" element={<AdminRoute><AdminBorrowingDetailPage /></AdminRoute>} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />

                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}
