import { useEffect, useState } from "react";
import { fetchMyBorrowings } from "../api/borrowings";
import type { Borrowing } from "../types";
import { Link } from "react-router-dom";

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  APPROVED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-300",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-300",
};

export default function BorrowingsPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchMyBorrowings()
      .then(setBorrowings)
      .catch(() => setMsg("Gagal memuat data peminjaman"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-slate-900">Daftar Peminjaman Saya</h1>
      {msg && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium">{msg}</div>}
      {loading ? (
        <div className="text-center text-slate-500 py-12">Memuat data...</div>
      ) : borrowings.length === 0 ? (
        <div className="text-center text-slate-500 py-12">Belum ada peminjaman ruangan.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Ruangan</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Tanggal</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Waktu</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Keperluan</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map(b => (
                <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50 transition-all">
                  <td className="px-4 py-2 text-sm font-medium text-slate-900">{b.roomName || "-"}</td>
                  <td className="px-4 py-2 text-sm text-slate-700">{b.borrowDate}</td>
                  <td className="px-4 py-2 text-sm text-slate-700">{b.startTime} - {b.endTime}</td>
                  <td className="px-4 py-2 text-sm text-slate-700">{b.purpose}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${statusColor[b.status.toUpperCase?.()] || "bg-slate-100 text-slate-700 border-slate-300"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <Link to={`/borrowings/${b.id}`} className="text-blue-600 hover:underline text-xs font-medium">Detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
