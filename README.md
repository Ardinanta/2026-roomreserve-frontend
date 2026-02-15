# RoomReserve Frontend

Aplikasi frontend untuk RoomReserve, sistem manajemen peminjaman ruangan berbasis web.

---

## Deskripsi
Aplikasi ini menyediakan antarmuka pengguna untuk:
- Register & login user
- Pengajuan, edit, dan pembatalan peminjaman ruangan
- Approval/reject oleh admin
- Riwayat & status peminjaman
- Dashboard admin & user
- Pencarian, filter, dan pagination

---

## Teknologi
- React + TypeScript
- Vite
- TailwindCSS
- Axios

---

## Instalasi

1. Masuk ke folder frontend:
   ```bash
   cd 2026-roomreserve-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Konfigurasi Environment
Buat file `.env` di root folder frontend:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Menjalankan Frontend
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

---

## Catatan
- Pastikan backend sudah berjalan dan variabel `VITE_API_URL` mengarah ke backend yang benar.
