/* Корзина KRISTINAYARS: localStorage, панель, добавление из карточек.
   Хранит позиции с параметрами: модель, размер, рост, индивидуальный пошив. */

const CART_KEY = "ky_cart";
const CART_URL = "order/"; // относительный путь к странице оплаты

function cartBase() {
  try {
    const seg = location.pathname.replace(/^\/+/, "").split("/");
    const first = seg[0] || "";
    const subdirs = ["order", "product", "category", "blog", "privacy", "personal-data", "offer"];
    return subdirs.indexOf(first) >= 0 ? "../" : "";
  } catch (e) { return ""; }
}

const CART_SIZES = [];
for (let s = 38; s <= 58; s += 2) CART_SIZES.push(String(s));
const CART_HEIGHTS = [];
for (let h = 152; h <= 190; h += 2) CART_HEIGHTS.push(String(h));
const cartNormSize = (v) => (CART_SIZES.indexOf(String(v)) >= 0 ? String(v) : "");
const cartNormHeight = (v) => (CART_HEIGHTS.indexOf(String(v)) >= 0 ? String(v) : "");
const cartNormQty = (v) => { const n = parseInt(v, 10); return (n >= 1 && n <= 99) ? n : 1; };

function cartLoad() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function cartSave(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {}
  cartPaint();
}

/* Позиция: {id, size, height, custom} */
function cartAdd(item) {
  const items = cartLoad();
  const norm = {
    id: Number(item && item.id),
    size: cartNormSize(item && item.size),
    height: cartNormHeight(item && item.height),
    custom: !!(item && item.custom),
    qty: cartNormQty(item && item.qty),
  };
  if (!norm.id) return;
  const same = items.find(
    (x) =>
      Number(x.id) === norm.id &&
      cartNormSize(x.size) === norm.size &&
      cartNormHeight(x.height) === norm.height &&
      !!x.custom === norm.custom
  );
  if (same) {
    same.qty = Math.min(99, cartNormQty(same.qty) + norm.qty);
  } else {
    items.push(norm);
  }
  cartSave(items);
  cartOpen();
}

function cartRemove(i) {
  const items = cartLoad();
  items.splice(i, 1);
  cartSave(items);
}

function cartSet(i, patch) {
  const items = cartLoad();
  if (!items[i]) return;
  Object.assign(items[i], patch);
  cartSave(items);
}

function cartCount() {
  return cartLoad().reduce((n, x) => n + cartNormQty(x.qty), 0);
}

function cartTotal() {
  return cartLoad().reduce((sum, x) => {
    const p = PRODUCTS.find((y) => Number(y.id) === Number(x.id));
    if (!p) return sum;
    return sum + (p.price + (x.custom ? 2000 : 0)) * cartNormQty(x.qty);
  }, 0);
}

function cartMoney(v) {
  return v.toLocaleString("ru-RU") + " ₽";
}

function cartText() {
  const items = cartLoad();
  const lines = ["Заказ KRISTINAYARS", ""];
  items.forEach((x, i) => {
    const p = PRODUCTS.find((y) => Number(y.id) === Number(x.id));
    if (!p) return;
    const size = cartNormSize(x.size);
    const height = cartNormHeight(x.height);
    const custom = !!x.custom;
    const qty = cartNormQty(x.qty);
    lines.push(`${i + 1}. ${p.name} (арт. ${p.id})`);
    if (size) lines.push(`   Размер: ${size}`);
    if (height) lines.push(`   Рост: ${height} см`);
    if (custom) lines.push("   Индивидуальный пошив по моим меркам (+2 000 ₽)");
    if (qty > 1) lines.push(`   Количество: ${qty}`);
  });
  lines.push("", `Итого к оплате: ${cartMoney(cartTotal())}`);
  return lines.join("\n");
}

function cartTelegramLink() {
  return (
    "https://t.me/KRISTINAYARS_bot?text=" +
    encodeURIComponent(cartText())
  );
}

function cartVkLink() {
  return (
    "https://vk.me/kristinayars?text=" +
    encodeURIComponent(cartText())
  );
}

/* ---------- интерфейс панели ---------- */

function cartShell() {
  let box = document.getElementById("cart-panel");
  if (box) return box;
  box = document.createElement("div");
  box.className = "modal cart-modal";
  box.id = "cart-panel";
  box.hidden = true;
  box.innerHTML = `
    <div class="modal-backdrop" data-cart-close></div>
    <div class="modal-window cart-window">
      <button class="modal-x" type="button" data-cart-close aria-label="Закрыть">✕</button>
      <div class="cart-body">
        <h3 class="pdp-name cart-title">Корзина</h3>
        <div class="cart-list"></div>
        <div class="cart-foot">
          <div class="cart-total">Итого: <b class="cart-total-sum">0 ₽</b></div>
          <div class="cart-actions">
            <a class="btn cart-go cart-go-link" href="${CART_URL}">Оформить и оплатить</a>
            <a class="btn btn-outline cart-tg" target="_blank" rel="noopener noreferrer">Заказ в Telegram</a>
          </div>
          <p class="order-hint">Оплата — по QR через СБП или переводом на счёт. Реквизиты и QR — на странице оплаты.</p>
        </div>
      </div>
    </div>`;
  document.body.appendChild(box);
  box.addEventListener("click", (e) => {
    const close = e.target.closest("[data-cart-close]");
    if (close) {
      box.hidden = true;
      document.body.style.overflow = "";
      return;
    }
    const rm = e.target.closest("[data-cart-remove]");
    if (rm) {
      cartRemove(Number(rm.dataset.cartRemove));
      return;
    }
    const q = e.target.closest("[data-cart-qty]");
    if (q) {
      const i = Number(q.dataset.cartIndex);
      const items = cartLoad();
      const it = items[i];
      if (!it) return;
      it.qty = (it.qty || 1) + (q.dataset.cartQty === "+" ? 1 : -1);
      if (it.qty < 1) items.splice(i, 1);
      cartSave(items);
      return;
    }
  });
  box.addEventListener("change", (e) => {
    const sel = e.target.closest("[data-cart-field]");
    if (!sel) return;
    const i = Number(sel.dataset.cartIndex);
    const patch = {};
    if (sel.dataset.cartField === "size") patch.size = sel.value;
    if (sel.dataset.cartField === "height") patch.height = sel.value;
    if (sel.dataset.cartField === "custom") patch.custom = sel.checked;
    cartSet(i, patch);
  });
  return box;
}

function cartButton() {
  let btn = document.getElementById("cart-btn");
  if (btn) return btn;
  btn = document.createElement("button");
  btn.id = "cart-btn";
  btn.className = "cart-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Корзина");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .7h9.6a1 1 0 0 0 1-.7L21 8H6"/>' +
    '<circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/></svg>' +
    '<span class="cart-count" id="cart-count">0</span>';
  btn.addEventListener("click", () => {
    cartOpen();
    if (window.ymGoal) ymGoal("cart_open");
  });
  const nav = document.querySelector(".nav");
  if (nav) nav.insertBefore(btn, nav.querySelector(".nav-burger"));
  return btn;
}

function cartPaint() {
  const cnt = document.getElementById("cart-count");
  if (cnt) {
    const n = cartCount();
    cnt.textContent = n;
    cnt.classList.toggle("cart-count-on", n > 0);
  }
  const box = document.getElementById("cart-panel");
  if (!box) return;
  const list = box.querySelector(".cart-list");
  const items = cartLoad();
  if (!items.length) {
    list.innerHTML =
      '<p class="cart-empty">В корзине пока пусто. Выберите модель в каталоге и нажмите «В корзину».</p>';
  } else {
    list.innerHTML = items
      .map((x, i) => {
        const p = PRODUCTS.find((y) => Number(y.id) === Number(x.id));
        if (!p) return "";
        const photo = (p.photos || [])[0] || "";
        const base = cartBase();
        const size = cartNormSize(x.size);
        const height = cartNormHeight(x.height);
        const custom = !!x.custom;
        const qty = cartNormQty(x.qty);
        const sum = (p.price + (custom ? 2000 : 0)) * qty;
        const sizes = [];
        for (let s = 38; s <= 58; s += 2)
          sizes.push(
            `<option value="${s}"${size === String(s) ? " selected" : ""}>${s}</option>`
          );
        const heights = [];
        for (let h = 152; h <= 190; h += 2)
          heights.push(
            `<option value="${h}"${height === String(h) ? " selected" : ""}>${h} см</option>`
          );
        return `
      <div class="cart-item">
        <a class="cart-item-img" href="${base}product/${p.id}">
          ${photo ? `<picture><source srcset="${base + photo.replace(".jpg", ".webp")}" type="image/webp"><img src="${base + photo}" alt="${p.name}" loading="lazy"></picture>` : ""}
        </a>
        <div class="cart-item-info">
          <a class="cart-item-name" href="${base}product/${p.id}">${p.name}</a>
          <div class="cart-item-opts">
            <label class="sel"><span>Размер</span>
              <select data-cart-field="size" data-cart-index="${i}">
                <option value="">—</option>${sizes.join("")}
              </select>
            </label>
            <label class="sel"><span>Рост</span>
              <select data-cart-field="height" data-cart-index="${i}">
                <option value="">—</option>${heights.join("")}
              </select>
            </label>
          </div>
          <label class="order-check cart-custom">
            <input type="checkbox" data-cart-field="custom" data-cart-index="${i}"${custom ? " checked" : ""}>
            <span>Индивидуальный пошив (+2 000 ₽)</span>
          </label>
        </div>
        <div class="cart-item-side">
          <div class="cart-item-price">${cartMoney(sum)}</div>
          <div class="cart-item-qty">
            <button type="button" data-cart-qty="-" data-cart-index="${i}" aria-label="Меньше">−</button>
            <span>${qty}</span>
            <button type="button" data-cart-qty="+" data-cart-index="${i}" aria-label="Больше">+</button>
          </div>
          <button type="button" class="cart-item-del" data-cart-remove="${i}">Убрать</button>
        </div>
      </div>`;
      })
      .join("");
  }
  const total = box.querySelector(".cart-total-sum");
  if (total) total.textContent = cartMoney(cartTotal());
  const tg = box.querySelector(".cart-tg");
  if (tg) tg.href = items.length ? cartTelegramLink() : "#";
  const go = box.querySelector(".cart-go-link");
  if (go) go.href = cartBase() + "order/";
}

function cartOpen() {
  const box = cartShell();
  cartPaint();
  box.hidden = false;
  document.body.style.overflow = "hidden";
}

if (typeof document !== "undefined") {
  // добавление в корзину — из карточек каталога, мини-окна и страницы товара
  document.addEventListener("click", (e) => {
    if (typeof PRODUCTS === "undefined" || typeof cartAdd !== "function") return;
    const add = e.target.closest("[data-cart-add]");
    if (!add) return;
    e.preventDefault();
    e.stopPropagation();
    cartAdd({
      id: Number(add.dataset.cartAdd),
      size: add.dataset.cartSize || "",
      height: add.dataset.cartHeight || "",
      custom: add.dataset.cartCustom === "1",
    });
    if (window.ymGoal) ymGoal("cart_add");
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof PRODUCTS === "undefined") return;
    cartShell();
    cartButton();
    cartPaint();
  });
  // пересчёт при возврате на вкладку
  window.addEventListener("focus", () => {
    if (typeof PRODUCTS !== "undefined") cartPaint();
  });
}
