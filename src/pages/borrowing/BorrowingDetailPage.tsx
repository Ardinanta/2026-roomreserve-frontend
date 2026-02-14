import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBorrowingById, cancelBorrowing } from "../../api/borrowings";
import type { Borrowing } from "../../types";

export default function BorrowingDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [borrowing, setBorrowing] = useState<Borrowing | null>(null);
	const [loading, setLoading] = useState(true);
	const [msg, setMsg] = useState("");
	const [canceling, setCanceling] = useState(false);

	useEffect(() => {
		if (id) {
			getBorrowingById(Number(id))
				.then(setBorrowing)
				.catch(() => setMsg("Gagal memuat detail peminjaman"))
				.finally(() => setLoading(false));
		}
	}, [id]);

	const handleCancel = async () => {
		if (!id) return;
		if (!window.confirm("Batalkan pengajuan peminjaman ini?")) return;
		setCanceling(true);
		setMsg("");
		try {
			await cancelBorrowing(Number(id));
			setMsg("Pengajuan berhasil dibatalkan.");
			setTimeout(() => navigate("/borrowings"), 1200);
		} catch (err: any) {
			setMsg(err.response?.data?.message || "Gagal membatalkan peminjaman");
		} finally {
			setCanceling(false);
		}
	};

	if (loading) return <div className="text-center py-12 text-slate-500">Memuat detail...</div>;
	if (!borrowing) return <div className="text-center py-12 text-red-500">Data tidak ditemukan</div>;

	return (
		<div className="max-w-xl mx-auto px-6 py-8">
			<h1 className="text-2xl font-bold mb-2 text-slate-900">Detail Peminjaman</h1>
			{msg && (
				<div className={`mb-4 p-3 rounded-lg text-sm font-medium ${msg.includes("berhasil") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>{msg}</div>
			)}
			<div className="bg-white rounded-lg shadow p-5 mb-6 border border-slate-100">
				<div className="mb-2 flex justify-between items-center">
					<div className="text-lg font-semibold text-slate-800">{borrowing.roomName} <span className="text-xs text-slate-500">({borrowing.roomLocation})</span></div>
					<span className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${borrowing.status === "Pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : borrowing.status === "Approved" ? "bg-green-100 text-green-800 border-green-300" : borrowing.status === "Rejected" ? "bg-red-100 text-red-800 border-red-300" : "bg-slate-100 text-slate-700 border-slate-300"}`}>{borrowing.status}</span>
				</div>
				<div className="text-sm text-slate-700 mb-1">Tanggal: <b>{format(new Date(borrowing.borrowDate), "dd/MM/yyyy")}</b></div>
				<div className="text-sm text-slate-700 mb-1">Waktu: <b>{borrowing.startTime} - {borrowing.endTime}</b></div>
				<div className="text-sm text-slate-700 mb-1">Keperluan: <b>{borrowing.purpose}</b></div>
				<div className="text-sm text-slate-700 mb-1">Diajukan oleh: <b>{borrowing.borrowerName || '-'}{borrowing.borrowerEmail ? ` (${borrowing.borrowerEmail})` : ''}</b></div>
				<div className="text-sm text-slate-700 mb-1">Dibuat: <b>{format(new Date(borrowing.createdAt), "dd/MM/yyyy")}</b></div>
				{borrowing.updatedAt && <div className="text-sm text-slate-700 mb-1">Diupdate: <b>{new Date(borrowing.updatedAt).toLocaleString()}</b></div>}
				{borrowing.status === "Rejected" && borrowing.statusHistories?.length > 0 && (
					<div className="text-sm text-red-600 mt-2">Alasan ditolak: <b>{borrowing.statusHistories.find(h => h.newStatus === "Rejected")?.note}</b></div>
				)}
			</div>

			<div className="flex gap-3">
				{borrowing.status === "Pending" && (
					<>
						<Link to={`/borrowings/${borrowing.id}/edit`} className="px-4 py-2 rounded bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition">Edit</Link>
						<button onClick={handleCancel} disabled={canceling} className="px-4 py-2 rounded bg-red-600 text-white font-semibold text-sm hover:bg-red-500 transition disabled:opacity-60">{canceling ? "Membatalkan..." : "Batalkan Pengajuan"}</button>
					</>
				)}
				<Link to="/borrowings" className="px-4 py-2 rounded bg-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-300 transition">Kembali</Link>
			</div>
		</div>
	);
}
