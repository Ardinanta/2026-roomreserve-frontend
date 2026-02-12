import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBorrowingById, updateBorrowing } from "../../api/borrowings";
import { fetchRooms } from "../../api/rooms";
import type { Room, UpdateBorrowingRequest, Borrowing } from "../../types";

export default function EditBorrowingPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [rooms, setRooms] = useState<Room[]>([]);
	const [form, setForm] = useState<UpdateBorrowingRequest | null>(null);
	const [loading, setLoading] = useState(true);
	const [msg, setMsg] = useState("");

	useEffect(() => {
		fetchRooms(undefined, true).then(setRooms);
		if (id) {
			getBorrowingById(Number(id))
				.then((b: Borrowing) => {
					setForm({
						roomId: b.roomId,
						borrowDate: b.borrowDate.slice(0, 10),
						startTime: b.startTime,
						endTime: b.endTime,
						purpose: b.purpose,
					});
				})
				.catch(() => setMsg("Gagal memuat data peminjaman"))
				.finally(() => setLoading(false));
		}
	}, [id]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm(f => f ? { ...f, [name]: value } : f);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form || !id) return;
		setMsg("");
		setLoading(true);
		try {
			await updateBorrowing(Number(id), {
				...form,
				roomId: Number(form.roomId),
				borrowDate: new Date(form.borrowDate + "T00:00:00Z").toISOString(),
			});
			setMsg("Peminjaman berhasil diupdate!");
			setTimeout(() => navigate(`/borrowings/${id}`), 1200);
		} catch (err: any) {
			setMsg(err.response?.data?.message || "Gagal update peminjaman");
		} finally {
			setLoading(false);
		}
	};

	if (loading && !form) return <div className="text-center py-12 text-slate-500">Memuat data...</div>;
	if (!form) return <div className="text-center py-12 text-red-500">Data tidak ditemukan</div>;

	return (
		<div className="max-w-lg mx-auto px-6 py-8">
			<h1 className="text-2xl font-bold mb-2 text-slate-900">Edit Peminjaman</h1>
			<p className="text-sm text-slate-500 mb-6">Ubah data peminjaman ruangan Anda.</p>
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
					{loading ? "Memproses..." : "Simpan Perubahan"}
				</button>
			</form>
		</div>
	);
}
