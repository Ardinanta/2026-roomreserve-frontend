import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRooms, deleteRoom } from "../../api/rooms";
import type { Room } from "../../types";

export default function AdminRoomListPage() {
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
            setError("");
            const data = await fetchRooms();
            setRooms(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal memuat data ruangan");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Yakin ingin menghapus ruangan "${name}"?`)) return;
        try {
            await deleteRoom(id);
            setRooms(rooms.filter((r) => r.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || "Gagal menghapus ruangan");
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

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Kelola Ruangan</h1>
                    <p className="text-base text-slate-500 mt-1">{rooms.length} ruangan terdaftar</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Cari ruangan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-64 px-5 py-3 bg-white border-2 border-slate-200 rounded-xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                    <Link
                        to="/admin/rooms/create"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all whitespace-nowrap flex items-center"
                    >
                        + Tambah
                    </Link>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6 text-base">{error}</div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Nama Ruangan</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Lokasi</th>
                                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-600">Kapasitas</th>
                                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 text-slate-400 text-base">
                                        <p className="text-4xl mb-3">🏢</p>
                                        Tidak ada ruangan ditemukan
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((room) => (
                                    <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/rooms/${room.id}`}
                                                className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                                            >
                                                {room.name}
                                            </Link>
                                            {room.description && (
                                                <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{room.description}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{room.location}</td>
                                        <td className="px-6 py-4 text-center text-slate-700 font-medium">
                                            {room.capacity}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    room.isAvailable
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {room.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`/admin/rooms/edit/${room.id}`}
                                                    className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium transition-all"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(room.id, room.name)}
                                                    className="px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-lg text-sm font-medium transition-all cursor-pointer"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}