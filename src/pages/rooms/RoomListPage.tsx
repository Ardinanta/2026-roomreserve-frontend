import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRooms } from "../../api/rooms";
import type { Room } from "../../types";

export default function RoomListPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const data = await fetchRooms();
            setRooms(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal memuat data ruangan");
        } finally {
            setLoading(false);
        }
    };

    const filtered = rooms.filter(
        (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.location.toLowerCase().includes(search.toLowerCase())
    );

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-pulse text-lg text-slate-400">Memuat data ruangan...</div>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-lg text-red-500 mb-4">{error}</p>
                    <button onClick={loadRooms} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors cursor-pointer">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Daftar Ruangan</h1>
                    <p className="text-base text-slate-500 mt-1">
                        {rooms.length} ruangan tersedia
                    </p>
                </div>
                <input
                    type="text"
                    placeholder="Cari ruangan atau lokasi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 px-5 py-3 bg-white border-2 border-slate-200 rounded-xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
            </div>

            {/* Room Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-6xl mb-4">🏢</p>
                    <p className="text-xl text-slate-400">Tidak ada ruangan ditemukan</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((room) => (
                        <Link
                            key={room.id}
                            to={`/rooms/${room.id}`}
                            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden"
                        >
                            {/* Image Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                <span className="text-6xl opacity-60">🏢</span>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {room.name}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ml-2 ${
                                            room.isAvailable
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {room.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                                    </span>
                                </div>

                                <div className="space-y-1.5 text-sm text-slate-500">
                                    <p className="flex items-center gap-2">
                                        <span>📍</span> {room.location}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span>👥</span> Kapasitas: {room.capacity} orang
                                    </p>
                                </div>

                                {room.description && (
                                    <p className="mt-3 text-sm text-slate-400 line-clamp-2">
                                        {room.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}