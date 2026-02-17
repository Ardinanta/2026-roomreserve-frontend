import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createRoom, updateRoom, fetchRoomById } from "../../api/rooms";

export default function AdminRoomFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        name: "",
        location: "",
        capacity: 10,
        description: "",
        isAvailable: true,
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (isEdit) loadRoom();
    }, [id]);

    const loadRoom = async () => {
        try {
            const room = await fetchRoomById(Number(id));
            setForm({
                name: room.name,
                location: room.location,
                capacity: room.capacity,
                description: room.description || "",
                isAvailable: room.isAvailable,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal memuat data ruangan");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm({
            ...form,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (isEdit) {
                await updateRoom(Number(id), {
                    name: form.name,
                    location: form.location,
                    capacity: form.capacity,
                    description: form.description || undefined,
                    isAvailable: form.isAvailable,
                });
                setSuccess("Ruangan berhasil diperbarui!");
            } else {
                await createRoom({
                    name: form.name,
                    location: form.location,
                    capacity: form.capacity,
                    description: form.description || undefined,
                });
                setSuccess("Ruangan berhasil ditambahkan!");
            }

            setTimeout(() => navigate("/admin/rooms"), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    if (fetching)
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-pulse text-lg text-slate-400">Memuat data ruangan...</div>
            </div>
        );

    return (
        <div className="max-w-lg mx-auto px-6 py-6">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm mb-4 transition-colors cursor-pointer"
            >
                ← Kembali
            </button>

            <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-7">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    {isEdit ? "Edit Ruangan" : "Tambah Ruangan"}
                </h1>
                <p className="text-sm text-slate-500 mb-6">
                    {isEdit ? "Perbarui informasi ruangan" : "Isi data ruangan baru"}
                </p>

                {error && (
                    <div className="text-sm mb-4 p-3 rounded-lg font-medium bg-red-50 text-red-700 border border-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-sm mb-4 p-3 rounded-lg font-medium bg-green-50 text-green-700 border border-green-200">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Nama Ruangan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Contoh: Lab Komputer 1"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* Lokasi */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Lokasi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Contoh: Gedung A, Lantai 2"
                            value={form.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* Kapasitas */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Kapasitas (orang) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="capacity"
                            min={1}
                            max={10000}
                            value={form.capacity}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Deskripsi <span className="text-slate-400 font-normal">(opsional)</span>
                        </label>
                        <textarea
                            name="description"
                            placeholder="Deskripsi ruangan, fasilitas, dll."
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
                        />
                    </div>

                    {/* Status (hanya untuk edit) */}
                    {isEdit && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Status
                            </label>
                            <select
                                name="isAvailable"
                                value={form.isAvailable ? "true" : "false"}
                                onChange={(e) =>
                                    setForm({ ...form, isAvailable: e.target.value === "true" })
                                }
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="true">Tersedia</option>
                                <option value="false">Tidak Tersedia</option>
                            </select>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-400 disabled:to-indigo-400 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Memproses..."
                            : isEdit
                            ? "Simpan Perubahan"
                            : "Tambah Ruangan"}
                    </button>
                </form>
            </div>
        </div>
    );
}