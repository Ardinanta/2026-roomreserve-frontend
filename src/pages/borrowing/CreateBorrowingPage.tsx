import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchRooms } from "../../api/rooms";
import { createBorrowing } from "../../api/borrowings";
import type { Room, CreateBorrowingRequest } from "../../types";

export default function CreateBorrowingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<CreateBorrowingRequest>({
    roomId: 0,
    borrowDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });
  // Hapus state datepicker
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms(undefined, true).then(setRooms);
    const roomId = searchParams.get("roomId");
    if (roomId) setForm(f => ({ ...f, roomId: Number(roomId) }));
  }, []);

  // Tidak perlu sync datepicker

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // Pastikan tanggal dikirim sebagai string ISO dan backend parsing ke UTC
      const borrowDate = form.borrowDate ? new Date(form.borrowDate + 'T00:00:00Z') : undefined;
      await createBorrowing({
        ...form,
        roomId: Number(form.roomId),
        borrowDate: borrowDate ? borrowDate.toISOString() : form.borrowDate,
      });
      setMsg("Pengajuan peminjaman berhasil!");
      setTimeout(() => navigate("/borrowings"), 1200);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Gagal mengajukan peminjaman");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2 text-slate-900">Ajukan Peminjaman Ruangan</h1>
      <p className="text-sm text-slate-500 mb-6">Isi data berikut untuk mengajukan peminjaman ruangan.</p>
      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${msg.includes("berhasil") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ruangan</label>
          <select
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Pilih ruangan</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.location})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal</label>
          <input
            type="date"
            name="borrowDate"
            value={form.borrowDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Mulai</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Selesai</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keperluan</label>
          <textarea
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
            placeholder="Contoh: Rapat, Seminar, Praktikum, dll."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-400 disabled:to-indigo-400 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Memproses..." : "Ajukan Peminjaman"}
        </button>
      </form>
    </div>
  );
}
