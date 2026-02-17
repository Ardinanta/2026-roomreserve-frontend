import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fetchMyBorrowings, cancelBorrowing } from "../../api/borrowings";
import type { Borrowing } from "../../types";
import { Link, useNavigate } from "react-router-dom";

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
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 8;
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    fetchMyBorrowings()
      .then(setBorrowings)
      .catch(() => setMsg("Gagal memuat data peminjaman"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm("Batalkan pengajuan peminjaman ini?")) return;
    setCancelingId(id);
    setMsg("");
    try {
      await cancelBorrowing(id);
      setMsg("Pengajuan berhasil dibatalkan.");
      loadData();
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Gagal membatalkan peminjaman");
    } finally {
      setCancelingId(null);
    }
  };

  // Search & Pagination logic
  const filtered = borrowings
    .filter(b =>
      b.roomName.toLowerCase().includes(search.toLowerCase()) ||
      b.purpose.toLowerCase().includes(search.toLowerCase()) ||
      b.status.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      return 0;
    });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-6 py-8">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Daftar Peminjaman Saya</h1>
        <input
          type="text"
          placeholder="Cari ruangan, keperluan, atau status..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm w-64"
        />
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium">{msg}</div>}
      {loading ? (
        <div className="text-center text-slate-500 py-12">Memuat data...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-12">Tidak ada peminjaman yang cocok.</div>
      ) : (
        <>
        <div className="overflow-x-auto">
          <table className="min-w-full border-2 border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-300">Ruangan</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-300">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-300">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-300">Keperluan</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-300">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((b, i) => (
                <tr
                  key={b.id}
                  className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50 transition-all`}
                >
                  <td className="px-6 py-3 text-sm font-semibold text-slate-900">{b.roomName || "-"}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">{format(new Date(b.borrowDate), "dd/MM/yyyy")}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">{b.startTime.slice(0,5)} - {b.endTime.slice(0,5)}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">{b.purpose}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${statusColor[b.status.toUpperCase?.()] || "bg-slate-100 text-slate-700 border-slate-300"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm flex gap-2 items-center">
                    <Link
                      to={`/borrowings/${b.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium transition"
                      title="Lihat Detail"
                    >
                      <span className="material-icons text-base align-middle" aria-label="Detail" />Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded bg-slate-200 text-slate-700 font-semibold text-sm disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >⬅</button>
            <span className="text-sm font-medium">Halaman {page} dari {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-slate-200 text-slate-700 font-semibold text-sm disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >➡</button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
