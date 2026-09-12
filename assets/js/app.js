/* ============================================================
   Amar Plastik — Data produk
   ============================================================ */
function getStoredCategories() {
  try {
    const raw = localStorage.getItem("ap_master_categories");
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) {
        return [
          { id: "all", name: "Semua", count: 0 },
          ...list.filter(c => c.activeInPos !== false).map(c => ({ id: c.id, name: c.name, count: 0 }))
        ];
      }
    }
  } catch { }
  return [
    { id: "all", name: "Semua", count: 8 },
    { id: "kue", name: "Bahan Kue", count: 4 },
    { id: "plastik", name: "Plastik", count: 2 },
    { id: "kemasan", name: "Kemasan", count: 2 },
  ];
}

if (typeof DEFAULT_PRODUCT_IMAGES === "undefined") {
  window.DEFAULT_PRODUCT_IMAGES = {
    1: "images/product/tepung-terigu-1kg.jpg",
    2: "images/product/gula-pasir-1kg.webp",
    3: "images/product/mentega-250gr.jpeg",
    4: "images/product/coklat-bubuk-500gr.jpg",
    5: "images/product/plastik-kresek-l.webp",
    6: "images/product/mika-bento-kotak.jpg",
    7: "images/product/cup-puding-isi-50.jpg",
    8: "images/product/plastik-vacum-1kg.png"
  };
}

function getStoredProducts() {
  try {
    const raw = localStorage.getItem("ap_master_products");
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) {
        return list.map(p => {
          const totStock = p.stocks ? Object.values(p.stocks).reduce((a, b) => a + Number(b || 0), 0) : Number(p.stock || 0);
          return {
            ...p,
            image: p.image || DEFAULT_PRODUCT_IMAGES[p.id] || "",
            stock: totStock
          };
        });
      }
    }
  } catch { }
  return [
    { id: 1, name: "Tepung Terigu", cat: "kue", icon: "wheat", tint: "#fef3c7", price: 12500, old: 15000, stock: 48, exp: "03/27", sku: "SKU-00001", batch: "BRG001-0926-A", image: "images/product/tepung-terigu-1kg.jpg" },
    { id: 2, name: "Gula Pasir", cat: "kue", icon: "wheat", tint: "#f3e8ff", price: 15500, old: null, stock: 36, exp: "09/27", sku: "SKU-00002", batch: "BRG002-0826-B", image: "images/product/gula-pasir-1kg.webp" },
    { id: 3, name: "Mentega", cat: "kue", icon: "wheat", tint: "#fef9c3", price: 18900, old: 22000, stock: 24, exp: "01/27", sku: "SKU-00003", batch: "BRG003-0726-C", image: "images/product/mentega-250gr.jpeg" },
    { id: 4, name: "Coklat Bubuk", cat: "kue", icon: "wheat", tint: "#fed7aa", price: 26500, old: null, stock: 18, exp: "05/27", sku: "SKU-00004", batch: "BRG004-0926-D", image: "images/product/coklat-bubuk-500gr.jpg" },
    { id: 5, name: "Plastik Kresek L", cat: "plastik", icon: "layers", tint: "#e0f2fe", price: 8500, old: null, stock: 3, exp: null, sku: "SKU-00005", batch: "BRG005-1026-A", image: "images/product/plastik-kresek-l.webp" },
    { id: 6, name: "Mica Bento Kotak", cat: "kemasan", icon: "package", tint: "#dcfce7", price: 12000, old: 14500, stock: 60, exp: null, sku: "SKU-00006", batch: "BRG006-0826-B", image: "images/product/mika-bento-kotak.jpg" },
    { id: 7, name: "Cup Puding", cat: "kemasan", icon: "package", tint: "#ffe4e6", price: 21500, old: null, stock: 15, exp: null, sku: "SKU-00007", batch: "BRG007-1026-C", image: "images/product/cup-puding-isi-50.jpg" },
    { id: 8, name: "Plastik Vacuum 1kg", cat: "plastik", icon: "layers", tint: "#ede9fe", price: 27500, old: null, stock: 0, exp: null, sku: "SKU-00008", batch: "BRG008-0926-D", image: "images/product/plastik-vacum-1kg.png" },
  ];
}

function getMasterProductsList() {
  if (typeof loadProducts === "function") {
    return loadProducts();
  }
  return getStoredProducts();
}

var CATEGORIES = getStoredCategories();
var MENU = getMasterProductsList();
var TAX_RATE = 0.10;
var CAT_NAME = Object.fromEntries(CATEGORIES.map(c => [c.id, c.name]));
var ITEM = Object.fromEntries(MENU.map(m => [m.id, m]));

function refreshProducts() {
  MENU = getMasterProductsList();
  ITEM = Object.fromEntries(MENU.map(m => [m.id, m]));
}

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
  cart: new Map(),          // cartKey (e.g. "2__u-1kg") -> qty
  category: "all",
  query: "",
  filterStatus: "all",      // all, ready, promo, low
  sortBy: "default",        // default, price-asc, price-desc, name-asc, stock-desc
  payment: "Cash",
  history: [],              // riwayat transaksi sesi ini
};

/* ============================================================
   Helpers & Multi-Unit Stock Tracking
   ============================================================ */
var rp = n => "Rp " + Math.round(n).toLocaleString("id-ID");
var $ = sel => document.querySelector(sel);

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("is-show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("is-show"), 2600);
}

/**
 * Hitung total kuantitas stok dasar (base unit) yang sedang dikomit dalam keranjang
 */
function getCommittedBaseStock(productId) {
  let committed = 0;
  for (const [key, qty] of state.cart) {
    const [pId, uId] = key.toString().split("__");
    if (Number(pId) === Number(productId)) {
      const p = ITEM[pId];
      if (p && p.units) {
        const u = p.units.find(x => x.id === uId) || p.units[0];
        committed += (Number(qty) || 0) * (Number(u?.qtyRatio) || 1);
      } else {
        committed += (Number(qty) || 0);
      }
    }
  }
  return committed;
}

/**
 * Hitung sisa stok dasar yang tersedia untuk dipesan di cabang Pusat
 */
function getAvailableBaseStock(product, storeId = "pusat") {
  if (!product) return 0;
  const storeStock = typeof getProductStock === "function"
    ? getProductStock(product, storeId)
    : (product.stocks ? Number(product.stocks[storeId] || 0) : Number(product.stock || 0));
  const committed = getCommittedBaseStock(product.id);
  return Math.max(0, storeStock - committed);
}

/* ============================================================
   Unit Picker Modal (Option B Popup Modal)
   ============================================================ */
function openUnitPicker(productId) {
  const p = ITEM[productId];
  if (!p) return;

  const availableBase = getAvailableBaseStock(p, "pusat");
  const modal = $("#unitPickerModalBackdrop");
  if (!modal) return;

  // Header info
  $("#unitPickerCat").textContent = CAT_NAME[p.cat] || p.cat;
  $("#unitPickerTitle").textContent = p.name;
  $("#unitPickerStock").textContent = "Tersedia: " + (typeof formatDualUnitStock === "function" ? formatDualUnitStock(p, "pusat") : `${availableBase} ${p.baseUnit || 'pcs'}`);

  const thumbBox = $("#unitPickerThumb");
  if (p.image) {
    thumbBox.innerHTML = `<img src="${p.image}" alt="${p.name}" />`;
  } else {
    thumbBox.innerHTML = `<span style="font-size:22px; display:grid; place-items:center;">${getCategorySvg(p.icon || 'package')}</span>`;
  }

  // Render opsi satuan
  const listEl = $("#unitPickerList");
  const units = Array.isArray(p.units) && p.units.length ? p.units : [
    { id: "u-default", name: `Satuan (${p.baseUnit || 'pcs'})`, qtyRatio: 1, price: p.price, finalPrice: p.price, isDefault: true }
  ];

  listEl.innerHTML = units.map(u => {
    const needed = Number(u.qtyRatio || 1);
    const canAdd = availableBase >= needed;
    const normalPrice = Number(u.price || 0);
    const finalPrice = u.finalPrice !== undefined ? Number(u.finalPrice) : (typeof calcFinalPrice === "function" ? calcFinalPrice(normalPrice, u.discountType, u.discountVal) : normalPrice);
    const hasDiscount = finalPrice < normalPrice;

    // Keterangan konversi rasio
    let ratioDesc = "";
    if ((p.baseUnit === "gr" || p.baseUnit === "gram") && needed >= 1000) {
      const kgVal = needed / 1000;
      ratioDesc = `1 ${u.name.split(' ')[0]} = ${kgVal} kg (${needed.toLocaleString('id-ID')} gr)`;
    } else if (p.baseUnit === "gr" || p.baseUnit === "gram") {
      ratioDesc = `Isi ${needed} gram`;
    } else if (p.baseUnit === "ml" && needed >= 1000) {
      ratioDesc = `1 ${u.name.split(' ')[0]} = ${needed / 1000} Liter`;
    } else {
      ratioDesc = `Isi ${needed} ${p.baseUnit || 'pcs'}`;
    }

    let discountBadge = "";
    if (u.discountType === "percent" && u.discountVal) {
      discountBadge = `Diskon ${u.discountVal}%`;
    } else if (u.discountType === "nominal" && u.discountVal) {
      discountBadge = `Hemat ${rp(u.discountVal)}`;
    } else if (hasDiscount) {
      discountBadge = `Diskon ${Math.round((1 - finalPrice / normalPrice) * 100)}%`;
    }

    return `
      <button type="button" class="unit-option-card ${canAdd ? '' : 'is-disabled'}" data-prod-id="${p.id}" data-unit-id="${u.id}" ${canAdd ? '' : 'disabled aria-disabled="true"'}>
        <div class="unit-option-left">
          <div class="unit-option-name-row">
            <strong class="unit-option-name">${u.name}</strong>
            ${u.isDefault ? '<span class="unit-default-pill">Utama</span>' : ''}
          </div>
          <span class="unit-option-ratio">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            ${ratioDesc}
          </span>
        </div>
        <div class="unit-option-pricing">
          ${hasDiscount ? `<s class="unit-option-old">${rp(normalPrice)}</s>` : ''}
          <div class="unit-option-final-row">
            ${hasDiscount ? `<span class="unit-option-discount-badge">${discountBadge}</span>` : ''}
            <strong class="unit-option-final">${rp(finalPrice)}</strong>
          </div>
          ${!canAdd ? '<span class="unit-option-out-tag">Stok Tidak Cukup</span>' : ''}
        </div>
      </button>
    `;
  }).join("");

  modal.hidden = false;
}

function closeUnitPicker() {
  const modal = $("#unitPickerModalBackdrop");
  if (modal) modal.hidden = true;
}

/* ============================================================
   Renderers
   ============================================================ */
function renderCategories() {
  const catCounts = { all: MENU.length };
  MENU.forEach(m => {
    catCounts[m.cat] = (catCounts[m.cat] || 0) + 1;
  });

  $("#categories").innerHTML = CATEGORIES.map(c => `
    <button class="cat-chip ${c.id === state.category ? "is-active" : ""}" data-cat="${c.id}">
      <strong>${c.name}</strong>
      <small>${catCounts[c.id] || 0} produk</small>
    </button>
  `).join("");
}

function filteredMenu() {
  const q = state.query.trim().toLowerCase();
  let list = MENU.filter(m => {
    // Kategori
    if (state.category !== "all" && m.cat !== state.category) return false;

    // Search query
    if (q && !m.name.toLowerCase().includes(q) && !CAT_NAME[m.cat]?.toLowerCase().includes(q)) return false;

    // Sisa stok riil
    const avail = getAvailableBaseStock(m, "pusat");

    // Filter status stok
    if (state.filterStatus === "ready" && avail <= 0) return false;
    if (state.filterStatus === "promo") {
      const hasPromo = m.old || (m.units && m.units.some(u => (u.finalPrice || u.price) < u.price));
      if (!hasPromo) return false;
    }
    if (state.filterStatus === "low" && (avail <= 0 || avail > (m.minStock || 5))) return false;

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
    list.sort((a, b) => getAvailableBaseStock(b, "pusat") - getAvailableBaseStock(a, "pusat"));
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
    const isMulti = Array.isArray(m.units) && m.units.length > 1;
    const defaultUnit = (m.units && (m.units.find(u => u.isDefault) || m.units[0])) || null;
    const displayPrice = defaultUnit ? (defaultUnit.finalPrice || defaultUnit.price) : m.price;
    const displayOld = defaultUnit && defaultUnit.price > displayPrice ? defaultUnit.price : m.old;
    const discount = displayOld ? Math.round((1 - displayPrice / displayOld) * 100) : 0;

    const availableBase = getAvailableBaseStock(m, "pusat");
    const out = availableBase <= 0;

    // Tag produk
    const badges = [];
    if (isMulti) {
      badges.push(`<span class="badge is-multi" title="${m.units.length} Pilihan Satuan">${m.units.length} Satuan</span>`);
    }
    if (discount) badges.push(`<span class="badge is-blue" title="Diskon ${discount}%">Diskon ${discount}%</span>`);
    if (out) badges.push(`<span class="badge is-red" title="Stok habis">Stok Habis</span>`);
    else if (availableBase <= (m.minStock || 5)) badges.push(`<span class="badge is-yellow" title="Stok menipis">Stok Menipis</span>`);
    else badges.push(`<span class="badge is-green" title="Siap jual">Ready</span>`);
    if (m.exp) badges.push(`<span class="badge is-gray" title="Kedaluwarsa">EXP ${m.exp}</span>`);

    const mediaContent = m.image
      ? `<img src="${m.image}" alt="${m.name}" class="card-media-img" />`
      : `<span class="media-emoji" aria-hidden="true">${m.emoji || ""}</span>`;

    const stockText = typeof formatDualUnitStock === "function"
      ? formatDualUnitStock(m, "pusat")
      : `${availableBase} ${m.unit || 'pcs'}`;

    return `
    <button class="card ${out ? "is-disabled" : ""} ${isMulti ? "is-multi-unit" : ""}" data-add="${m.id}" ${out ? "disabled aria-disabled=\"true\"" : ""} title="${out ? `${m.name} — stok habis` : (isMulti ? `Pilih varian kemasan ${m.name}` : `Tambah ${m.name} ke pesanan`)}">
      <div class="card-media ${m.image ? "has-img" : ""}" style="background:${out ? "linear-gradient(135deg, #eceef2, #d9dde4)" : (m.image ? "#f8fafc" : m.tint)}">
        <span class="card-badges">${badges.join("")}</span>
        ${mediaContent}
      </div>
      <span class="card-name">${m.name}</span>
      <span class="card-price">
        ${displayOld ? `<s>${rp(displayOld)}</s><strong>${rp(displayPrice)}</strong>` : `<strong class="only">${rp(displayPrice)}</strong>`}
      </span>
      <span class="card-meta">
        <span>${CAT_NAME[m.cat] || m.cat}</span>
        <span class="stock ${availableBase <= (m.minStock || 5) ? "low" : ""}">${stockText}</span>
      </span>
      ${isMulti ? `
        <div class="card-unit-indicator">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>Pilih Satuan (${m.units.length})</span>
        </div>
      ` : ''}
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
    list.innerHTML = [...state.cart.entries()].map(([cartKey, qty]) => {
      const [pId, uId] = cartKey.toString().split("__");
      const m = ITEM[pId] || { name: "Produk", cat: "kue", price: 0 };
      const u = (m.units && m.units.find(x => x.id === uId)) || {
        id: uId, name: m.unit || "pcs", qtyRatio: 1, price: m.price, finalPrice: m.price
      };
      const unitPrice = u.finalPrice !== undefined ? u.finalPrice : m.price;
      const normalPrice = u.price !== undefined ? u.price : m.price;
      const hasDiscount = normalPrice > unitPrice;
      const availableBase = getAvailableBaseStock(m, "pusat");
      const atCap = availableBase < (u.qtyRatio || 1);

      const thumbContent = m.image
        ? `<img src="${m.image}" alt="${m.name}" class="oi-thumb-img" />`
        : `<span class="media-emoji" aria-hidden="true">${m.emoji || "🛍️"}</span>`;

      return `
      <div class="order-item">
        <span class="oi-thumb ${m.image ? "has-img" : ""}" style="${m.image ? "" : `background:${m.tint || '#eff6ff'}`}">${thumbContent}</span>
        <span class="oi-info">
          <strong>${m.name}</strong>
          <small class="oi-variant-tag">${u.name} · ${CAT_NAME[m.cat] || m.cat}</small>
        </span>
        <span class="oi-qty">
          <button class="del" data-dec="${cartKey}" aria-label="Kurangi ${m.name}">−</button>
          <span>${qty}</span>
          <button data-inc="${cartKey}" aria-label="Tambah ${m.name}" ${atCap ? "disabled title=\"Stok tidak cukup\"" : ""}>+</button>
          <button class="oi-del" data-del-item="${cartKey}" aria-label="Hapus ${m.name} dari pesanan" title="Hapus ${m.name}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/></svg>
          </button>
        </span>
        <span class="oi-price">
          ${rp(unitPrice * qty)}
          <small>${qty} × ${rp(unitPrice)}</small>
          ${hasDiscount ? `<small class="oi-save">Hemat ${rp((normalPrice - unitPrice) * qty)}</small>` : ""}
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
  if (fabCount) {
    fabCount.textContent = qtyCount;
    fabCount.style.display = qtyCount ? "grid" : "none";
  }

  // Subtotal = harga normal (old); Diskon = selisih harga normal vs harga jual
  let sellingTotal = 0, listTotal = 0;

  for (const [cartKey, qty] of state.cart) {
    const [pId, uId] = cartKey.toString().split("__");
    const m = ITEM[pId];
    if (!m) continue;
    const u = (m.units && m.units.find(x => x.id === uId)) || {
      price: m.price, finalPrice: m.price
    };
    const unitPrice = u.finalPrice !== undefined ? u.finalPrice : m.price;
    const normalPrice = u.price !== undefined ? u.price : (m.old ?? m.price);
    sellingTotal += unitPrice * qty;
    listTotal += normalPrice * qty;
  }

  const discount = Math.max(0, listTotal - sellingTotal);
  const tax = Math.round(sellingTotal * TAX_RATE);
  const total = sellingTotal + tax;

  $("#subtotalVal").textContent = rp(listTotal);
  $("#discountVal").textContent = discount ? "− " + rp(discount) : "Rp 0";
  $("#taxVal").textContent = rp(tax);
  $("#totalVal").textContent = rp(total);
  $("#proceedBtn").disabled = !state.cart.size;
  $("#clearAll").disabled = !state.cart.size;
}

/* ============================================================
   Actions
   ============================================================ */
function addToCart(productId, unitId) {
  const p = ITEM[productId];
  if (!p) return;

  // Jika unitId tidak diberikan, gunakan unit default
  if (!unitId && Array.isArray(p.units) && p.units.length > 0) {
    const def = p.units.find(u => u.isDefault) || p.units[0];
    unitId = def.id;
  }

  const u = (p.units && p.units.find(x => x.id === unitId)) || {
    id: unitId || "u-default",
    name: p.unit || "pcs",
    qtyRatio: 1,
    price: p.price,
    finalPrice: p.price
  };

  const cartKey = `${p.id}__${u.id}`;
  const neededRatio = Number(u.qtyRatio || 1);
  const availableBase = getAvailableBaseStock(p, "pusat");

  if (availableBase < neededRatio) {
    toast(`Stok ${p.name} tidak cukup untuk varian ${u.name}`);
    return;
  }

  const curQty = state.cart.get(cartKey) || 0;
  state.cart.set(cartKey, curQty + 1);
  renderCart();
  renderMenu();
  toast(`${p.name} (${u.name}) ditambahkan ke pesanan`);
}

function changeQty(cartKey, delta) {
  const curQty = state.cart.get(cartKey) || 0;
  const nextQty = curQty + delta;
  const [pId, uId] = cartKey.toString().split("__");
  const p = ITEM[pId];
  if (!p) return;
  const u = (p.units && p.units.find(x => x.id === uId)) || {
    id: "default", name: p.unit || "pcs", qtyRatio: 1, price: p.price, finalPrice: p.price
  };

  if (nextQty <= 0) {
    state.cart.delete(cartKey);
  } else if (delta > 0) {
    const needed = Number(u.qtyRatio || 1);
    const availableBase = getAvailableBaseStock(p, "pusat");
    if (availableBase < needed) {
      toast(`Sisa stok ${p.name} tidak cukup untuk menambah varian ${u.name}`);
      return;
    }
    state.cart.set(cartKey, nextQty);
  } else {
    state.cart.set(cartKey, nextQty);
  }
  renderCart();
  renderMenu();
}

function removeFromCart(cartKey) {
  const [pId, uId] = cartKey.toString().split("__");
  const p = ITEM[pId];
  if (!state.cart.has(cartKey)) return;
  state.cart.delete(cartKey);
  renderCart();
  renderMenu();
  toast(`${p ? p.name : 'Item'} dihapus dari pesanan`);
}

function clearCart() {
  if (!state.cart.size) return;
  state.cart.clear();
  renderCart();
  renderMenu();
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

function toggleOrderPanel(open, fromPopstate = false) {
  const panel = $(".order");
  if (!panel) return;
  const currentlyOpen = panel.classList.contains("is-open");
  const isOpen = open !== undefined ? open : !currentlyOpen;

  if (currentlyOpen === isOpen) return;

  panel.classList.toggle("is-open", isOpen);
  const fab = $("#cartFab");
  if (fab) fab.classList.toggle("is-hidden", isOpen);
  const backdrop = $("#orderBackdrop");
  if (backdrop) backdrop.hidden = !isOpen;

  // Integrasi Mobile Back Navigation
  if (window.innerWidth <= 768) {
    if (isOpen) {
      if (!history.state || !history.state.orderPanelOpen) {
        history.pushState({ orderPanelOpen: true }, "");
      }
    } else {
      if (!fromPopstate && history.state && history.state.orderPanelOpen) {
        history.back();
      }
    }
  }
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

  // Ambil data master produk terkini
  const masterList = typeof loadProducts === "function" ? loadProducts() : MENU;

  const items = [...state.cart.entries()].map(([cartKey, qty]) => {
    const [pId, uId] = cartKey.toString().split("__");
    const m = ITEM[pId];
    const u = (m.units && m.units.find(x => x.id === uId)) || {
      name: m.unit || "pcs", price: m.price, finalPrice: m.price, qtyRatio: 1
    };
    const finalPrice = u.finalPrice !== undefined ? u.finalPrice : m.price;
    const baseUsed = (Number(u.qtyRatio) || 1) * qty;

    // Kurangi stok cabang Pusat secara persisten dalam baseUnit
    const targetProd = masterList.find(x => x.id === m.id);
    if (targetProd) {
      if (!targetProd.stocks) targetProd.stocks = { pusat: 0, cabang2: 0, cabang3: 0 };
      const curPusat = Number(targetProd.stocks.pusat || 0);
      const afterPusat = Math.max(0, curPusat - baseUsed);
      targetProd.stocks.pusat = afterPusat;

      // Catat mutasi stok jika helper tersedia
      if (typeof recordStockMutation === "function") {
        recordStockMutation({
          productId: targetProd.id,
          storeId: "pusat",
          storeName: "Amar Plastik - Pusat",
          type: "out",
          delta: -baseUsed,
          beforeQty: curPusat,
          afterQty: afterPusat,
          note: `Penjualan POS #${trxCode} (${qty} x ${u.name})`
        });
      }
    }

    return {
      name: `${m.name} (${u.name})`,
      qty,
      price: finalPrice,
      ratio: u.qtyRatio || 1,
      baseQty: baseUsed
    };
  });

  if (typeof saveProducts === "function") {
    saveProducts(masterList);
  }

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

  refreshProducts();
  showReceipt(total, trxCode, timeStr);
  state.cart.clear();
  renderCart();
  renderMenu();
  toggleOrderPanel(false);
}

/* ============================================================
   Modal konfirmasi kustom (popup, menggantikan confirm())
   ============================================================ */
var confirmCb = null;
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
  const totalNum = [...state.cart.entries()].reduce((s, [cartKey, q]) => {
    const [pId, uId] = cartKey.toString().split("__");
    const m = ITEM[pId];
    if (!m) return s;
    const u = (m.units && m.units.find(x => x.id === uId)) || { finalPrice: m.price, price: m.price };
    const p = u.finalPrice !== undefined ? u.finalPrice : m.price;
    return s + p * q;
  }, 0) * (1 + TAX_RATE);
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
var STORE = {
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
  $("#rCashier").textContent = typeof STORE !== "undefined" && STORE.cashier ? STORE.cashier : "Lina Puspa Melinda";
  $("#rPay").textContent = state.payment;

  // Rincian item — item berdiskon menampilkan harga normal (dicoret) + potongan per item
  $("#rItems").innerHTML = [...state.cart.entries()].map(([cartKey, qty]) => {
    const [pId, uId] = cartKey.toString().split("__");
    const m = ITEM[pId] || { name: "Produk" };
    const u = (m.units && m.units.find(x => x.id === uId)) || { name: m.unit || "pcs", price: m.price, finalPrice: m.price };
    const finalPrice = u.finalPrice !== undefined ? u.finalPrice : m.price;
    const normalPrice = u.price !== undefined ? u.price : (m.old || m.price);
    const hasDisc = normalPrice > finalPrice;
    const discPerItem = hasDisc ? normalPrice - finalPrice : 0;
    return `
    <div class="ri-row">
      <div class="ri-name">${m.name} <small style="color:#475569;font-weight:600;">(${u.name})</small></div>
      <div class="ri-line">
        <span>${qty} x ${rp(finalPrice)}</span>
        <span>${rp(finalPrice * qty)}</span>
      </div>
      ${hasDisc ? `
      <div class="ri-line ri-disc">
        <span>Harga normal ${rp(normalPrice)}</span>
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
  if (!card) return;
  const prodId = +card.dataset.add;
  const p = ITEM[prodId];
  if (!p) return;
  if (Array.isArray(p.units) && p.units.length > 1) {
    openUnitPicker(prodId);
  } else {
    addToCart(prodId);
  }
});

$("#orderList").addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const del = e.target.closest("[data-del-item]");
  if (inc) changeQty(inc.dataset.inc, +1);
  if (dec) changeQty(dec.dataset.dec, -1);
  if (del) removeFromCart(del.dataset.delItem);
});

// Unit Picker Modal Listeners
$("#unitPickerClose")?.addEventListener("click", closeUnitPicker);
$("#unitPickerModalBackdrop")?.addEventListener("click", e => {
  if (e.target === e.currentTarget) closeUnitPicker();
});
$("#unitPickerList")?.addEventListener("click", e => {
  const card = e.target.closest(".unit-option-card:not(:disabled)");
  if (!card) return;
  const prodId = +card.dataset.prodId;
  const unitId = card.dataset.unitId;
  addToCart(prodId, unitId);
  closeUnitPicker();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const picker = $("#unitPickerModalBackdrop");
    if (picker && !picker.hidden) closeUnitPicker();
  }
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

// Listener navigasi Back di mobile & browser (Android hardware back button, swipe back gesture)
window.addEventListener("popstate", () => {
  const panel = $(".order");
  if (panel && panel.classList.contains("is-open")) {
    toggleOrderPanel(false, true);
  }
});

// Listener tombol Escape keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const panel = $(".order");
    if (panel && panel.classList.contains("is-open")) {
      toggleOrderPanel(false);
    }
  }
});

/* ============================================================
   Init — contoh isi keranjang seperti desain
   ============================================================ */
state.cart.set(1, 1);   // Tepung Terigu
state.cart.set(6, 2);   // Mica Bento Kotak
state.cart.set(3, 1);   // Mentega

// Bersihkan state riwayat jika ada sisa refresh saat panel terbuka
if (history.state && history.state.orderPanelOpen) {
  history.replaceState(null, "");
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    const panel = $(".order");
    if (panel && panel.classList.contains("is-open")) {
      toggleOrderPanel(false);
    }
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
  try { localStorage.setItem("ap_sidebar", isExpanded ? "expanded" : "collapsed"); } catch { }

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
  try { saved = localStorage.getItem("ap_sidebar"); } catch { }
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
