# IRIS Talent Mapping

Platform web untuk tracking partisipasi lomba anggota IRIS, terhubung langsung ke Google Sheets.

---

## Cara Setup (15 menit)

### Langkah 1 — Google Sheets & Apps Script

1. Buka [sheets.google.com](https://sheets.google.com) dan buat spreadsheet baru
2. Beri nama spreadsheet: **"IRIS Talent Mapping"**
3. Di menu atas, klik **Extensions → Apps Script**
4. Hapus semua kode yang ada di editor
5. Copy-paste semua isi file **`Code.gs`** ke editor
6. Klik **Save** (ikon disket atau Ctrl+S)

### Langkah 2 — Deploy Apps Script sebagai Web App

1. Klik tombol **Deploy** (pojok kanan atas) → **New Deployment**
2. Klik ikon gear ⚙ di sebelah "Select type" → pilih **Web app**
3. Isi konfigurasi:
   - Description: `IRIS Talent Mapping API`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Klik **Deploy**
5. Klik **Authorize access** → pilih akun Google kamu → klik Allow
6. **Copy URL** yang muncul — bentuknya seperti:  
   `https://script.google.com/macros/s/AKfycb.../exec`

### Langkah 3 — Deploy Website ke Vercel

**Cara A: Via GitHub (Recommended)**
1. Upload folder ini ke GitHub repository baru
2. Buka [vercel.com](https://vercel.com) → Sign in dengan GitHub
3. Klik **New Project** → Import repository kamu
4. Klik **Deploy** — selesai! Vercel otomatis detect static site

**Cara B: Via Vercel CLI**
```bash
npm i -g vercel
cd iris-talent-mapping
vercel
```

### Langkah 4 — Hubungkan Website ke Google Sheets

1. Buka website yang sudah di-deploy
2. Klik menu **Pengaturan API** di sidebar kiri
3. Paste URL Apps Script dari Langkah 2
4. Klik **Simpan** — indikator di sidebar bawah akan berubah hijau ✅

---

## Struktur File

```
iris-talent-mapping/
├── index.html      ← Website utama (semua dalam 1 file)
├── Code.gs         ← Google Apps Script (backend/API)
├── vercel.json     ← Konfigurasi Vercel deployment
└── README.md       ← Panduan ini
```

---

## Fitur

| Fitur | Keterangan |
|-------|-----------|
| Input Form | Daftar/Menang, pilih divisi & anggota, kategori lomba, juara |
| Data Anggota | Grid & tabel, filter divisi, klik untuk detail lengkap |
| Data Lomba | Semua lomba, siapa yang ikut, siapa yang menang |
| Analytics | Stats, bar chart per divisi & kategori, leaderboard |
| Google Sheets | Semua data tersimpan real-time di spreadsheet |

---

## Menambah/Mengubah Daftar Anggota

Di file `index.html`, cari bagian `const MEMBERS = {` dan edit sesuai anggota IRIS:

```javascript
const MEMBERS = {
  "Researcher": ["Nama1", "Nama2", "Nama3"],
  "MedCre": ["Nama4", "Nama5"],
  // ...dst
};
```

Setelah edit, re-deploy ke Vercel (otomatis jika pakai GitHub — cukup push).

---

## Update Deployment Apps Script

Jika kamu mengubah `Code.gs`, jangan lupa **deploy ulang**:
1. Apps Script → Deploy → **Manage Deployments**
2. Klik edit (ikon pensil) → pilih version **New version**
3. Klik **Deploy** — URL tidak berubah

---

*IRIS Talent Mapping — dibuat dengan ❤️*
