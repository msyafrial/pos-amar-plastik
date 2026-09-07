# Amar Plastik — Design System

Dokumentasi token desain untuk POS kasir **Amar Plastik** (toko bahan pembuatan kue & perlengkapan plastik, tagline "Bring the quality"). Semua nilai diambil dari CSS custom properties di `styles.css` (`:root`).

## Warna

| Token | Nilai | Kegunaan |
|---|---|---|
| `--bg` | `#f5f6fa` | Latar halaman |
| `--surface` | `#ffffff` | Kartu, panel, rail |
| `--ink` | `#1e2432` | Teks utama |
| `--muted` | `#8a94a6` | Teks sekunder / label |
| `--line` | `#eef0f5` | Border & divider |
| `--accent` | `#c8102e` | Aksen utama (merah brand Amar Plastik): kategori aktif, harga diskon, CTA, FAB |
| `--accent-soft` | `#fdeeee` | Latar lembut aksen (promo, pay aktif, rail aktif) |
| `--blue` | `#3d7bfd` | Badge diskon |
| `--blue-soft` | `#edf2ff` | Latar lembut biru |
| `--green` | `#1faa59` | Status stok aman / badge Ready |
| `--yellow` (hardcoded) | `#f2a30f` | Badge Stok Menipis (stok ≤ 5) |
| `--red` (hardcoded) | `#e0342b` | Badge Stok Habis (stok = 0) |
| `--gray` (hardcoded) | `#8a94a6` | Badge EXP (kedaluwarsa) |
| Merah error | `#e0342b` | Stok rendah, hover hapus/keluar (hardcoded) |

### Sistem badge produk
Setiap kartu produk bisa menampilkan beberapa tag sekaligus (misal Diskon + Ready + EXP sekaligus — 3 tag):
- **Diskon N%** — biru `#3d7bfd`, muncul jika produk punya harga `old`
- **Ready** — hijau `#1faa59`, stok aman (> 5)
- **Stok Menipis** — kuning `#f2a30f`, stok ≤ 5 (menggantikan Ready)
- **Stok Habis** — merah `#e0342b`, stok = 0 (menggantikan Ready/Stok Menipis)
- **EXP MM/YY** — abu `#8a94a6`, hanya produk dengan tanggal kedaluwarsa

Wadah `.card-badges` memakai `display: flex; flex-wrap: wrap; gap: 4px` sehingga 3 tag yang tidak muat satu baris otomatis pindah ke baris kedua tanpa overflow.

### Kartu stok habis (disabled)
Saat `stock = 0`:
- `<button class="card">` diberi atribut `disabled` + `aria-disabled="true"` — tak bisa diklik keyboard maupun mouse
- Media kartu memakai **gradasi abu** `linear-gradient(135deg, #eceef2, #d9dde4)` (menggantikan tint warna)
- Emoji produk **grayscale** (`filter: grayscale(1); opacity: .5`)
- Nama, harga, dan meta diredam (`opacity: .55–.75`)
- Efek hover angkat dimatikan; cursor `not-allowed`
- Guard di `addToCart()`: klik paksa tetap ditolak + toast peringatan

### Gradasi & bayangan
- Avatar: `linear-gradient(135deg, #f7d4d4, #e5a1a1)`
- `--shadow-sm`: `0 1px 2px rgba(30,36,50,.05)` — kartu & input
- `--shadow-md`: `0 10px 30px -12px rgba(30,36,50,.18)` — hover kartu, panel, toast
- Bayangan aksen: `0 10px 20px -8px rgba(200,16,46,.55)` untuk elemen merah terangkat

## Tipografi

- **Font**: `Plus Jakarta Sans` (Google Fonts), fallback `system-ui`
- **Skala**:
  - Total/CTA: 20px / 800
  - Judul menu: 19px / 800
  - Nama item, label panel: 13–14px / 700–800
  - Body sekunder: 11–12.5px / 500–600
  - Badge/meta: 9.5–10.5px / 600–800
- **Angka**: semua harga memakai `font-variant-numeric: tabular-nums`
- **Format mata uang**: `Rp 21.200` (pemisah ribuan titik, `id-ID`)

## Struktur File Multi-Halaman (HTML Terpisah)

Aplikasi dipecah menjadi file-file HTML mandiri, saling terhubung via tautan sidebar (`.rail` dengan `<a>`):
- `index.html` — **Kasir** (halaman utama, POS lengkap dengan menu, panel order, promo, popup modal tunai, dan popup struk)
- `dashboard.html` — **Dashboard Utama** (analitik penjualan, hero cards gradien, filter rentang waktu kalender, chart kurva tren, top produk & pelanggan)
- `transaksi.html` — **Riwayat Transaksi** (kartu-kartu riwayat dari `localStorage`, tombol kosongkan riwayat)
- `produk.html` — **Master Data Produk** (4 kartu statistik, toolbar cari/filter/ekspor/tambah, tabel 8 kolom dengan SKU/batch/kedaluwarsa/status pill, aksi edit/hapus via modal konfirmasi, pagination 6 item)
- `kategori.html` — **Master Kategori** (katalog kategori produk toko, kartu visual dengan artwork cover, switcher Grid/List view, pencarian live, modal tambah/edit dan hapus)
- `laporan.html` — **Laporan Penjualan** (3 kartu metrik: Jumlah Transaksi, Total Omzet, Item Terjual + tabel detail transaksi)
- `pengaturan.html` — **Pengaturan** (informasi toko dari object `STORE`, pajak, versi aplikasi)

### Shared Assets
- `shared.css` — gaya layout tunggal `.app.app-single` (tanpa panel order, grid 72px 1fr), `.page-pad.page-full` / `.page-full` (lebar 100% mengisi area kanan penuh untuk data table), kartu, tabel, modal, status pill, toast
- `shared.js` — data `CATEGORIES`, `MENU` (dengan SKU & batch), `STORE`, helper `loadHistory()` / `saveHistory()` via `localStorage` (agar transaksi di Kasir otomatis terbaca di Transaksi & Laporan), format `rp()`, toast, modal helper
- `styles.css` — token desain dasar, sidebar, topbar, grid kartu produk, panel order kasir, popup tunai, dan struk
- `app.js` — logika khusus kasir (`index.html`): keranjang, hitung total/diskon/pajak, konfirmasi tunai, cetak struk

## Layout shell

- Radius: `--radius: 16px` (kartu), 12–14px (input, chip, tombol), 999px (pill/FAB)
- Grid menu: `repeat(auto-fill, minmax(168px, 1fr))`, gap 16px
- Layout: `grid-template-columns: 72px | 1fr | 340px` (rail · konten · order)
- Breakpoint utama: **1080px** — panel order jadi drawer + FAB muncul; **640px** — grid lebih rapat, teks profil disembunyikan

## Komponen

| Komponen | Kelas | Catatan |
|---|---|---|
| Rail navigasi | `.rail`, `.rail-btn` | **Modern Floating Capsule Sidebar**: Brand logo header Amar Plastik di atas (`.rail-brand`), section labels (MENU, LAINNYA), popover tooltip melayang saat hover di mode collapsed, profile footer di bawah (`.rail-profile`). Mode ringkas 72px ⇄ mode terbuka 240px dengan transisi spring `220ms cubic-bezier(0.16, 1, 0.3, 1)`. Otomatis menutup saat klik di luar area sidebar |
| **Floating Edge Toggle** | `.rail-edge-toggle` | Tombol bulat putih mengambang persis di perbatasan kanan sidebar (`right: -12px`, `top: 24px`, sejajar vertikal dengan logo brand). Menampilkan ikon `›` saat collapsed (klik untuk buka) dan `‹` saat expanded (klik untuk tutup). Didukung shortcut keyboard `Ctrl+B` / `Cmd+B` dan persistensi di `localStorage` |
| **Brand Logo Header** | `.rail-brand`, `.rail-logo`, `.rail-logo-img` | Logo resmi Amar Plastik (`logo.jpg`) dengan warna asli (tas dan teks merah maroon di atas latar putih bersih, tanpa di-reverse), menggunakan `object-fit: contain` agar rasio aspek tetap proporsional dan tidak terdistorsi/ketarik (`42x42px`, radius 12px, border halus) beserta teks "AMAR PLASTIK" dan tagline "Bring the quality" saat sidebar terbuka. Tampil di bagian paling atas sidebar |
| **Profile Footer** | `.rail-profile` | Avatar profil kasir (LM) beserta label KASIR TOKO dan nama Lina Puspa Melinda, diposisikan di bagian paling bawah sidebar dengan divider halus |
| **Search bar produk** | `.search` | Diposisikan di samping tombol filter pada bagian header katalog produk (`.menu-head-tools`); tinggi 40px, border `--line`, border-radius 11px, focus glow aksen merah, placeholder "Cari produk…" |
| **Filter & Sorting Popover** | `.filter-dropdown-wrap`, `.filter-btn`, `.filter-popover` | Tombol filter interaktif di samping input search yang memunculkan popover dropdown menu (`.filter-popover`): filter status stok (**Semua, Ready, Diskon, Stok Menipis**) & sorting (**Rekomendasi, Harga Terendah/Tertinggi, Nama A-Z, Stok Terbanyak**). Dilengkapi tombol **Terapkan**, **Reset**, badge aktif (`.filter-badge`), dan auto-close saat klik di luar |
| Chip kategori | `.cat-chip` | **Teks saja tanpa gambar/emoji**; aktif = penuh `--accent`. Kategori: Semua, Bahan Kue, Plastik, Kemasan |
| Kartu menu | `.card` | Media emoji berlatar tint pastel per produk |
| Badge | `.badge` di dalam `.card-badges` | Multi-tag, wrap otomatis: `is-blue` diskon, `is-green` ready, `is-yellow` stok menipis, `is-gray` EXP |
| Item pesanan | `.order-item` | Grid `grid-template-areas: "thumb info price" / "thumb qty price"`; gap 12px konsisten, nama ellipsis, harga rata kanan. Sublabel menampilkan kategori + stok; tombol + otomatis `disabled` saat qty = stok |
| Total | `.totals`, `.grand-total` | Subtotal (harga normal), Diskon Produk (aksen), Pajak 10%, lalu divider sebelum Total |
| Metode bayar | `.pay-btn` | Radio group, aktif = merah. Opsi: Cash, Debit, QRIS |
| CTA | `.cta` | "Proses Transaksi", **hijau** `--green` penuh + bayangan hijau, disabled saat keranjang kosong; klik memunculkan konfirmasi dulu |
| FAB keranjang | `.cart-fab` | Hanya tampil pada layar ≤768px (mobile & tablet portrait) saat drawer pesanan tertutup (`.is-hidden` / `body:has(.order.is-open)` otomatis `display: none !important`), dengan badge hitung jumlah item |
| **Drawer Pesanan** | `.order`, `.order-backdrop`, `.order-close-btn` | Pada layar ≤768px, panel pesanan beralih menjadi drawer off-canvas di sisi kanan (`width: min(380px, 92vw)`, `z-index: 96`) dengan tombol tutup `✕` dan backdrop blur (`.order-backdrop`). Saat terbuka, FAB keranjang otomatis disembunyikan sepenuhnya agar tidak menumpuk. Setelah transaksi selesai diproses atau struk ditutup, drawer pesanan otomatis tertutup kembali (`toggleOrderPanel(false)`). Di layar tablet landscape (1024px) & desktop (>768px), panel pesanan tetap docked di kolom kanan dengan proporsi rapi (320px) |
| **Mobile Sidebar Toggle** | `.topbar-mobile-toggle` | Tombol toggle navigasi sidebar di topbar yang hanya aktif pada viewport ≤768px (`display: none` di desktop/tablet landscape), menggunakan ikon **garis tiga (hamburger) modern & clean** berdimensi 40x40px, rounded 11px, stroke halus 2.2px dengan round caps, border tipis, dan subtle elevation untuk kemudahan akses membuka drawer sidebar navigasi |
| **Sticky Topbar Mobile** | `.topbar` | Pada layar ≤768px, topbar dipertahankan tetap mengambang di atas (`position: sticky; top: 0; z-index: 40`) dengan efek translusen dan latar blur (`backdrop-filter: blur(10px)`) serta pembatas bawah halus, sehingga kasir tetap memiliki akses navigasi cepat saat melakukan scroll katalog produk |
| Modal konfirmasi | `.modal-backdrop` + `.modal` | Popup kustom menggantikan `confirm()`: ikon, judul, isi, tombol Batal / Ya (varian `danger` merah atau `success` hijau); tutup via tombol, klik backdrop, atau Escape |
| Box pembayaran tunai | `.cash-box` | Hanya muncul di modal saat metode **Cash**: label "Uang Dibayarkan", input manual (format ribuan otomatis, **default terisi total belanja**), tombol cepat **50.000 / 100.000** + dropdown **Lainnya…** (150rb–500rb), mini tabel kalkulasi Total / Dibayar / Kembalian (hijau; merah "− Rp N" bila uang kurang, tombol OK terblok). Semua pilihan di-reset tiap kali modal dibuka |
| Popup struk | `.receipt-backdrop` + `.receipt` | **Hitam-putih**, font Courier (monospace): logo tas SVG, AMAR PLASTIK + tagline, alamat & telp, No. Transaksi (TRX-YYYYMMDD-XXXX), waktu, kasir, pembayaran, rincian item — item berdiskon menampilkan baris tambahan `Harga normal Rp N (dicoret) − Rp N` (`.ri-disc`) — subtotal/diskon/pajak/TOTAL, **Dibayar & Kembalian**, ucapan terima kasih. Isi struk (`.receipt-body`) scroll mandiri; footer tombol (`.receipt-actions`) **selalu terlihat** — **🖨 Cetak** (outline, stub printer via toast) & **Selesai** (hitam solid, menutup struk + toast) |
| Toast | `.toast` | Bawah tengah, auto-hide 2.6s |
| **Dashboard Utama** | `dashboard.html`, `.db-header`, `.db-time-filter`, `.db-cards-hero`, `.db-cards-mini`, `.db-bottom-grid` | Halaman dashboard analitik bisnis toko Amar Plastik dengan filter rentang waktu (Minggu Ini, Bulan Ini, Custom), 4 kartu banner gradien hero (Total Pendapatan, Total Profit, Rata-Rata Order, Transaksi Hari Ini), 4 kartu mini statistik cepat (Kategori, Produk, Total Transaksi, Pengguna), grafik area SVG tren pendapatan interaktif, daftar produk terlaris, transaksi terbaru, dan pelanggan terbaik |
| **Hero Cards Dashboard** | `.db-hero-card`, `.db-card-purple`, `.db-card-emerald`, `.db-card-teal`, `.db-card-amber` | Kartu metrik dengan latar gradien premium (Purple `#4338ca`–`#6366f1`, Emerald `#059669`–`#10b981`, Teal `#0284c7`–`#06b6d4`, Amber `#d97706`–`#f59e0b`), watermark ikon SVG dekoratif di sudut kanan atas, pill icon tembus pandang, dan tipografi tebal tabular-nums |
| **Mini Cards Dashboard** | `.db-mini-card`, `.db-mini-info`, `.db-mini-icon` | Kartu statistik sekunder dengan latar putih, rounded 16px, border halus `rgba(226, 232, 240, 0.8)`, hover micro-lift, dan ikon kontainer abu-abu lembut |
| **Trend Chart Area SVG** | `.db-chart-wrap`, `.db-chart-svg`, `#chartAreaPath`, `#chartLinePath` | Grafik kurva halus cubic bezier SVG dengan gradien ungu translusen (`#6366f1`), garis grid horizontal, dot points interaktif, dan label sumbu X/Y dinamis yang otomatis menghitung omzet dari data transaksi |
| **Produk Terlaris List** | `.db-top-list`, `.db-top-item`, `.db-top-rank` | Daftar 5 produk paling laris berdasarkan riwayat transaksi dengan badge ranking bernomor bulat, kuantitas terjual, dan total nominal pendapatan per item |
| **Transaksi Terbaru List** | `.db-recent-list`, `.db-recent-item`, `.db-recent-code`, `.db-recent-meta` | Daftar 5 transaksi terakhir dengan kode transaksi tebal, tanggal, nama pelanggan, identitas kasir, dan nominal total berwarna indigo/aksen dalam kontainer kartu abu-abu lembut `#f8fafc` |
| **Pelanggan Terbaik List** | `.db-customer-list`, `.db-customer-item`, `.db-customer-avatar`, `.db-customer-info` | Daftar pelanggan teratas berdasarkan nilai akumulasi belanja, dilengkapi avatar inisial bulat berwarna cyan/teal `#0284c7`, jumlah transaksi, dan total nilai pembelian |
| **Filter Waktu Dashboard** | `.db-time-filter`, `.db-filter-chips`, `.db-chip`, `.db-custom-date` | Kontrol segment filter rentang waktu di header dashboard: **Minggu Ini** (dihitung presisi kalender dari hari **Senin 00:00 WIB s/d Minggu 23:59 WIB**), **Bulan Ini** (dihitung presisi kalender dari **tanggal 1 jam 00:00 WIB s/d tanggal terakhir bulan berjalan jam 23:59 WIB**), serta **Custom** (rentang tanggal mulai dan akhir kustom). Seluruh metrik, chart, dan list diperbarui secara real-time berdasarkan filter |
| **Halaman Master Kategori** | `kategori.html`, `.cat-header`, `.cat-toolbar`, `.cat-grid`, `.cat-card` | Halaman katalog kategori toko sesuai referensi desain: header counter "8 kategori terdaftar", tombol pill ungu "+ Tambah Kategori", toolbar pencarian live search ("Cari kategori...") dan toggle tampilan Grid/List. Kartu kategori modern dengan artwork ilustrasi sampul SVG, judul tebal, subtitle deskripsi, serta action pill buttons (Edit & Hapus) yang muncul melayang di pojok kanan atas kartu saat hover. Didukung modal dialog tambah/edit dan persistensi `localStorage` (`ap_master_categories`) |
| **Kartu Kategori & Aksi** | `.cat-card`, `.cat-card-media`, `.cat-card-actions`, `.cat-action-btn` | Kartu kategori rounded 18px berlatar putih dengan border halus `#edf2f7`, rasio aspek media 16:10, hover elevation `-3px`. Tombol aksi edit & hapus mengambang dengan latar semi-transparan `rgba(255,255,255,0.92)` dan backdrop-filter blur. Mendukung mode List View (`.is-list-view`) dengan kartu horizontal |
| **Modal Kategori** | `.cat-modal`, `.cat-form`, `.cat-input` | Modal dialog rounded 20px untuk menambah atau menyunting nama kategori, deskripsi, dan template sampul dengan validasi form dan feedback toast interaktif |

## Interaksi

- Semua transisi 0.15–0.28s ease; dihormati `prefers-reduced-motion`
- **Interaksi Buka/Tutup Sidebar**:
  - **Auto-Close saat Klik Button**: Baik pada versi Desktop maupun Mobile, ketika sidebar sedang terbuka dan pengguna mengklik tombol/item navigasi di sidebar (`.rail-btn`, `.rail-brand`), sidebar akan otomatis menutup kembali (`toggleSidebar(false)`).
  - **Auto-Open saat Klik di Luar Button**: Pada versi Desktop dan Tablet (`>768px`), ketika sidebar sedang dalam kondisi tertutup (mode strip ramping 72px), mengklik area sidebar rail di luar button/link akan otomatis membuka/memperlebar sidebar (`toggleSidebar(true)`). Kursor rail otomatis menampilkan `cursor: pointer`.
  - **Auto-Close saat Klik Luar**: Mengklik area konten di luar sidebar saat sidebar terbuka akan menutup sidebar secara otomatis.
  - **Keyboard Shortcut**: `Ctrl+B` / `Cmd+B` untuk toggle dan `Escape` untuk menutup sidebar.
- Hover kartu: naik 4px + shadow md
- Focus visible: outline 2px `--accent` offset 2px
- Pajak 10% dihitung dari total harga jual
- Diskon Produk: selisih harga normal (`old`) vs harga jual per item; Subtotal menampilkan harga normal, diskon tampil sebagai `− Rp N` berwarna aksen. Item berdiskon juga menampilkan catatan hijau "Hemat Rp N" (`.oi-save`) di panel pesanan
- **Batas stok**: qty di keranjang maksimal sama dengan stok produk. Guard ada di `addToCart()` (klik kartu) dan `changeQty()` (tombol +) — melebihi stok ditolak dengan toast "Stok … hanya N". Saat qty = stok, tombol + pada item keranjang `disabled` (opacity .35, cursor not-allowed, title "Stok maksimal")
- **Batal pesanan**: tombol "🗑 Hapus Semua" memunculkan **popup modal** (ikon 🗑, merah) berisi jumlah item; dikonfirmasi → keranjang kosong + toast. Tombol nonaktif saat keranjang kosong
- **Konfirmasi transaksi**: klik "Proses Transaksi" memunculkan **popup modal** (ikon 🛒, hijau) berisi ringkasan Jumlah item / Total / Pembayaran; bila **Cash**, modal menampilkan box input uang — **default terisi sesuai total belanja** (teks ter-select agar kasir bisa langsung mengetik koreksi), tombol cepat, dropdown nominal, atau input manual; kembalian dihitung langsung di mini tabel Total/Dibayar/Kembalian (dibayar − total); uang kurang ditolak. Batal = keranjang tetap utuh
- **Struk**: setelah konfirmasi ya, popup struk hitam-putih muncul otomatis (fungsi `showReceipt()`) dengan kode transaksi unik `TRX-YYYYMMDD-XXXX` dan waktu saat ini. Baris **Dibayar (metode)** dan **Kembalian** selalu tampil: tunai = nominal riil yang diinput, Debit/QRIS = sama dengan total sehingga kembalian Rp 0. Footer tombol tidak ikut terscroll (`flex` + `receipt-body` scroll mandiri). Tombol **Cetak** stub printer (toast), tombol **Selesai** menutup struk

## Panel Order (Detail Item)
- Panel tinggi 100vh dengan `overflow: hidden`; hanya `.order-list` yang scroll (`flex: 1; overflow-y: auto`) — bagian total, metode bayar, dan CTA selalu terlihat walau banyak item
- Item memakai grid `44px | 1fr | auto` dua baris: nama produk terpotong ellipsis (`text-overflow: ellipsis`), harga rata kanan dan tidak bergeser oleh nama panjang
- Divider tipis antar item; scrollbar tipis (`scrollbar-width: thin`)

## Konten
- Toko: **Amar Plastik** — bahan pembuatan kue (tepung, gula, mentega, coklat bubuk) & perlengkapan plastik/kemasan (kresek, mica bento, cup puding, plastik vacuum)
- Semua label UI berbahasa Indonesia: "Pilih Produk", "Detail Item", "Metode Pembayaran", "Proses Transaksi"
- Harga contoh dalam Rupiah sesuai kelas produk grosir/eceran
