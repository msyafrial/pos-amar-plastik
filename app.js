/* ============================================================
   Amar Plastik — Data produk
   ============================================================ */
const CATEGORIES = [
  { id: "all",      name: "Semua",     emoji: "🛍️", count: 8 },
  { id: "kue",      name: "Bahan Kue", emoji: "🎂", count: 4 },
  { id: "plastik",  name: "Plastik",   emoji: "🛍️", count: 2 },
  { id: "kemasan",  name: "Kemasan",   emoji: "🧁", count: 2 },
];

const MENU = [
  { id: 1, name: "Tepung Terigu 1kg",     cat: "kue",     emoji: "🌾", tint: "#fdf3e7", price: 12500, old: 15000, stock: 48, exp: "03/27", sku: "SKU-00001", batch: "BRG001-0926-A" },
  { id: 2, name: "Gula Pasir 1kg",        cat: "kue",     emoji: "🧂", tint: "#f6f1fd", price: 15500, old: null,  stock: 36, exp: "09/27", sku: "SKU-00002", batch: "BRG002-0826-B" },
  { id: 3, name: "Mentega 250gr",         cat: "kue",     emoji: "🧈", tint: "#fdf6e3", price: 18900, old: 22000, stock: 24, exp: "01/27", sku: "SKU-00003", batch: "BRG003-0726-C" },
  { id: 4, name: "Coklat Bubuk 500gr",    cat: "kue",     emoji: "🍫", tint: "#f3e9e2", price: 26500, old: null,  stock: 18, exp: "05/27", sku: "SKU-00004", batch: "BRG004-0926-D" },
  { id: 5, name: "Plastik Kresek L",      cat: "plastik", emoji: "🛍️", tint: "#eef4fd", price: 8500,  old: null,  stock: 3,  exp: null,    sku: "SKU-00005", batch: "BRG005-1026-A" },
  { id: 6, name: "Mica Bento Kotak",      cat: "kemasan", emoji: "🍱", tint: "#eef7ee", price: 12000, old: 14500, stock: 60, exp: null,    sku: "SKU-00006", batch: "BRG006-0826-B" },
  { id: 7, name: "Cup Puding Isi 50",     cat: "kemasan", emoji: "🧁", tint: "#fff0ec", price: 21500, old: null,  stock: 15, exp: null,    sku: "SKU-00007", batch: "BRG007-1026-C" },
  { id: 8, name: "Plastik Vacuum 1kg",    cat: "plastik", emoji: "🥡", tint: "#f0eefb", price: 27500, old: null,  stock: 0,  exp: null,    sku: "SKU-00008", batch: "BRG008-0926-D" },
];

const TAX_RATE = 0.10;
const CAT_NAME = Object.fromEntries(CATEGORIES.map(c => [c.id, c.name]));
const ITEM = Object.fromEntries(MENU.map(m => [m.id, m]));

/* ---- Riwayat transaksi (persisten via localStorage) ---- */
function loadHistory() {
  try { return JSON.parse(localStorage.getItem("ap_history") || "[]"); }
  catch { return []; }
}
function saveHistory(list) {
  localStorage.setItem("ap_history", JSON.stringify(list));
}

/* ============================================================
   State
   ============================================================ */
const state = {
  cart: new Map(),          // id -> qty
  category: "all",
  query: "",
  filterStatus: "all",      // all, ready, promo, low
  sortBy: "default",        // default, price-asc, price-desc, name-asc, stock-desc
  payment: "Cash",
  history: [],              // riwayat transaksi sesi ini
};

/* ============================================================
   Helpers
   ============================================================ */
const rp = n => "Rp " + Math.round(n).toLocaleString("id-ID");
const $ = sel => document.querySelector(sel);

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("is-show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("is-show"), 2600);
}

/* ============================================================
   Renderers
   ============================================================ */
function renderCategories() {
  $("#categories").innerHTML = CATEGORIES.map(c => `
    <button class="cat-chip ${c.id === state.category ? "is-active" : ""}" data-cat="${c.id}">
      <strong>${c.name}</strong>
      <small>${c.count} produk</small>
    </button>
  `).join("");
}

function filteredMenu() {
  const q = state.query.trim().toLowerCase();
  let list = MENU.filter(m => {
    // Kategori
    if (state.category !== "all" && m.cat !== state.category) return false;

    // Search query
    if (q && !m.name.toLowerCase().includes(q) && !CAT_NAME[m.cat].toLowerCase().includes(q)) return false;

    // Filter status stok
    if (state.filterStatus === "ready" && (m.stock <= 0)) return false;
    if (state.filterStatus === "promo" && !m.old) return false;
    if (state.filterStatus === "low" && (m.stock <= 0 || m.stock > 5)) return false;

    return true;
  });

  // Sorting
  if (state.sortBy === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (state.sortBy === "stock-desc") {
    list.sort((a, b) => b.stock - a.stock);
  }

  return list;
}

function renderMenu() {
  const items = filteredMenu();
  if (!items.length) {
    $("#menuGrid").innerHTML = `<div class="menu-empty">Produk tidak ditemukan.<br>Coba kata kunci atau kategori lain.</div>`;
    return;
  }
  $("#menuGrid").innerHTML = items.map(m => {
    const discount = m.old ? Math.round((1 - m.price / m.old) * 100) : 0;

    // Tag produk — bisa tampil bersamaan, wrap otomatis dalam kartu
    const out = m.stock === 0;
    const badges = [];
    if (discount) badges.push(`<span class="badge is-blue" title="Diskon ${discount}%">Diskon ${discount}%</span>`);
    if (out) badges.push(`<span class="badge is-red" title="Stok habis">Stok Habis</span>`);
    else if (m.stock <= 5) badges.push(`<span class="badge is-yellow" title="Stok menipis">Stok Menipis</span>`);
    else badges.push(`<span class="badge is-green" title="Siap jual">Ready</span>`);
    if (m.exp) badges.push(`<span class="badge is-gray" title="Kedaluwarsa">EXP ${m.exp}</span>`);

    return `
    <button class="card ${out ? "is-disabled" : ""}" data-add="${m.id}" ${out ? "disabled aria-disabled=\"true\"" : ""} title="${out ? `${m.name} — stok habis` : `Tambah ${m.name} ke pesanan`}">
      <div class="card-media" style="background:${out ? "linear-gradient(135deg, #eceef2, #d9dde4)" : m.tint}">
        <span class="card-badges">${badges.join("")}</span>
        <span class="media-emoji" aria-hidden="true">${m.emoji}</span>
      </div>
      <span class="card-name">${m.name}</span>
      <span class="card-price">
        ${m.old ? `<s>${rp(m.old)}</s><strong>${rp(m.price)}</strong>` : `<strong class="only">${rp(m.price)}</strong>`}
      </span>
      <span class="card-meta">
        <span>${CAT_NAME[m.cat]}</span>
        <span class="stock ${m.stock <= 5 ? "low" : ""}">${m.stock} Stok</span>
      </span>
    </button>`;
  }).join("");
}

function renderCart() {
  const list = $("#orderList");
  if (!state.cart.size) {
    list.innerHTML = `
      <div class="order-empty">
        <span class="big">🧾</span>
        Keranjang kosong.<br>Pilih produk untuk mulai transaksi.
      </div>`;
  } else {
    list.innerHTML = [...state.cart.entries()].map(([id, qty]) => {
      const m = ITEM[id];
      const atCap = qty >= m.stock;   // stok maksimal tercapai
      return `
      <div class="order-item">
        <span class="oi-thumb" style="background:${m.tint}">${m.emoji}</span>
        <span class="oi-info">
          <strong>${m.name}</strong>
          <small>${CAT_NAME[m.cat]} · Stok ${m.stock}</small>
        </span>
        <span class="oi-qty">
          <button class="del" data-dec="${id}" aria-label="Kurangi ${m.name}">−</button>
          <span>${qty}</span>
          <button data-inc="${id}" aria-label="Tambah ${m.name}" ${atCap ? "disabled title=\"Stok maksimal\"" : ""}>+</button>
          <button class="oi-del" data-del-item="${id}" aria-label="Hapus ${m.name} dari pesanan" title="Hapus ${m.name}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/></svg>
          </button>
        </span>
        <span class="oi-price">
          ${rp(m.price * qty)}
          <small>${qty} × ${rp(m.price)}</small>
          ${m.old ? `<small class="oi-save">Hemat ${rp((m.old - m.price) * qty)}</small>` : ""}
        </span>
      </div>`;
    }).join("");
  }
  updateTotals();
}

/* ============================================================
   Totals
   ============================================================ */
function updateTotals() {
  const qtyCount = [...state.cart.values()].reduce((a, b) => a + b, 0);
  const fabCount = $("#fabCount");
  fabCount.textContent = qtyCount;
  fabCount.style.display = qtyCount ? "grid" : "none";

  // Subtotal = harga normal (old); Diskon = selisih harga normal vs harga jual
  let sellingTotal = 0, listTotal = 0;

  for (const [id, qty] of state.cart) {
    const m = ITEM[id];
    sellingTotal += m.price * qty;
    listTotal += (m.old ?? m.price) * qty;
  }

  const discount = listTotal - sellingTotal;
  const tax = sellingTotal * TAX_RATE;
  const total = sellingTotal + tax;

  $("#subtotalVal").textContent = rp(listTotal);
  $("#discountVal").textContent = discount ? "− " + rp(discount) : "Rp 0";
  $("#taxVal").textContent = rp(tax);
  $("#totalVal").textContent = rp(total);
  $("#proceedBtn").disabled = !state.cart.size;
  $("#clearAll").disabled = !state.cart.size;   // hapus semua nonaktif jika keranjang kosong
}

/* ============================================================
   Actions
   ============================================================ */
function addToCart(id) {
  const m = ITEM[id];
  if (m.stock === 0) {           // pengaman: kartu disabled pun tak bisa diklik
    toast(`${m.name} — stok habis, tidak bisa dipesan`);
    return;
  }
  const current = state.cart.get(id) || 0;
  if (current >= m.stock) {      // maksimal sesuai stok produk
    toast(`Stok ${m.name} hanya ${m.stock}, tidak bisa ditambah lagi`);
    return;
  }
  state.cart.set(id, current + 1);
  renderCart();
  toast(`${m.name} ditambahkan ke pesanan`);
  // Stok tidak dikurangi di sini — stok dianggap berkurang saat transaksi diproses
}

function changeQty(id, delta) {
  const m = ITEM[id];
  const next = (state.cart.get(id) || 0) + delta;
  if (next <= 0) {
    state.cart.delete(id);
  } else if (next > m.stock) {   // maksimal sesuai stok produk
    toast(`Stok ${m.name} hanya ${m.stock}`);
    return;
  } else {
    state.cart.set(id, next);
  }
  renderCart();
}

function removeFromCart(id) {
  const m = ITEM[id];
  if (!state.cart.has(id)) return;
  state.cart.delete(id);
  renderCart();
  toast(`${m.name} dihapus dari pesanan`);
}

function clearCart() {
  if (!state.cart.size) return;
  state.cart.clear();
  renderCart();
  toast("Semua item dihapus — pesanan dibatalkan");
}

function askClearCart() {
  if (!state.cart.size) return;
  const n = [...state.cart.values()].reduce((a, b) => a + b, 0);
  // Konfirmasi via popup modal kustom
  showConfirm({
    icon: "🗑",
    title: "Hapus Semua Item",
    body: `Hapus semua ${n} item dari pesanan?\nPesanan akan dibatalkan.`,
    okText: "Ya, Hapus Semua",
    okClass: "danger",
    onOk: () => clearCart(),
  });
}

function toggleOrderPanel(open) {
  const panel = $(".order");
  if (!panel) return;
  const isOpen = open !== undefined ? open : !panel.classList.contains("is-open");
  panel.classList.toggle("is-open", isOpen);
  const fab = $("#cartFab");
  if (fab) fab.classList.toggle("is-hidden", isOpen);
  const backdrop = $("#orderBackdrop");
  if (backdrop) backdrop.hidden = !isOpen;
}

function proceed() {
  if (!state.cart.size) return;
  const total = $("#totalVal").textContent;
  const n = [...state.cart.values()].reduce((a, b) => a + b, 0);
  // Konfirmasi via popup modal kustom
  showConfirm({
    icon: "🛒",
    title: "Proses Transaksi",
    body: `Jumlah item : ${n}\nTotal       : ${total}\nPembayaran  : ${state.payment}`,
    okText: state.payment === "Cash" ? "Ya, Proses" : "Ya, Proses",
    okClass: "success",
    onOk: () => completeTransaction(),
    cash: state.payment === "Cash",   // Cash: wajib input uang dibayarkan dulu
  });
}

function completeTransaction() {
  const total = $("#totalVal").textContent;
  const trxCode = generateTrxCode();
  const timeStr = nowText();

  // Catat transaksi ke localStorage (terbaca di transaksi.html & laporan.html)
  const items = [...state.cart.entries()].map(([id, qty]) => ({
    name: ITEM[id].name, qty, price: ITEM[id].price,
  }));
  const history = loadHistory();
  history.unshift({
    trx: trxCode,
    time: timeStr,
    payment: state.payment,
    totalNum: parseInt(total.replace(/[^\d]/g, ""), 10),
    itemCount: items.reduce((s, i) => s + i.qty, 0),
    items,
  });
  saveHistory(history);
  showReceipt(total, trxCode, timeStr);
  state.cart.clear();
  renderCart();
  toggleOrderPanel(false);
}

/* ============================================================
   Modal konfirmasi kustom (popup, menggantikan confirm())
   ============================================================ */
let confirmCb = null;
let cashPaid = null;   // nominal tunai yang dibayarkan (untuk struk)

function showConfirm({ icon, title, body, okText = "Ya, Lanjutkan", okClass = "danger", onOk, cash = false }) {
  confirmCb = onOk;
  $("#modalIcon").textContent = icon;
  $("#modalTitle").textContent = title;
  $("#modalBody").textContent = body;
  const ok = $("#modalOk");
  ok.textContent = okText;
  ok.className = "modal-btn " + okClass;

  // Mode Cash: tampilkan box input uang + kalkulasi kembalian
  const cashBox = $("#cashBox");
  cashBox.hidden = !cash;
  const totalNum = [...state.cart.entries()].reduce((s, [id, q]) => s + ITEM[id].price * q, 0) * (1 + TAX_RATE);
  const grandTotal = Math.round(totalNum);
  if (cash) {
    const input = $("#cashInput");
    // Default: uang dibayarkan = total belanja (bukan 0)
    input.value = grandTotal.toLocaleString("id-ID");
    input.classList.remove("is-error");
    input.dataset.total = grandTotal;
    $("#cashError").hidden = true;
    // Reset pilihan cepat & dropdown — hindari state sisa transaksi sebelumnya
    // (option yang masih selected tidak akan memicu event change saat dipilih lagi)
    document.querySelectorAll(".cash-btn").forEach(b => b.classList.remove("is-active"));
    $("#cashMore").value = "";
    updateCashChange();
    // Kursor di akhir teks agar kasir bisa langsung mengetik koreksi
    setTimeout(() => { input.focus(); input.select(); }, 50);
  }

  $("#modalBackdrop").hidden = false;
  if (!cash) ok.focus();
}

function closeConfirm(result) {
  $("#modalBackdrop").hidden = true;
  const cb = confirmCb;
  confirmCb = null;
  if (result && cb) cb();
}

/* ---- Kalkulasi tunai ---- */
function getCashAmount() {
  const raw = $("#cashInput").value.replace(/[^\d]/g, "");
  return raw ? parseInt(raw, 10) : 0;
}

function updateCashChange() {
  const total = parseInt($("#cashInput").dataset.total || "0", 10);
  const paid = getCashAmount();
  const diff = paid - total;
  const changeEl = $("#cashChange");
  const input = $("#cashInput");

  // Baris kalkulasi: Total / Dibayar / Kembalian
  $("#ccTotal").textContent = rp(total);
  $("#ccPaid").textContent = rp(paid);

  if (paid <= 0) {
    changeEl.textContent = rp(0);
    changeEl.classList.remove("is-short");
    input.classList.remove("is-error");
    $("#cashError").hidden = true;
  } else if (diff >= 0) {
    changeEl.textContent = rp(diff);
    changeEl.classList.remove("is-short");
    input.classList.remove("is-error");
    $("#cashError").hidden = true;
  } else {
    changeEl.textContent = "− " + rp(-diff);
    changeEl.classList.add("is-short");
    input.classList.add("is-error");
    $("#cashError").hidden = false;
  }
}

$("#cashInput").addEventListener("input", e => {
  // Format ribuan saat mengetik
  const raw = e.target.value.replace(/[^\d]/g, "");
  e.target.value = raw ? parseInt(raw, 10).toLocaleString("id-ID") : "";
  document.querySelectorAll(".cash-btn").forEach(b => b.classList.remove("is-active"));
  updateCashChange();
});

document.querySelectorAll(".cash-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    $("#cashInput").value = parseInt(btn.dataset.cash, 10).toLocaleString("id-ID");
    document.querySelectorAll(".cash-btn").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    $("#cashMore").value = "";   // reset dropdown
    updateCashChange();
  });
});

$("#cashMore").addEventListener("change", e => {
  if (!e.target.value) return;
  $("#cashInput").value = parseInt(e.target.value, 10).toLocaleString("id-ID");
  document.querySelectorAll(".cash-btn").forEach(b => b.classList.remove("is-active"));
  updateCashChange();
});

$("#modalOk").addEventListener("click", () => {
  // Jika mode cash aktif, validasi uang cukup sebelum lanjut
  if (!$("#cashBox").hidden) {
    const total = parseInt($("#cashInput").dataset.total || "0", 10);
    const paid = getCashAmount();
    if (paid < total) {
      updateCashChange();
      $("#cashInput").focus();
      return;   // blok: uang kurang
    }
    cashPaid = paid;
  } else {
    cashPaid = null;
  }
  closeConfirm(true);
});
$("#modalCancel").addEventListener("click", () => closeConfirm(false));
$("#modalBackdrop").addEventListener("click", e => {
  if (e.target === e.currentTarget) closeConfirm(false);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !$("#modalBackdrop").hidden) closeConfirm(false);
});

/* ============================================================
   Popup struk — hitam putih
   ============================================================ */
const STORE = {
  name: "AMAR PLASTIK",
  address: "Jl. Raya Industri No. 88, Medan",
  phone: "061-1234-5678",
  cashier: "Lina Puspa Melinda",
};

function generateTrxCode() {
  const d = new Date();
  const pad = (v, l = 2) => String(v).padStart(l, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TRX-${stamp}-${rand}`;
}

function nowText() {
  const now = new Date();
  const pad = (v) => String(v).padStart(2, "0");
  return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function showReceipt(totalText, trxCode, timeStr) {
  $("#rTrx").textContent = trxCode || generateTrxCode();
  $("#rTime").textContent = timeStr || nowText();
  $("#rCashier").textContent = STORE.cashier;
  $("#rPay").textContent = state.payment;

  // Rincian item — item berdiskon menampilkan harga normal (dicoret) + potongan per item
  $("#rItems").innerHTML = [...state.cart.entries()].map(([id, qty]) => {
    const m = ITEM[id];
    const hasDisc = !!m.old;
    const discPerItem = hasDisc ? m.old - m.price : 0;
    return `
    <div class="ri-row">
      <div class="ri-name">${m.name}</div>
      <div class="ri-line">
        <span>${qty} x ${rp(m.price)}</span>
        <span>${rp(m.price * qty)}</span>
      </div>
      ${hasDisc ? `
      <div class="ri-line ri-disc">
        <span>Harga normal ${rp(m.old)}</span>
        <span>− ${rp(discPerItem * qty)}</span>
      </div>` : ""}
    </div>`;
  }).join("");

  // Ringkasan
  const listTotal = $("#subtotalVal").textContent;
  const disc = $("#discountVal").textContent;
  const tax = $("#taxVal").textContent;
  $("#rTotals").innerHTML = `
    <div><span>Subtotal</span><span>${listTotal}</span></div>
    <div><span>Diskon Produk</span><span>${disc}</span></div>
    <div><span>Pajak 10%</span><span>${tax}</span></div>
    <div class="rt-total"><span>TOTAL</span><span>${totalText}</span></div>`;

  // Dibayar & kembalian: tunai = nominal riil; debit/QRIS = sama dengan total (kembalian 0)
  const totalNum = parseInt(totalText.replace(/[^\d]/g, ""), 10);
  const paid = state.payment === "Cash" && cashPaid != null ? cashPaid : totalNum;
  const change = paid - totalNum;
  $("#rPayLine").innerHTML = `
    <div class="rt-pay"><span>Dibayar (${state.payment})</span><span>${rp(paid)}</span></div>
    <div class="rt-pay"><span>Kembalian</span><span>${rp(change)}</span></div>`;

  $("#receiptBackdrop").hidden = false;
  // Reset scroll isi struk ke atas & fokus ke tombol Selesai (footer tetap terlihat)
  $(".receipt-body").scrollTop = 0;
  $("#receiptDone").focus();
}

// Footer struk: Cetak (stub printer — UI saja) & Selesai (tutup struk)
$("#receiptPrint").addEventListener("click", () => {
  toast("Menghubungkan ke printer… (printer belum terpasang)");
});
$("#receiptDone").addEventListener("click", () => {
  $("#receiptBackdrop").hidden = true;
  toggleOrderPanel(false);
  toast("Transaksi selesai ✅");
});
$("#receiptBackdrop").addEventListener("click", e => {
  if (e.target === e.currentTarget) {
    $("#receiptBackdrop").hidden = true;
    toggleOrderPanel(false);
  }
});

/* ============================================================
   Events
   ============================================================ */
$("#categories").addEventListener("click", e => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  state.category = btn.dataset.cat;
  renderCategories();
  renderMenu();
});

$("#menuGrid").addEventListener("click", e => {
  const card = e.target.closest("[data-add]");
  if (card) addToCart(+card.dataset.add);
});

$("#orderList").addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const del = e.target.closest("[data-del-item]");
  if (inc) changeQty(+inc.dataset.inc, +1);
  if (dec) changeQty(+dec.dataset.dec, -1);
  if (del) removeFromCart(+del.dataset.delItem);
});

$("#searchInput").addEventListener("input", e => {
  state.query = e.target.value;
  renderMenu();
});

$("#paymentRow").addEventListener("click", e => {
  const btn = e.target.closest("[data-pay]");
  if (!btn) return;
  state.payment = btn.dataset.pay;
  document.querySelectorAll(".pay-btn").forEach(b => {
    const active = b === btn;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-checked", active);
  });
});

$("#proceedBtn")?.addEventListener("click", proceed);
$("#clearAll")?.addEventListener("click", askClearCart);

/* ---- Filter & Sorting Popover ---- */
let tempFilterStatus = "all";
let tempSortBy = "default";

function toggleFilterPopover(force) {
  const popover = $("#filterPopover");
  const btn = $("#filterBtn");
  if (!popover || !btn) return;
  const shouldOpen = force !== undefined ? force : popover.hidden;
  popover.hidden = !shouldOpen;
  btn.setAttribute("aria-expanded", String(shouldOpen));

  if (shouldOpen) {
    // Sinkronkan state sementara dengan state saat ini
    tempFilterStatus = state.filterStatus;
    tempSortBy = state.sortBy;
    updateFilterUI();
  }
}

function updateFilterUI() {
  // Update chip aktif
  document.querySelectorAll(".fp-chip").forEach(chip => {
    chip.classList.toggle("is-active", chip.dataset.filter === tempFilterStatus);
  });
  // Update select sorting
  const sortSel = $("#sortSelect");
  if (sortSel) sortSel.value = tempSortBy;

  // Update badge tombol filter
  const hasFilter = state.filterStatus !== "all" || state.sortBy !== "default";
  const badge = $("#filterActiveBadge");
  const btn = $("#filterBtn");
  if (btn) btn.classList.toggle("is-active", hasFilter);
  if (badge) {
    badge.hidden = !hasFilter;
    let count = 0;
    if (state.filterStatus !== "all") count++;
    if (state.sortBy !== "default") count++;
    badge.textContent = count;
  }
}

$("#filterBtn")?.addEventListener("click", e => {
  e.stopPropagation();
  toggleFilterPopover();
});

// Pilih chip status stok
$("#filterPopover")?.addEventListener("click", e => {
  e.stopPropagation();
  const chip = e.target.closest(".fp-chip");
  if (chip) {
    tempFilterStatus = chip.dataset.filter;
    document.querySelectorAll(".fp-chip").forEach(c => {
      c.classList.toggle("is-active", c === chip);
    });
  }
});

// Pilih sorting
$("#sortSelect")?.addEventListener("change", e => {
  tempSortBy = e.target.value;
});

// Terapkan filter
$("#filterApplyBtn")?.addEventListener("click", () => {
  state.filterStatus = tempFilterStatus;
  state.sortBy = tempSortBy;
  updateFilterUI();
  toggleFilterPopover(false);
  renderMenu();
  const total = filteredMenu().length;
  toast(`Menampilkan ${total} produk`);
});

// Reset filter
$("#filterResetBtn")?.addEventListener("click", () => {
  tempFilterStatus = "all";
  tempSortBy = "default";
  state.filterStatus = "all";
  state.sortBy = "default";
  updateFilterUI();
  toggleFilterPopover(false);
  renderMenu();
  toast("Filter direset ke bawaan");
});

// Tutup popover filter saat klik di luar
document.addEventListener("click", e => {
  const popover = $("#filterPopover");
  if (!popover || popover.hidden) return;
  if (!e.target.closest(".filter-dropdown-wrap")) {
    toggleFilterPopover(false);
  }
});

// Panel order bisa dibuka-tutup di layar kecil (mobile/tablet portrait)
$(".order-head h2")?.addEventListener("click", () => {
  if (window.innerWidth <= 768) toggleOrderPanel();
});
$("#orderCloseBtn")?.addEventListener("click", () => toggleOrderPanel(false));
$("#orderBackdrop")?.addEventListener("click", () => toggleOrderPanel(false));

$("#cartFab")?.addEventListener("click", () => toggleOrderPanel(true));

/* ============================================================
   Init — contoh isi keranjang seperti desain
   ============================================================ */
state.cart.set(1, 1);   // Tepung Terigu
state.cart.set(6, 2);   // Mica Bento Kotak
state.cart.set(3, 1);   // Mentega

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    $(".order")?.classList.remove("is-open");
    const backdrop = $("#orderBackdrop");
    if (backdrop) backdrop.hidden = true;
    const fab = $("#cartFab");
    if (fab) fab.classList.remove("is-hidden");
  }
});

/* ---- Sidebar: navigasi & toggle buka/tutup modern ---- */
function toggleSidebar(forceState) {
  const app = document.querySelector(".app");
  if (!app) return;
  const isExpanded = forceState !== undefined ? forceState : !app.classList.contains("sidebar-expanded");
  app.classList.toggle("sidebar-expanded", isExpanded);
  try { localStorage.setItem("ap_sidebar", isExpanded ? "expanded" : "collapsed"); } catch {}

  const titleText = isExpanded ? "Tutup sidebar (Ctrl+B)" : "Buka sidebar (Ctrl+B)";
  document.querySelectorAll(".rail-edge-toggle, .sidebar-toggle-btn, .rail-toggle-btn, .topbar-toggle-btn").forEach(btn => {
    btn.setAttribute("title", titleText);
    btn.setAttribute("aria-label", titleText);
    btn.setAttribute("aria-expanded", String(isExpanded));
  });

  const backdrop = document.querySelector("#sidebarBackdrop");
  if (backdrop) {
    backdrop.hidden = !isExpanded || window.innerWidth > 768;
  }
}

function initSidebar(active) {
  if (active) {
    document.querySelectorAll(".rail-btn[data-page]").forEach(b =>
      b.classList.toggle("is-active", b.dataset.page === active)
    );
  }

  // Restore state tersimpan dari localStorage (default di desktop: collapsed / 72px)
  let saved = null;
  try { saved = localStorage.getItem("ap_sidebar"); } catch {}
  if (saved === "expanded" && window.innerWidth > 768) {
    document.querySelector(".app")?.classList.add("sidebar-expanded");
  }

  const isExpanded = document.querySelector(".app")?.classList.contains("sidebar-expanded") || false;
  const titleText = isExpanded ? "Tutup sidebar (Ctrl+B)" : "Buka sidebar (Ctrl+B)";
  document.querySelectorAll(".rail-edge-toggle, .sidebar-toggle-btn, .rail-toggle-btn, .topbar-toggle-btn").forEach(btn => {
    btn.setAttribute("title", titleText);
    btn.setAttribute("aria-label", titleText);
    btn.setAttribute("aria-expanded", String(isExpanded));
    btn.addEventListener("click", e => {
      e.preventDefault();
      toggleSidebar();
    });
  });

  // Saat sidebar dalam kondisi terbuka, klik menu navigasi atau tombol di sidebar menutup kembali sidebar
  document.querySelectorAll(".rail-btn, .rail-brand").forEach(item => {
    item.addEventListener("click", () => {
      toggleSidebar(false);
    });
  });

  // Saat sidebar tertutup pada desktop/tablet (>768px), klik pada rail di luar button membuka sidebar
  const railEl = document.querySelector(".rail");
  if (railEl) {
    railEl.addEventListener("click", e => {
      if (window.innerWidth <= 768) return; // Pada mobile layar kecil, gunakan tombol toggle
      const app = document.querySelector(".app");
      if (app && !app.classList.contains("sidebar-expanded")) {
        // Jika klik bukan pada button / link interaktif
        if (!e.target.closest(".rail-btn") && !e.target.closest(".rail-edge-toggle") && !e.target.closest(".rail-brand")) {
          toggleSidebar(true);
        }
      }
    });
  }

  const backdrop = document.querySelector("#sidebarBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => toggleSidebar(false));
  }

  // Tutup sidebar saat klik di luar area sidebar
  document.addEventListener("click", e => {
    const app = document.querySelector(".app");
    if (!app || !app.classList.contains("sidebar-expanded")) return;
    if (e.target.closest(".rail") || e.target.closest(".topbar-toggle-btn") || e.target.closest(".sidebar-toggle-btn") || e.target.closest(".rail-edge-toggle")) return;
    toggleSidebar(false);
  });

  // Keyboard shortcut Ctrl+B / Cmd+B untuk toggle sidebar, dan Escape untuk menutup
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      toggleSidebar();
    }
    if (e.key === "Escape" && document.querySelector(".app")?.classList.contains("sidebar-expanded")) {
      toggleSidebar(false);
    }
  });
}

renderCategories();
renderMenu();
renderCart();
updateFilterUI();
initSidebar("kasir");
