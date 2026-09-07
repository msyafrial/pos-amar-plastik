/* ============================================================
   Amar Plastik — shared.js
   Data, state, dan utilitas yang dipakai semua halaman.
   Riwayat transaksi disimpan di localStorage agar persisten
   antar file HTML.
   ============================================================ */

const CATEGORIES = [
  { id: "all",      name: "Semua",     count: 8 },
  { id: "kue",      name: "Bahan Kue", count: 4 },
  { id: "plastik",  name: "Plastik",   count: 2 },
  { id: "kemasan",  name: "Kemasan",   count: 2 },
];

const MENU = [
  { id: 1, name: "Tepung Terigu 1kg",  cat: "kue",     emoji: "🌾", tint: "#fdf3e7", price: 12500, old: 15000, stock: 48, exp: "03/27", sku: "SKU-00001", batch: "BRG001-0926-A" },
  { id: 2, name: "Gula Pasir 1kg",     cat: "kue",     emoji: "🧂", tint: "#f6f1fd", price: 15500, old: null,  stock: 36, exp: "09/27", sku: "SKU-00002", batch: "BRG002-0826-B" },
  { id: 3, name: "Mentega 250gr",      cat: "kue",     emoji: "🧈", tint: "#fdf6e3", price: 18900, old: 22000, stock: 24, exp: "01/27", sku: "SKU-00003", batch: "BRG003-0726-C" },
  { id: 4, name: "Coklat Bubuk 500gr", cat: "kue",     emoji: "🍫", tint: "#f3e9e2", price: 26500, old: null,  stock: 18, exp: "05/27", sku: "SKU-00004", batch: "BRG004-0926-D" },
  { id: 5, name: "Plastik Kresek L",   cat: "plastik", emoji: "🛍️", tint: "#eef4fd", price: 8500,  old: null,  stock: 3,  exp: null,    sku: "SKU-00005", batch: "BRG005-1026-A" },
  { id: 6, name: "Mica Bento Kotak",   cat: "kemasan", emoji: "🍱", tint: "#eef7ee", price: 12000, old: 14500, stock: 60, exp: null,    sku: "SKU-00006", batch: "BRG006-0826-B" },
  { id: 7, name: "Cup Puding Isi 50",  cat: "kemasan", emoji: "🧁", tint: "#fff0ec", price: 21500, old: null,  stock: 15, exp: null,    sku: "SKU-00007", batch: "BRG007-1026-C" },
  { id: 8, name: "Plastik Vacuum 1kg", cat: "plastik", emoji: "🥡", tint: "#f0eefb", price: 27500, old: null,  stock: 0,  exp: null,    sku: "SKU-00008", batch: "BRG008-0926-D" },
];

const TAX_RATE = 0.10;
const CAT_NAME = Object.fromEntries(CATEGORIES.map(c => [c.id, c.name]));
const ITEM = Object.fromEntries(MENU.map(m => [m.id, m]));

const STORE = {
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
  localStorage.setItem("ap_history", JSON.stringify(list));
}

/* ---- Utilitas ---- */
const rp = n => "Rp " + Math.round(n).toLocaleString("id-ID");
const $ = sel => document.querySelector(sel);

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("is-show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("is-show"), 2600);
}

function stockStatus(m) {
  return m.stock === 0 ? "out" : m.stock <= 5 ? "low" : "ok";
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
let confirmCb = null;

function showConfirm({ icon, title, body, okText = "Ya, Lanjutkan", okClass = "danger", onOk }) {
  confirmCb = onOk;
  $("#modalIcon").textContent = icon;
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
