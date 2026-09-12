/* ============================================================
   Amar Plastik — shared.js
   Data, state, dan utilitas yang dipakai semua halaman.
   Riwayat transaksi disimpan di localStorage agar persisten
   antar file HTML.
   ============================================================ */

/* ---- Master Cabang Toko (Multi-Outlet) ---- */
const DEFAULT_STORES = [
  { id: "pusat", code: "OUT-01", name: "Amar Plastik - Pusat", shortName: "Pusat", badgeClass: "pusat", address: "Jl. Raya Industri No. 88, Medan", isCentral: true },
  { id: "cabang2", code: "OUT-02", name: "Amar Plastik - Cabang 2", shortName: "Cabang 2", badgeClass: "cabang2", address: "Pasar Anyar Lt. 1 No. 12, Medan", isCentral: false },
  { id: "cabang3", code: "OUT-03", name: "Amar Plastik - Cabang 3", shortName: "Cabang 3", badgeClass: "cabang3", address: "Jl. Ciledug Raya No. 45, Binjai", isCentral: false }
];

function loadStores() {
  try {
    const raw = localStorage.getItem("ap_master_stores");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  saveStores(DEFAULT_STORES);
  return DEFAULT_STORES;
}

function saveStores(list) {
  try { localStorage.setItem("ap_master_stores", JSON.stringify(list)); } catch {}
}

/* ---- Master Kategori Modern 2026 (100% SVG Vector Icons) ---- */
const DEFAULT_CATEGORIES = [
  { id: "kue", code: "CAT-KUE", name: "Bahan Kue", icon: "wheat", colorTheme: "amber", desc: "Tepung, ragi, coklat bubuk, mentega & aneka bahan kue", activeInPos: true, orderIndex: 1 },
  { id: "plastik", code: "CAT-PLS", name: "Plastik", icon: "layers", colorTheme: "blue", desc: "Plastik kresek, vacuum, PE, PP & standing pouch", activeInPos: true, orderIndex: 2 },
  { id: "kemasan", code: "CAT-KMS", name: "Kemasan", icon: "package", colorTheme: "emerald", desc: "Mika bento, box kue, cup puding & aneka packaging", activeInPos: true, orderIndex: 3 }
];

function loadCategories() {
  try {
    const raw = localStorage.getItem("ap_master_categories");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        // Jika terdeteksi data dummy lama (Kebutuhan Rumah / cat-1), reset ke kategori riil Amar Plastik
        if (parsed.some(c => c.name === "Kebutuhan Rumah" || c.id === "cat-1")) {
          saveCategories(DEFAULT_CATEGORIES);
          return DEFAULT_CATEGORIES;
        }
        return parsed;
      }
    }
  } catch {}
  saveCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}

function saveCategories(list) {
  try { localStorage.setItem("ap_master_categories", JSON.stringify(list)); } catch {}
}

/* ---- Helper Rendering Ikon SVG (Bebas Karakter Emoji) ---- */
const SVG_ICONS = {
  wheat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 10-10"/><path d="M16 8a4 4 0 0 0-4-4 4 4 0 0 0-4 4c0 2.2 1.8 4 4 4a4 4 0 0 0 4-4Z"/><path d="M19 13a3 3 0 0 0-3-3 3 3 0 0 0-3 3c0 1.65 1.35 3 3 3a3 3 0 0 0 3-3Z"/><path d="M14 18a2 2 0 0 0-2-2 2 2 0 0 0-2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2Z"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  package: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
  shoppingBag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
  store: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7a2 2 0 0 1-2 2c-.55 0-1.05-.22-1.41-.59L17 7"/><path d="M17 7a2 2 0 0 1-3 0L12.59 5.59"/><path d="M12 7a2 2 0 0 1-3 0L7.59 5.59"/><path d="M7 7a2 2 0 0 1-2 2c-.55 0-1.05-.22-1.41-.59L2 7"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  xCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
};

function getCategorySvg(iconName, customClass = "") {
  const svgStr = SVG_ICONS[iconName] || SVG_ICONS.package;
  if (!customClass) return svgStr;
  return svgStr.replace('<svg ', `<svg class="${customClass}" `);
}

/* ---- Multi-Unit Helper: Pembulatan 500 Rupiah ke Bawah & Diskon ---- */
function roundDown500(num) {
  if (isNaN(num) || num <= 0) return 0;
  return Math.floor(num / 500) * 500;
}

function calcFinalPrice(price, discountType, discountVal) {
  const p = Number(price) || 0;
  if (!discountType || discountType === "none" || !discountVal) return p;
  const val = Number(discountVal) || 0;
  let discounted = p;
  if (discountType === "percent") {
    discounted = p - (p * (val / 100));
  } else if (discountType === "nominal") {
    discounted = p - val;
  }
  return roundDown500(Math.max(0, discounted));
}

/**
 * Format HPP dalam Satuan Standar Pasaran (per 1 kg, 1 liter, 1 pcs, 1 lembar)
 * Dibulatkan utuh tanpa angka koma / desimal.
 */
function formatDisplayHpp(product, customCost = null) {
  if (!product) return { value: 0, unit: "pcs", text: "Rp 0" };
  const baseCost = customCost !== null ? Number(customCost) : Number(product.cost || 0);
  const baseUnit = (product.baseUnit || product.unit || "pcs").toLowerCase();

  let standardMultiplier = 1;
  let standardUnitLabel = baseUnit;

  if (baseUnit === "gr" || baseUnit === "gram") {
    standardMultiplier = 1000;
    standardUnitLabel = "kg";
  } else if (baseUnit === "ml" || baseUnit === "mililiter") {
    standardMultiplier = 1000;
    standardUnitLabel = "liter";
  } else if (baseUnit === "lembar" || baseUnit === "lbr") {
    standardMultiplier = 1;
    standardUnitLabel = "lembar";
  } else if (baseUnit === "pcs" || baseUnit === "pack" || baseUnit === "butir") {
    standardMultiplier = 1;
    standardUnitLabel = baseUnit;
  }

  const standardHpp = Math.round(baseCost * standardMultiplier);
  return {
    value: standardHpp,
    unit: standardUnitLabel,
    text: `${rp(standardHpp)} / ${standardUnitLabel}`
  };
}

/**
 * Format stok cerdas multi-satuan (Dual-Unit Display):
 * Misal Gula: "75 kg (1 Karung + 25 kg)"
 * Misal Plastik: "115 pcs (2 pack + 15 pcs)"
 */
function formatDualUnitStock(product, storeId = "all") {
  if (!product) return "0";
  const qty = getProductStock(product, storeId);
  const baseUnit = (product.baseUnit || product.unit || "pcs").toLowerCase();

  if (baseUnit === "gr" || baseUnit === "gram") {
    const valKg = qty / 1000;
    const formatted = Number.isInteger(valKg)
      ? valKg.toLocaleString("id-ID")
      : parseFloat(valKg.toFixed(3)).toLocaleString("id-ID");
    return `${formatted} kg`;
  }
  if (baseUnit === "ml" || baseUnit === "mililiter") {
    const valL = qty / 1000;
    const formatted = Number.isInteger(valL)
      ? valL.toLocaleString("id-ID")
      : parseFloat(valL.toFixed(3)).toLocaleString("id-ID");
    return `${formatted} liter`;
  }
  if (baseUnit === "kg" || baseUnit === "kilogram") {
    const formatted = Number.isInteger(qty)
      ? qty.toLocaleString("id-ID")
      : parseFloat(Number(qty).toFixed(3)).toLocaleString("id-ID");
    return `${formatted} kg`;
  }
  if (baseUnit === "liter" || baseUnit === "ltr") {
    const formatted = Number.isInteger(qty)
      ? qty.toLocaleString("id-ID")
      : parseFloat(Number(qty).toFixed(3)).toLocaleString("id-ID");
    return `${formatted} liter`;
  }
  if (baseUnit === "lembar" || baseUnit === "lbr") {
    return `${Math.round(qty).toLocaleString("id-ID")} lembar`;
  }
  if (baseUnit === "pcs" || baseUnit === "buah" || baseUnit === "butir") {
    return `${Math.round(qty).toLocaleString("id-ID")} pcs`;
  }
  return `${qty.toLocaleString("id-ID")} ${baseUnit}`;
}

/* ---- Master Produk Multi-Cabang & Multi-Satuan ---- */
const DEFAULT_PRODUCT_IMAGES = {
  1: "images/product/tepung-terigu-1kg.jpg",
  2: "images/product/gula-pasir-1kg.webp",
  3: "images/product/mentega-250gr.jpeg",
  4: "images/product/coklat-bubuk-500gr.jpg",
  5: "images/product/plastik-kresek-l.webp",
  6: "images/product/mika-bento-kotak.jpg",
  7: "images/product/cup-puding-isi-50.jpg",
  8: "images/product/plastik-vacum-1kg.png"
};

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    sku: "SKU-00001",
    name: "Tepung Terigu",
    cat: "kue",
    icon: "wheat",
    tint: "#fef3c7",
    price: 12500,
    cost: 9.5, // Rp 9.500 / kg
    baseUnit: "gr",
    unit: "kg",
    stocks: { pusat: 30000, cabang2: 15000, cabang3: 10000 },
    minStock: 5000,
    exp: "03/27",
    batch: "BRG001-0926-A",
    image: "images/product/tepung-terigu-1kg.jpg",
    units: [
      { id: "u-1kg", name: "Bungkus 1 kg", qtyRatio: 1000, price: 12500, discountType: "none", discountVal: 0, finalPrice: 12500, isDefault: true },
      { id: "u-500g", name: "Eceran 500 gr", qtyRatio: 500, price: 6500, discountType: "none", discountVal: 0, finalPrice: 6500, isDefault: false },
      { id: "u-sak25", name: "Sak 25 kg", qtyRatio: 25000, price: 285000, discountType: "percent", discountVal: 5, finalPrice: 270500, isDefault: false }
    ]
  },
  {
    id: 2,
    sku: "SKU-00002",
    name: "Gula Pasir",
    cat: "kue",
    icon: "wheat",
    tint: "#f3e8ff",
    price: 15500,
    cost: 12, // Rp 12.000 / kg
    baseUnit: "gr",
    unit: "kg",
    stocks: { pusat: 75000, cabang2: 45000, cabang3: 20000 },
    minStock: 10000,
    exp: "09/27",
    batch: "BRG002-0826-B",
    image: "images/product/gula-pasir-1kg.webp",
    units: [
      { id: "u-500g", name: "Eceran 500 gr", qtyRatio: 500, price: 8500, discountType: "none", discountVal: 0, finalPrice: 8500, isDefault: false },
      { id: "u-1kg", name: "Bungkus 1 kg", qtyRatio: 1000, price: 16500, discountType: "percent", discountVal: 5, finalPrice: 15500, isDefault: true },
      { id: "u-2kg", name: "Bungkus 2 kg", qtyRatio: 2000, price: 32000, discountType: "nominal", discountVal: 1000, finalPrice: 31000, isDefault: false },
      { id: "u-karung50", name: "Karung 50 kg", qtyRatio: 50000, price: 750000, discountType: "percent", discountVal: 4, finalPrice: 720000, isDefault: false }
    ]
  },
  {
    id: 3,
    sku: "SKU-00003",
    name: "Mentega 250gr",
    cat: "kue",
    icon: "wheat",
    tint: "#fef9c3",
    price: 18900,
    cost: 13900,
    old: 22000,
    baseUnit: "pcs",
    unit: "pcs",
    stocks: { pusat: 12, cabang2: 7, cabang3: 5 },
    minStock: 8,
    exp: "01/27",
    batch: "BRG003-0726-C",
    image: "images/product/mentega-250gr.jpeg",
    units: [
      { id: "u-cup", name: "Cup 250gr", qtyRatio: 1, price: 18900, discountType: "none", discountVal: 0, finalPrice: 18900, isDefault: true }
    ]
  },
  {
    id: 4,
    sku: "SKU-00004",
    name: "Coklat Bubuk",
    cat: "kue",
    icon: "wheat",
    tint: "#fed7aa",
    price: 26500,
    cost: 38, // Rp 38.000 / kg
    baseUnit: "gr",
    unit: "kg",
    stocks: { pusat: 12000, cabang2: 6000, cabang3: 4000 },
    minStock: 2500,
    exp: "05/27",
    batch: "BRG004-0926-D",
    image: "images/product/coklat-bubuk-500gr.jpg",
    units: [
      { id: "u-250g", name: "Eceran 250 gr", qtyRatio: 250, price: 14000, discountType: "none", discountVal: 0, finalPrice: 14000, isDefault: false },
      { id: "u-500g", name: "Bungkus 500 gr", qtyRatio: 500, price: 26500, discountType: "none", discountVal: 0, finalPrice: 26500, isDefault: true },
      { id: "u-1kg", name: "Kemasan 1 kg", qtyRatio: 1000, price: 51000, discountType: "nominal", discountVal: 1500, finalPrice: 49500, isDefault: false }
    ]
  },
  {
    id: 5,
    sku: "SKU-00005",
    name: "Plastik Kresek L",
    cat: "plastik",
    icon: "layers",
    tint: "#e0f2fe",
    price: 8500,
    cost: 110, // Rp 110 / pcs
    baseUnit: "pcs",
    unit: "pcs",
    stocks: { pusat: 250, cabang2: 150, cabang3: 50 },
    minStock: 50,
    exp: null,
    batch: "BRG005-1026-A",
    image: "images/product/plastik-kresek-l.webp",
    units: [
      { id: "u-pcs", name: "Eceran (1 Pcs)", qtyRatio: 1, price: 250, discountType: "none", discountVal: 0, finalPrice: 250, isDefault: false },
      { id: "u-pack", name: "1 Pack (isi 50 pcs)", qtyRatio: 50, price: 9000, discountType: "nominal", discountVal: 500, finalPrice: 8500, isDefault: true },
      { id: "u-dus", name: "1 Dus (20 pack / 1.000 pcs)", qtyRatio: 1000, price: 165000, discountType: "percent", discountVal: 5, finalPrice: 156500, isDefault: false }
    ]
  },
  {
    id: 6,
    sku: "SKU-00006",
    name: "Mica Bento Kotak",
    cat: "kemasan",
    icon: "package",
    tint: "#dcfce7",
    price: 12000,
    cost: 400, // Rp 400 / pcs
    baseUnit: "pcs",
    unit: "pcs",
    stocks: { pusat: 300, cabang2: 180, cabang3: 120 },
    minStock: 50,
    exp: null,
    batch: "BRG006-0826-B",
    image: "images/product/mika-bento-kotak.jpg",
    units: [
      { id: "u-pcs", name: "Eceran (1 Pcs)", qtyRatio: 1, price: 600, discountType: "none", discountVal: 0, finalPrice: 600, isDefault: false },
      { id: "u-pack", name: "1 Pack (isi 25 pcs)", qtyRatio: 25, price: 13000, discountType: "nominal", discountVal: 1000, finalPrice: 12000, isDefault: true }
    ]
  },
  {
    id: 7,
    sku: "SKU-00007",
    name: "Cup Puding Isi 50",
    cat: "kemasan",
    icon: "package",
    tint: "#ffe4e6",
    price: 21500,
    cost: 300, // Rp 300 / pcs
    baseUnit: "pcs",
    unit: "pcs",
    stocks: { pusat: 350, cabang2: 250, cabang3: 150 },
    minStock: 50,
    exp: null,
    batch: "BRG007-1026-C",
    image: "images/product/cup-puding-isi-50.jpg",
    units: [
      { id: "u-pcs", name: "Eceran (1 Pcs)", qtyRatio: 1, price: 600, discountType: "none", discountVal: 0, finalPrice: 600, isDefault: false },
      { id: "u-pack", name: "1 Pack (isi 50 pcs)", qtyRatio: 50, price: 23000, discountType: "nominal", discountVal: 1500, finalPrice: 21500, isDefault: true }
    ]
  },
  {
    id: 8,
    sku: "SKU-00008",
    name: "Plastik Vacuum",
    cat: "plastik",
    icon: "layers",
    tint: "#ede9fe",
    price: 27500,
    cost: 200, // Rp 200 / pcs
    baseUnit: "pcs",
    unit: "pcs",
    stocks: { pusat: 0, cabang2: 0, cabang3: 0 },
    minStock: 50,
    exp: null,
    batch: "BRG008-0926-D",
    image: "images/product/plastik-vacum-1kg.png",
    units: [
      { id: "u-pcs", name: "Eceran (1 Pcs)", qtyRatio: 1, price: 400, discountType: "none", discountVal: 0, finalPrice: 400, isDefault: false },
      { id: "u-pack", name: "1 Pack (isi 100 pcs)", qtyRatio: 100, price: 27500, discountType: "none", discountVal: 0, finalPrice: 27500, isDefault: true }
    ]
  }
];

function loadProducts() {
  try {
    const raw = localStorage.getItem("ap_master_products");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        let needSave = false;
        parsed.forEach(p => {
          if (!p.image && DEFAULT_PRODUCT_IMAGES[p.id]) {
            p.image = DEFAULT_PRODUCT_IMAGES[p.id];
            needSave = true;
          }
          if (!p.stocks) {
            const curStock = Number(p.stock || 0);
            const p1 = Math.round(curStock * 0.5);
            const p2 = Math.round(curStock * 0.3);
            const p3 = Math.max(0, curStock - p1 - p2);
            p.stocks = { pusat: p1, cabang2: p2, cabang3: p3 };
            needSave = true;
          }
          // Migrasi unit varian jika belum ada
          if (p.unit === "gr" && p.baseUnit === "gr") {
            p.unit = "kg";
            needSave = true;
          }
          if (!Array.isArray(p.units) || p.units.length === 0) {
            const defaultMatch = DEFAULT_PRODUCTS.find(x => x.id === p.id);
            if (defaultMatch && defaultMatch.units) {
              p.units = JSON.parse(JSON.stringify(defaultMatch.units));
              p.baseUnit = defaultMatch.baseUnit || "pcs";
              p.cost = defaultMatch.cost;
              p.stocks = defaultMatch.stocks;
            } else {
              p.baseUnit = p.unit || "pcs";
              p.units = [{
                id: "u-default",
                name: `Satuan (${p.baseUnit})`,
                qtyRatio: 1,
                price: Number(p.price || 0),
                discountType: "none",
                discountVal: 0,
                finalPrice: Number(p.price || 0),
                isDefault: true
              }];
            }
            needSave = true;
          }
        });
        if (needSave) saveProducts(parsed);
        return parsed;
      }
    }
  } catch {}
  saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

function saveProducts(list) {
  try { localStorage.setItem("ap_master_products", JSON.stringify(list)); } catch {}
}

/* Helper pembacaan stok per cabang maupun total konsolidasi */
function getProductStock(product, storeId = "all") {
  if (!product) return 0;
  if (!product.stocks) return Number(product.stock || 0);
  if (!storeId || storeId === "all") {
    return Object.values(product.stocks).reduce((acc, v) => acc + Number(v || 0), 0);
  }
  return Number(product.stocks[storeId] || 0);
}

/* Status stok dinamis */
function stockStatus(p, storeId = "all") {
  const qty = getProductStock(p, storeId);
  const min = Number(p.minStock || 5);
  if (qty <= 0) return "out";
  if (qty <= min) return "low";
  return "ok";
}

/* ---- Mutasi Stok Persisten (Stock Adjustments Log) ---- */
function loadStockMutations() {
  try { return JSON.parse(localStorage.getItem("ap_stock_mutations") || "[]"); }
  catch { return []; }
}

function recordStockMutation({ productId, storeId, storeName, type, delta, beforeQty, afterQty, note = "", cashier = "Lina Puspa Melinda" }) {
  const mutations = loadStockMutations();
  const entry = {
    id: "MUT-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    formattedTime: nowText(),
    productId,
    storeId,
    storeName,
    type, // 'restock' | 'damage' | 'opname'
    delta,
    beforeQty,
    afterQty,
    note,
    cashier
  };
  mutations.unshift(entry);
  try { localStorage.setItem("ap_stock_mutations", JSON.stringify(mutations.slice(0, 500))); } catch {}
  return entry;
}

/* Variabel kompatibilitas backward */
var CATEGORIES = [
  { id: "all", name: "Semua", count: 8 },
  ...loadCategories().map(c => ({ id: c.id, name: c.name, code: c.code, count: 0 }))
];

var MENU = loadProducts().map(p => ({
  ...p,
  stock: getProductStock(p, "all")
}));

var TAX_RATE = 0.10;
var CAT_NAME = Object.fromEntries([
  ["all", "Semua"],
  ...loadCategories().map(c => [c.id, c.name])
]);
var ITEM = Object.fromEntries(MENU.map(m => [m.id, m]));

var STORE = {
  name: "AMAR PLASTIK",
  address: "Jl. Raya Industri No. 88, Medan",
  phone: "061-1234-5678",
  cashier: "Lina Puspa Melinda",
};

/* ---- Riwayat transaksi (persisten via localStorage) ---- */
function loadHistory() {
  try { return JSON.parse(localStorage.getItem("ap_history") || "[]"); }
  catch { return []; }
}
function saveHistory(list) {
  try { localStorage.setItem("ap_history", JSON.stringify(list)); } catch {}
}

/* ---- Utilitas ---- */
var rp = n => "Rp " + Math.round(n).toLocaleString("id-ID");
var $ = sel => document.querySelector(sel);

function toast(msg) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("is-show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("is-show"), 2600);
}

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

/* ---- Modal konfirmasi kustom (dipakai halaman apa pun) ---- */
var confirmCb = null;

function showConfirm({ icon, title, body, okText = "Ya, Lanjutkan", okClass = "danger", onOk }) {
  confirmCb = onOk;
  const iconEl = $("#modalIcon");
  if (iconEl) {
    if (typeof icon === "string" && icon.includes("<svg")) {
      iconEl.innerHTML = icon;
    } else {
      iconEl.textContent = icon || "";
    }
  }
  $("#modalTitle").textContent = title;
  $("#modalBody").textContent = body;
  const ok = $("#modalOk");
  ok.textContent = okText;
  ok.className = "modal-btn " + okClass;
  $("#modalBackdrop").hidden = false;
  ok.focus();
}

function closeConfirm(result) {
  $("#modalBackdrop").hidden = true;
  const cb = confirmCb;
  confirmCb = null;
  if (result && cb) cb();
}
