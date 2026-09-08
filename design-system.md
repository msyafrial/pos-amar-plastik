# Design System — Amar Plastik POS (2026 Enterprise Edition)

## 1. Typography
* **Primary Font:** Inter / Plus Jakarta Sans (`'Inter', 'Plus Jakarta Sans', sans-serif`)
* **Monospace Font:** Consolas, Menlo, Monaco, monospace (for SKU, Invoice, Price tabular numbers)
* **Weights:** Regular (400), Medium (500), Semi-bold (600), Bold (700), Extra Bold (800)

## 2. Color Palette
* **Brand Primary:** `#4f46e5` (Indigo 600), Hover `#4338ca` (Indigo 700)
* **Background Canvas:** `#f8fafc` (Slate 50)
* **Card Surface:** `#ffffff` (White) with border `#e2e8f0` (Slate 200)
* **Text Colors:**
  * Heading / Primary: `#0f172a` (Slate 900)
  * Secondary / Meta: `#64748b` (Slate 500)
  * Muted: `#94a3b8` (Slate 400)
* **Status Colors:**
  * Profit / Success: `#059669` (Emerald 600), Background `#ecfdf5`
  * Revenue / Info: `#2563eb` (Blue 600), Background `#eff6ff`
  * Warning: `#d97706` (Amber 600), Background `#fffbeb`
  * Danger: `#dc2626` (Red 600), Background `#fef2f2`

## 3. Component Hierarchy: Laporan Views
### Tri-Tab Navigation
Container: `.rpt-tabs-bar`
* Tab 1 (`#tabBtnSummary`): Rekap Penjualan (Per Produk / SKU)
* Tab 2 (`#tabBtnItems`): Log Penjualan Item (Itemized Granular Sales)
* Tab 3 (`#tabBtnTrx`): Log Transaksi Kasir (Per Invoice / Receipt)

### Panel Architecture
Each panel is isolated within a `.rpt-view-panel`:
* `#panelSummary`: Contains `.rpt-table-filters` (Search bar, Combobox Popover, Dual-Action Sort) + `.trx-table-card` (Table & Cards).
* `#panelItems`: Contains `.rpt-table-filters` (Search bar, Filter Button, Bottom Sheet Trigger) + `.trx-table-card` (Table & Cards).
* `#panelTrx`: Contains `.rpt-table-filters` (Search bar, Filter Button, Bottom Sheet Trigger) + `.trx-table-card` (Table & Cards).

## 4. Mobile Bottom Sheet Pattern (2026)
* Trigger: `.rpt-mfilter-trigger-btn` with active indicator `.rpt-mfilter-dot`
* Sheet Backdrop: `.rpt-mfilter-backdrop`
* Sheet Container: `.rpt-mfilter-sheet` with drag handle `.rpt-mfilter-handle`
* Selection: Searchable pill list + action buttons (Reset / Terapkan)

## 5. Table & Card Summary Footer (.rpt-table-footer)
* **Structure:**
  * `.rpt-footer-stats`: Multi-metric grid (2 columns on mobile, row wrap on desktop) containing `.rpt-fstat-item` cards.
  * `.rpt-fstat-item`: Micro-stat card displaying uppercase meta label (`.rpt-fstat-lbl`) and tabular bold value (`.rpt-fstat-val`).
  * `.rpt-footer-grand`: Gradient highlight banner displaying the grand accumulation metric (Omzet/Nilai Item/Nilai Transaksi).
* **Mobile Adaptability:**
  * Background: White card footer (`#ffffff`), `border-top: 1px solid #e2e8f0`, `border-radius: 0 0 14px 14px`.
  * Grid: 2-column auto-balanced layout (`repeat(2, 1fr)`) with single trailing item spanning both columns.
  * Grand total positioned at bottom (`order: 2`) with prominent indigo gradient theme.

## 6. Data Table Pagination (.rpt-pagination-bar)
* **Design Philosophy:** Clean, responsive, and tactile enterprise pagination bar placed beneath tables and mobile cards in all report views (Rekap, Log Item, Log Transaksi).
* **Structure:**
  * Container: `.rpt-pagination-bar` (`display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid #f1f5f9; background: #ffffff;`)
  * **Left Side (`.rpt-pager-left`):**
    * Label: `.rpt-pager-lbl` (`font-size: 12px; color: #64748b; font-weight: 500;`)
    * Per-Page Select: `.rpt-pager-perpage-select` (`font-size: 12px; font-weight: 600; color: #0f172a; padding: 4px 8px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer;`)
    * Standard Options: `10`, `15`, `20`, `50`, `100` rows per page.
  * **Center/Info (`.rpt-pager-info`):**
    * Displays current item range and total count: `"Menampilkan X–Y dari Z {unit}"`.
    * Typography: `font-size: 12.5px; color: #64748b; font-variant-numeric: tabular-nums;`
  * **Right Side / Navigation (`.rpt-pager-nav`):**
    * Prev/Next Buttons: `.rpt-pager-prev`, `.rpt-pager-next` (`width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px;`)
    * Page Number Buttons: `.rpt-pager-btn` (`min-width: 32px; height: 32px; border-radius: 8px; font-weight: 600; font-size: 12.5px;`)
    * Active State: `.rpt-pager-btn.is-active` (`background: #4f46e5; color: #ffffff; border-color: #4f46e5; shadow: 0 2px 4px rgba(79, 70, 229, 0.2);`)
    * Overflow Ellipsis: `.rpt-pager-ellipsis` (`color: #94a3b8; padding: 0 4px;`)
* **Responsive Behavior (Mobile <= 768px):**
  * Layout transitions from horizontal bar to structured multi-tier layout (`flex-direction: column; gap: 10px; align-items: stretch;`).
  * Top bar wraps per-page selector and counter info (`display: flex; justify-content: space-between;`).
  * Pager buttons expand or center with touch-friendly 36px touch targets.
## 7. Store Location Dropdown Popover (.rpt-store-dropdown-wrap)
* **Design Philosophy:** Eliminates outdated, OS-native `<select>` boxes in favor of an ultra-modern, glassmorphism-inspired custom popover menu with rich branch identity, subtitle details, status badges, and dynamic icon tints.
* **Trigger Component (`.rpt-top-ctrl-box.rpt-store-dropdown-btn`):**
  * Capsule shape with `background: #ffffff`, `border: 1px solid #e2e8f0`, `border-radius: 12px`.
  * **Dynamic Icon Badge (`.rpt-top-icon-badge`):** Transitions soft color background & icon tint matching selected store (Pusat: `#eef2ff`/`#4338ca`, Cabang 2: `#ecfdf5`/`#047857`, Cabang 3: `#fffbeb`/`#b45309`, Semua: `#f1f5f9`/`#475569`).
  * **Micro-Label:** `"LOKASI"` (`font-size: 8.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase;`).
  * **Selected Value Display (`.rpt-top-select-name`):** Bold typography (`13px`, `#0f172a`), transitions to indigo when active.
  * **Animated Chevron:** Smooth 180° rotation when open (`.is-open`).
* **Popover Container (`.rpt-store-popover`):**
  * `background: #ffffff`, `border-radius: 14px`, `border: 1px solid #e2e8f0`.
  * Depth: `box-shadow: 0 16px 36px -6px rgba(15, 23, 42, 0.14), 0 4px 12px rgba(0, 0, 0, 0.04);`.
  * Entrance animation: `storePopoverIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)`.
  * Popover Header: Micro uppercase title `"PILIH OUTLET / CABANG"` with active count badge `"3 Cabang Aktif"`.
* **Store Option Items (`.rpt-store-opt`):**
  * Distinct colored store icon container (`.all`, `.pusat`, `.cabang2`, `.cabang3`).
  * Two-line content: bold store name (`.rpt-store-opt-name`) + address/role subtitle (`.rpt-store-opt-sub`).
  * Right-aligned store badge (`.rpt-store-badge`) and dynamic checkmark icon (`.rpt-store-opt-check`) when selected.
* **Mobile Adaptability (Mobile <= 768px):**
  * Container expands to full width (`width: 100%`).
  * Popover anchors flush across the viewport width (`left: 0; right: 0; width: 100%;`).
  * Touch targets enhanced with minimum 44px height for comfortable thumb tap interaction.



