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
- `index.html` — **Dashboard Utama** (halaman beranda / landing default, analitik penjualan, hero cards gradien, filter rentang waktu kalender, chart kurva tren, top produk & pelanggan)
- `kasir.html` — **Kasir** (halaman POS lengkap dengan menu, panel order, promo, popup modal tunai, dan popup struk)
- `transaksi.html` — **Riwayat Transaksi** (kartu-kartu riwayat dari `localStorage`, tombol kosongkan riwayat)
- `produk.html` — **Master Data Produk** (4 kartu statistik, toolbar cari/filter/ekspor/tambah, tabel 8 kolom dengan SKU/batch/kedaluwarsa/status pill, aksi edit/hapus via modal konfirmasi, pagination 6 item)
- `kategori.html` — **Master Kategori** (katalog kategori produk toko, kartu visual dengan artwork cover, switcher Grid/List view, pencarian live, modal tambah/edit dan hapus)
- `laporan.html` — **Laporan Penjualan** (analisis dan ringkasan omzet, 4 kartu KPI hero penjualan, panel filter terintegrasi, dan tabel penjualan 8 kolom)
- `profit.html` — **Laporan Keuntungan / Profit** (analisis laba kotor & margin, 4 kartu KPI hero profit, ringkasan kalkulasi profit tabel penjualan)
- `pengaturan.html` — **Pengaturan** (informasi toko dari object `STORE`, pajak, versi aplikasi)

### Shared Assets (Organized in `assets/`)
- `assets/css/shared.css` — gaya layout tunggal `.app.app-single` (tanpa panel order, grid 72px 1fr), `.page-pad.page-full` / `.page-full` (lebar 100% mengisi area kanan penuh untuk data table), kartu, tabel, modal, status pill, toast
- `assets/js/shared.js` — data `CATEGORIES`, `MENU` (dengan SKU & batch), `STORE`, helper `loadHistory()` / `saveHistory()` via `localStorage` (agar transaksi di Kasir otomatis terbaca di Transaksi & Laporan), format `rp()`, toast, modal helper
- `assets/css/styles.css` — token desain dasar, sidebar berkategori, topbar, grid kartu produk, panel order kasir, popup tunai, dan struk
- `assets/js/app.js` — logika khusus kasir (`kasir.html`): keranjang, hitung total/diskon/pajak, konfirmasi tunai, cetak struk
- `assets/images/logo.jpg` — logo toko resmi Amar Plastik untuk header sidebar navigasi

## Layout shell

- Radius: `--radius: 16px` (kartu), 12–14px (input, chip, tombol), 999px (pill/FAB)
- Grid menu: `repeat(auto-fill, minmax(168px, 1fr))`, gap 16px
- Layout: `grid-template-columns: 72px | 1fr | 340px` (rail · konten · order)
- Breakpoint utama: **1080px** — panel order jadi drawer + FAB muncul; **640px** — grid lebih rapat, teks profil disembunyikan

## Komponen

| Komponen | Kelas | Catatan |
|---|---|---|
| Rail navigasi | `.rail`, `.rail-btn`, `.rail-section-label`, `.rail-section-divider` | **Modern Floating Capsule Sidebar dengan Pengelompokan Kategori**: Brand logo header Amar Plastik di atas (`.rail-brand`), navigasi terstruktur rapi ke dalam 4 kategori hierarkis (**UTAMA**: Dashboard, Kasir, Transaksi; **KATALOG**: Produk, Kategori; **LAPORAN**: Penjualan, Keuntungan; **SISTEM**: Pengaturan). Dilengkapi `.rail-section-label` (10px, bold 800, uppercase, letter-spacing 0.08em) saat expanded dan garis divider halus `.rail-section-divider` saat collapsed. Ikon SVG didesain proporsional dan relevan untuk setiap modul. Popover tooltip melayang saat hover di mode collapsed, profile footer di bawah (`.rail-profile`). Mode ringkas 72px ⇄ mode terbuka 240px dengan transisi spring `220ms cubic-bezier(0.16, 1, 0.3, 1)`. Otomatis menutup saat klik di luar area sidebar |
| **Floating Edge Toggle** | `.rail-edge-toggle` | Tombol bulat putih mengambang persis di perbatasan kanan sidebar (`right: -12px`, `top: 24px`, sejajar vertikal dengan logo brand). Menampilkan ikon `›` saat collapsed (klik untuk buka) dan `‹` saat expanded (klik untuk tutup). Didukung shortcut keyboard `Ctrl+B` / `Cmd+B` dan persistensi di `localStorage` |
| **Brand Logo Header** | `.rail-brand`, `.rail-logo`, `.rail-logo-img` | Logo resmi Amar Plastik (`assets/images/logo.jpg`) dengan warna asli (tas dan teks merah maroon di atas latar putih bersih, tanpa di-reverse), menggunakan `object-fit: contain` agar rasio aspek tetap proporsional dan tidak terdistorsi/ketarik (`42x42px`, radius 12px, border halus) beserta teks "AMAR PLASTIK" dan tagline "Bring the quality" saat sidebar terbuka. Tampil di bagian paling atas sidebar |
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
| **Dashboard Utama (Modern Bento POS Analytics 2025–2026)** | `index.html`, `.db-header`, `.db-store-status-pill`, `.db-time-filter`, `.db-cta-kasir-btn`, `.db-kpi-grid`, `.db-kpi-card`, `.db-analytics-grid`, `.db-chart-panel`, `.db-payment-panel`, `.db-pay-multi-bar`, `.db-operations-grid`, `.db-stock-alert-section` | **Dashboard Analitik Retail & Kasir Modern Bertema Putih Bersih (Clean White SaaS Bento Grid)**: Mengadopsi arsitektur Bento Grid kontemporer yang menggantikan kartu herois yang terlalu memakan ruang dan metrik statis yang tidak bernilai operasional. Menyajikan metrik finansial, kesehatan stok, dan distribusi kas secara komprehensif tanpa data duplikasi. |
| **Bento KPI Cards (4 Indikator Finansial & Operasional)** | `.db-kpi-grid`, `.db-kpi-card`, `.db-kpi-head`, `.db-kpi-tag`, `.db-kpi-value`, `.db-kpi-sub` | Empat kartu bento berlatar putih bersih dengan soft shadow, micro-hover elevation (-2px), dan fluid typography `clamp(20px, 1.8vw, 27px)` dengan dukungan multi-digit (ratusan juta/miliaran tanpa elipsis): (1) **Total Omzet Penjualan** (kartu primer dengan top accent bar indigo dan tag real-time), (2) **Laba Bersih** (warna emerald green dengan badge margin ~20%), (3) **Total Transaksi & Nilai Rata-rata** (volume nota dalam bahasa Indonesia ramah orang awam: subteks 'Rata-rata: Rp N' menggantikan akronim 'AOV', nilai 'N Transaksi' menggantikan 'Order', dan tag pill '● Nota Selesai' menggantikan 'Volume Order'), serta (4) **Kesehatan Inventaris** (jumlah SKU aktif dan counter alert stok menipis/habis) |
| **Grafik Tren Penjualan Area SVG** | `.db-chart-container`, `.db-chart-wrap`, `.db-chart-y-labels`, `.db-chart-svg`, `.db-chart-footer` | Visualisasi tren penjualan dengan kurva halus cubic bezier SVG dan gradien ungu lembut (`#4f46e5`). Dilengkapi sumbu Y vertikal tabular-nums dengan **Smart Compact Formatter** (`formatCompactRp` untuk angka jutaan/ratusan juta/miliar seperti `Rp 700 Jt`, `Rp 1,5 M`), sumbu X, serta statistik ringkas footer: Puncak Penjualan dan Rata-rata Harian |
| **Distribusi Pembayaran & Kas Laci** | `.db-payment-panel`, `.db-pay-multi-bar`, `.db-pay-seg`, `.db-pay-row`, `.db-cash-drawer-box` | Rekapitulasi metode pembayaran toko: segmented multi-color progress bar (Tunai `#10b981`, QRIS `#7c3aed`, Debit `#0284c7`), daftar breakdown nominal & persentase per metode, serta kartu rekapitulasi uang fisik kasir masuk (**Uang Fisik Kasir Masuk / Cash Drawer**) untuk rekonsiliasi kasir harian |
| **Feeds Operasional (Top Produk, Profit Tertinggi & Transaksi Live)** | `.db-operations-grid`, `.db-top-list`, `.db-top-item`, `.db-top-rank.is-profit`, `.db-top-bar-fill.is-profit`, `.db-top-profit-val`, `.db-top-share-tag.is-profit`, `.db-recent-list`, `.db-recent-item` | Tiga panel feed operasional dalam grid responsif (3 kolom desktop, 2+1 kolom tablet/laptop, 1 kolom mobile): (1) **Produk Terlaris** (5 produk teratas dengan ranking bulat, thumbnail emoji, bar persentase omzet, kuantitas terjual, dan total omzet per produk), (2) **Produk Profit Tertinggi (Laba Bersih)** (5 produk kontribusi laba terbesar dengan badge rank hijau emerald, emoji produk, bar gradien emerald `#10b981`, nominal profit bertanda `+Rp N`, margin %, dan kontribusi persentase laba bersih terhadap total laba toko), serta (3) **Aktivitas Transaksi Terbaru** (5 transaksi live terakhir dengan kode TRX, badge metode bayar, timestamp, nama pelanggan, kasir yang bertugas, dan nominal transaksi) |
| **Peringatan Inventaris & Restock Produk** | `.db-stock-alert-section`, `.db-stock-alert-card`, `.db-stock-badge-item`, `.db-stock-pill` | Banner peringatan inventaris dinamis di bagian bawah dashboard yang mendeteksi produk dengan stok menipis (`stok <= 5`) atau habis (`stok = 0`) dengan badge pill oranye/merah dan tautan langsung "+ Kelola di Master Produk →". Banner otomatis beralih menjadi status hijau aman jika seluruh persediaan terpenuhi |
| **Header & Filter Rentang Waktu** | `.db-header`, `.db-store-status-pill`, `.db-time-filter`, `.db-chip`, `.db-cta-kasir-btn` | Header dashboard dengan status live toko `● Toko Buka • Kasir Aktif`, tombol aksi cepat `+ Kasir Baru` di pojok kanan atas, serta kontrol filter rentang waktu instan (**Hari Ini, Minggu Ini, Bulan Ini, Custom**) bergaya iOS Segmented Pill Bar 1-baris yang ramping (hanya 34px) sehingga menghemat ruang vertikal secara optimal di tampilan mobile |
| **Mobile First-View Optimization & Alignment Simetris** | `.db-header`, `.db-kpi-grid`, `.db-kpi-card.is-primary`, `.db-kpi-card.is-stat-card`, `.db-kpi-card.is-inventory` | Tata letak adaptif khusus mobile (`≤768px`) yang menempatkan: (1) Header navigasi ringkas dengan tombol `+ Kasir Baru` sejajar judul, (2) 1-row segmented filter pill, (3) Kartu Master Finansial Hero full width, (4) **Kartu Sekunder Laba Bersih & Total Transaksi Berdampingan Sejajar Presisi (Pixel-Perfect Alignment)**: lock min-height `.db-kpi-head` 42px, padding 12px 11px, icon 26px, `white-space: nowrap` pada label & tag bullet `●`, penyetaraan baseline Y teks nominal dan subteks 1 baris bebas overflow, (5) Strip status inventaris horizontal, serta (6) Grafik Tren Penjualan SVG yang langsung tampak above-the-fold |
| **Halaman Master Kategori** | `kategori.html`, `.cat-header`, `.cat-toolbar`, `.cat-grid`, `.cat-card` | Halaman katalog kategori toko sesuai referensi desain: header counter "8 kategori terdaftar", tombol pill ungu "+ Tambah Kategori", toolbar pencarian live search ("Cari kategori...") dan toggle tampilan Grid/List. Kartu kategori modern dengan artwork ilustrasi sampul SVG, judul tebal, subtitle deskripsi, serta action pill buttons (Edit & Hapus) yang muncul melayang di pojok kanan atas kartu saat hover. Didukung modal dialog tambah/edit dan persistensi `localStorage` (`ap_master_categories`) |
| **Kartu Kategori & Aksi** | `.cat-card`, `.cat-card-media`, `.cat-card-actions`, `.cat-action-btn` | Kartu kategori rounded 18px berlatar putih dengan border halus `#edf2f7`, rasio aspek media 16:10, hover elevation `-3px`. Tombol aksi edit & hapus mengambang dengan latar semi-transparan `rgba(255,255,255,0.92)` dan backdrop-filter blur. Mendukung mode List View (`.is-list-view`) dengan kartu horizontal |
| **Modal Kategori** | `.cat-modal`, `.cat-form`, `.cat-input` | Modal dialog rounded 20px untuk menambah atau menyunting nama kategori, deskripsi, dan template sampul dengan validasi form dan feedback toast interaktif |
| **Produk Dual View (Card vs List)** | `produk.html`, `.prod-view-toggles`, `.prod-view-btn`, `.prod-cards-grid`, `.prod-card-item` | Mode tampilan ganda pada halaman Master Produk: **Card View** (kartu visual produk dengan thumbnail emoji pastel, badge stok gelap `Stok: N`, badge kategori ungu, nama produk, kode SKU, perbandingan Harga Beli dan Harga Jual biru tebal, serta tombol aksi Edit/Hapus saat hover) dan **List View** (tabel komprehensif 8 kolom dengan SKU, batch, kedaluwarsa, stok, harga jual, dan status pill). Pilihan mode disimpan persisten di `localStorage` (`ap_prod_view_mode`) |
| **Riwayat Transaksi (Log Transaksi Kasir & Audit Trail)** | `transaksi.html`, `.trx-page-header`, `.trx-table-card`, `.trx-table`, `.trx-btn-filter`, `.trx-btn-new`, `.trx-badge-customer`, `.trx-badge-pay`, `.trx-badge-status`, `.trx-badge-item`, `.trx-col-profit` | Halaman riwayat transaksi kasir operasional dengan kartu tabel putih bersih ber-shadow halus. Header menampilkan judul "Riwayat Transaksi" dengan ikon jam/history ungu indigo, subtitle dinamis jumlah transaksi, tombol outline "Filter" dengan popover rentang waktu & live search, serta tombol solid indigo pill "Transaksi Baru" ke Kasir. Kolom tabel 11 kolom: **NO, INVOICE (tebal), TANGGAL, KASIR, PELANGGAN (soft grey pill badge), METODE BAYAR (badge Tunai 💵, QRIS 📱, Debit 💳), ITEM (circle count badge), STATUS (badge hijau ● Selesai), TOTAL (tebal), PROFIT (hijau emerald +Rp N tabular), dan STRUK (icon printer)**. |
| **Laporan Penjualan (2026 Bento Analytics & First Page View Architecture)** | `laporan.html`, `.rpt-header`, `.rpt-live-badge`, `.rpt-header-controls`, `.rpt-top-ctrl-box`, `.rpt-top-label`, `.rpt-top-select`, `.rpt-period-group`, `.rpt-period-type-pills`, `.rpt-type-pill`, `.rpt-ai-insight-bar`, `.rpt-ai-sparkle`, `.rpt-ai-insight-text`, `.rpt-ai-tag`, `.rpt-ai-health-pill`, `.rpt-pulse-green`, `.rpt-bento-grid`, `.rpt-bento-card`, `.rpt-bento-head`, `.rpt-bento-label-wrap`, `.rpt-bento-label`, `.rpt-bento-tag`, `.rpt-bento-icon`, `.rpt-bento-body`, `.rpt-bento-val-row`, `.rpt-bento-sparkline`, `.rpt-bento-value`, `.rpt-bento-sub`, `.rpt-store-badge`, `.rpt-tabs-bar`, `.rpt-tab-btn`, `.rpt-tab-pill`, `.rpt-view-panel`, `.rpt-table-filters`, `.rpt-filter-item`, `.rpt-filter-label`, `.rpt-filter-select`, `.rpt-prod-cell`, `.rpt-cat-badge`, `.rpt-qty-badge`, `.rpt-share-cell`, `.rpt-share-bar-wrap.profit`, `.rpt-share-bar-fill.profit`, `.rpt-share-pct.profit`, `.rpt-col-profit`, `.rpt-log-time`, `.rpt-log-invoice`, `.rpt-log-cashier`, `.rpt-table-footer` | **Rombak Total First Page View Laporan Penjualan Berbasis Tren UI/UX 2026 (Clean High-Density Bento Grid & Decision-First Architecture)**: (1) **Header Streamlined & Live Analytics Pill**: Judul "Laporan Penjualan" dilengkapi badge status `Live Analytics` dengan pulse-dot, subtitle ringkas, dan dropdown controls (Toko & Periode Bulanan/Mingguan) kapsul putih bersih yang sejajar di desktop/tablet; (2) **2026 AI Smart Decision & Executive Summary Bar (`.rpt-ai-insight-bar`)**: Banner ringkasan eksekutif pintar bergradasi lembut dengan ikon sparkle ungu, teks natural language auto-generated yang merangkum performa omzet, laba bersih, dan kontributor driver produk utama, serta badge pill kesehatan finansial (`Margin Sehat 27.2%`) dengan indikator denyut hijau (`.rpt-pulse-green`); (3) **4 Bento Analytics Cards Berlatar Putih SaaS dengan Top Accent Lines & Mini Sparkline Trends**: Menggantikan kartu gradasi berat yang memakan ruang vertikal. Dilengkapi kurva mini sparkline SVG dinamis pada tiap kartu indikator: **Card 1: Master Omzet Penjualan** (indigo top line, tag Gross Realtime, sparkline ungu), **Card 2: Total Keuntungan** (emerald green top line, badge Margin Laba, sparkline hijau), **Card 3: Volume Penjualan** (sky blue top line, badge SKU berkontribusi, sparkline biru), dan **Card 4: Top Performer Showcase** (amber gold top line, star tag, nama produk terlaris dengan preview omzet); (4) **Optimalisasi Above-the-Fold Responsif**: Pada **Desktop (1440px)** seluruh KPI, ringkasan eksekutif, dan **7 baris data tabel langsung tampak tanpa scroll**; pada **Tablet (768px)** grid 2x2 rapi dan 5 baris tabel terlihat jelas; pada **Mobile (390px / 360px)** tata letak adaptif (Hero card full width, 2 kartu 50/50, Top Performer horizontal bar) yang kompak menyisakan ruang luas sehingga segmented tab, filter, dan data tabel teratas langsung tampil di first page view; (5) **Dual Tampilan Data & Filter Dropdown**: Tab Rekap per Produk (10 kolom) dan Tab Log Penjualan Item (12 kolom termasuk kolom TOKO) dengan filter terpadu |
| **Laporan Keuntungan / Profit** | `profit.html`, `.profit-table-footer` | Halaman analisis profit dan margin keuntungan toko: header dengan ikon koin hijau, tombol Print & Filter. Empat kartu hero fokus laba (**Total Profit** hijau Rp 192.800, **Rata-rata Profit** indigo Rp 27.543, **Margin Kotor** orange 28.04%, **Transaksi Terbaik** cyan TRX-O7CVEG5R) dengan watermark SVG. Tabel data 8 kolom (NO, INVOICE, TANGGAL, KASIR, PELANGGAN, ITEM, PENJUALAN, PROFIT) dilengkapi baris **Total Profit** di sudut kanan bawah tabel. Terkoneksi mandiri melalui kategori LAPORAN di sidebar |

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
