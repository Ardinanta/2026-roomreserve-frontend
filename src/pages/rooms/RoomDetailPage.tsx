import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchRoomById } from "../../api/rooms";
import { useAuth } from "../../context/AuthContext";
import type { Room } from "../../types";

export default function RoomDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRoom();
    }, [id]);

    const loadRoom = async () => {
        try {
            setLoading(true);
            const data = await fetchRoomById(Number(id));
            setRoom(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Ruangan tidak ditemukan");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-pulse text-lg text-slate-400">Memuat detail ruangan...</div>
            </div>
        );

    if (error || !room)
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-6xl mb-4">😕</p>
                    <p className="text-xl text-red-500 mb-4">{error || "Ruangan tidak ditemukan"}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline text-base cursor-pointer"
                    >
                        ← Kembali
                    </button>
                </div>
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto px-6 py-6">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm mb-4 transition-colors cursor-pointer"
            >
                ← Kembali
            </button>

            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                {/* Image */}
                <div className="h-44 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <span className="text-6xl opacity-60">🏢</span>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{room.name}</h1>
                            <p className="text-sm text-slate-500 mt-0.5">📍 {room.location}</p>
                        </div>
                        <span
                            className={`self-start px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                                room.isAvailable
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {room.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                        </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-xs text-slate-500 mb-0.5">Kapasitas</p>
                            <p className="text-lg font-bold text-slate-900">👥 {room.capacity} orang</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-xs text-slate-500 mb-0.5">Ditambahkan pada</p>
                            <p className="text-sm font-semibold text-slate-900">
                                📅{" "}
                                {new Date(room.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    {room.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">Deskripsi</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{room.description}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2.5 pt-4 border-t border-slate-200">
                        {room.isAvailable && (
                            <Link
                                to={`/borrowings/create?roomId=${room.id}`}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                            >
                                Ajukan Peminjaman
                            </Link>
                        )}

                        {user?.role === "Admin" && (
                            <Link
                                to={`/admin/rooms/edit/${room.id}`}
                                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg font-semibold text-sm transition-all"
                            >
                                Edit Ruangan
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}