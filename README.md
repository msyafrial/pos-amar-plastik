# Amar Plastik POS — Point of Sale & Retail Management System

Sistem Kasir (*Point of Sale*), Manajemen Inventaris, dan Dashboard Analitik Retail modern berbasis web untuk **Amar Plastik** — Toko Bahan Pembuatan Kue & Perlengkapan Plastik (*"Bring the quality"*), Medan.

Aplikasi ini dibangun menggunakan arsitektur web modern tanpa dependensi berat (*Vanilla HTML5, CSS3, ES6+*), mengadopsi prinsip desain **Clean White SaaS Bento Grid 2025–2026** yang responsif di semua perangkat (Desktop, Tablet, dan Mobile).

---

## 📁 Struktur Direktori Standar

Repositori ini telah diorganisasi sesuai standar industri web frontend:

```text
pos/
├── assets/
│   ├── css/
│   │   ├── shared.css             # Layout dasar single-page, utility, modal, toast, tabel
│   │   └── styles.css             # Sistem desain utama, sidebar capsule, kasir, dashboard bento
│   ├── js/
│   │   ├── app.js                 # Logika interaktif kasir, keranjang, diskon, struk belanja
│   │   └── shared.js              # State global, katalog MENU & Kategori, helper format, storage
│   └── images/
│       └── logo.jpg               # Logo resmi toko Amar Plastik (rasio aspek proporsional)
├── docs/
│   └── design-system.md           # Dokumentasi komprehensif token desain, UI/UX, & komponen
├── .gitignore                     # Aturan pengabaian file build, cache, dan temporary test
├── package.json                   # Konfigurasi proyek & script eksekusi lokal (npm run dev)
├── README.md                      # Dokumentasi repositori & petunjuk penggunaan
├── index.html                     # [Dashboard Utama] Analitik Bento KPI, kurva penjualan, kas laci
├── kasir.html                     # [Halaman Kasir POS] Transaksi kasir kilat, katalog, cart & payment
├── transaksi.html                 # [Riwayat Transaksi] Log penjualan, cetak ulang struk, search & filter
├── produk.html                    # [Master Produk] Dual-view (Card/List), SKU, batch, stok alert
├── kategori.html                  # [Master Kategori] Manajemen 8 kategori produk, modal add/edit
├── laporan.html                   # [Laporan Penjualan] Ringkasan performa finansial, filter tanggal, cetak
├── profit.html                    # [Laporan Keuntungan] Analisis margin laba kotor & profitabilitas
└── pengaturan.html                # [Pengaturan Sistem] Profil toko, kasir aktif, backup/restore data
```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini mandiri dan dapat dijalankan langsung di lingkungan lokal:

### Menggunakan Node.js (Disarankan)
```bash
# Jalankan server lokal di port 4321
npm run dev
```
Buka browser di: **`http://localhost:4321`** (otomatis memuat Dashboard Utama `index.html`).

### Menggunakan Python atau Live Server
```bash
# Opsi Python
python -m http.server 4321

# Opsi Live Server (VS Code Extension)
Klik kanan 'index.html' -> Open with Live Server
```

---

## ✨ Fitur Utama Sistem

1. **Bento Analytics Dashboard (`index.html`)**:
   - **4 Bento KPI Cards**: Total Omzet Penjualan (realtime), Laba Bersih (margin ~20%), Total Transaksi & Nilai Rata-rata per nota, serta Kesehatan Inventaris.
   - Penyelarasan teks horizontal simetris (*pixel-perfect alignment*) pada perangkat mobile (360x740).
   - **Kurva Penjualan Area SVG**: Visualisasi tren pendapatan dengan sumbu Y compact formatter (`Rp 720 Rb`, `Rp 3,8 Jt`, dsb.).
   - **Distribusi Pembayaran**: Rekap kas masuk (*Tunai, QRIS, Debit*) dan penghitung fisik kas laci (*Cash Drawer*).
   - **Feeds Operasional**: Top 5 Produk Terlaris dan 5 Transaksi Terkini.
   - **Peringatan Stok**: Banner dinamis untuk produk menipis (`stok <= 5`) atau habis (`stok = 0`).

2. **Kasir Kilat & POS (`kasir.html`)**:
   - Pencarian produk instan & filter kategori interaktif (*Bahan Kue, Plastik, Kemasan*).
   - Keranjang pesanan dinamis (*drawer off-canvas* adaptif pada mobile dengan floating cart badge).
   - Perhitungan otomatis subtotal, diskon produk, pajak 10%, dan total belanja.
   - Modal pembayaran tunai dengan tombol cepat pecahan uang (*50rb, 100rb, dll.*) serta kalkulasi kembalian *realtime*.
   - Cetak struk belanja thermal hitam-putih (*Courier monospace*) dengan layout presisi.
   - **Distribusi Pembayaran**: Rekap kas masuk (*Tunai, QRIS, Debit*) dan penghitung fisik kas laci (*Cash Drawer*).
   - **Feeds Operasional**: Top 5 Produk Terlaris dan 5 Transaksi Terkini.
   - **Peringatan Stok**: Banner dinamis untuk produk menipis (`stok <= 5`) atau habis (`stok = 0`).

3. **Manajemen Katalog & Inventaris (`produk.html`, `kategori.html`)**:
   - Tampilan ganda (*Card View* vs *List View*) dengan penyimpanan status di `localStorage`.
   - Kode SKU unik, nomor batch distributor, tanggal kedaluwarsa, dan indikator status stok (*Aman, Menipis, Habis*).
   - Manajemen kategori dengan artwork sampul SVG visual dan modal dialog tambah/sunting.

4. **Laporan & Rekonsiliasi Finansial (`laporan.html`, `profit.html`, `transaksi.html`)**:
   - Riwayat transaksi komprehensif dengan status invoice, kasir bertugas, pelanggan, dan cetak ulang struk.
   - Filter rentang waktu terintegrasi (*Hari Ini, Minggu Ini, Bulan Ini, Rentang Kustom*).
   - Analisis margin kotor toko ritel dan ekspor/cetak laporan terformat (*print stylesheet*).

---

## 🎨 Sistem Desain (Design System)

Proyek ini menggunakan filosofi **Modern SaaS Clean Light Theme** dengan palet warna:
- **Brand Red**: `#b91c1c` / `#dc2626` (Aksen logo & identitas toko)
- **Primary Indigo**: `#4f46e5` (Aksen navigasi & kurva grafik)
- **Success Emerald**: `#059669` (Indikator laba, status aktif & stok aman)
- **Warning Amber**: `#d97706` (Peringatan stok menipis)
- **Neutral Slate**: `#0f172a` (Teks judul utama) & `#64748b` (Label sekunder)
- **Canvas Base**: `#ffffff` (Latar kartu putih bersih) & `#f8fafc` (Background utama)

Dokumentasi lengkap dan spesifikasi komponen tersedia pada:
👉 **[docs/design-system.md](docs/design-system.md)**

---

## 📄 Lisensi

Hak Cipta © 2026 Amar Plastik Medan. Seluruh hak cipta dilindungi undang-undang.
