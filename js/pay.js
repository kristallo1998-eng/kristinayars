/* Страница оплаты /order/: позиции (корзина или один товар из ?id=),
   расчёт суммы, отправка заказа в Telegram или VK. */

(function () {
  const cart = (typeof cartLoad === "function") ? cartLoad : () => [];
  const money = (v) => v.toLocaleString("ru-RU") + " ₽";

  const itemsBox = document.getElementById("op-items");
  const contactsBox = document.getElementById("op-contacts");
  const sumEl = document.getElementById("op-sum");
  const tg = document.getElementById("op-send-tg");
  const vk = document.getElementById("op-send-vk");
  const modelSel = document.getElementById("op-model");
  const sizeSel = document.getElementById("op-size");
  const heightSel = document.getElementById("op-height");
  const custom = document.getElementById("op-custom");
  const name = document.getElementById("op-name");
  const contact = document.getElementById("op-contact");
  const city = document.getElementById("op-city");
  const address = document.getElementById("op-address");
  const addressHint = document.getElementById("op-address-hint");
  const deliveryNote = document.getElementById("op-delivery-note");
  if (!itemsBox) return;

  // Способы доставки: стоимость, которую мы добавляем к сумме заказа
  const DELIVERY = {
    carrier: {
      title: "СДЭК, Почта России, Яндекс Доставка",
      price: 500,
      note: "Стоимость доставки 500 ₽ добавлена к сумме заказа.",
    },
    courier: {
      title: "Яндекс-курьер по СПб и Ленинградской области",
      price: 0,
      note: "Яндекс-курьер по Санкт-Петербургу и Ленинградской области — стоимость оплачивается отдельно покупателем.",
    },
    pickup: {
      title: "Самовывоз",
      price: 0,
      note: "Самовывоз — бесплатно. Адрес: Санкт-Петербург, пос. Парголово, ул. Тихоокеанская, д. 1 к. 2. Напишите заранее, чтобы вещь подготовили к вашему приезду.",
    },
  };
  const PICKUP_ADDRESS = "Санкт-Петербург, пос. Парголово, ул. Тихоокеанская, д. 1 к. 2";

  function delivery() {
    const el = document.querySelector('input[name="op-delivery"]:checked');
    const key = el ? el.value : "carrier";
    return Object.assign({ key: key }, DELIVERY[key] || DELIVERY.carrier);
  }

  const SIZES = [];
  for (let s = 38; s <= 58; s += 2) SIZES.push(s);
  const HEIGHTS = [];
  for (let h = 152; h <= 190; h += 2) HEIGHTS.push(h);

  const escHtml = (v) => String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const normSize = (v) => (SIZES.map(String).indexOf(String(v)) >= 0 ? String(v) : "");
  const normHeight = (v) => (HEIGHTS.map(String).indexOf(String(v)) >= 0 ? String(v) : "");
  const normQty = (v) => { const n = parseInt(v, 10); return (n >= 1 && n <= 99) ? n : 1; };

  const params = new URLSearchParams(location.search);
  const singleId = params.get("id");
  const singleSize = normSize(params.get("size") || "");
  const singleHeight = normHeight(params.get("height") || "");
  const singleMt = params.get("mt") === "1";

  let single = null;
  if (singleId && typeof PRODUCTS !== "undefined") {
    single = PRODUCTS.find((p) => String(p.id) === String(singleId)) || null;
  }

  function cartItems() {
    return cart().map((x) => ({
      id: Number(x && x.id),
      size: normSize(x && x.size),
      height: normHeight(x && x.height),
      custom: !!(x && x.custom),
      qty: normQty(x && x.qty),
    })).filter((x) => x.id);
  }

  function priceOf(id) {
    const p = (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).find((x) => x.id === id);
    return p ? p.price : 0;
  }

  function itemSum(it) {
    return (priceOf(it.id) + (it.custom ? 2000 : 0)) * it.qty;
  }

  /* ---------- единый список позиций ---------- */
  function currentItems() {
    const fromCart = cartItems();
    if (fromCart.length) return fromCart;
    if (single) {
      return [{
        id: single.id,
        size: singleSize,
        height: singleHeight,
        custom: singleMt,
        qty: 1,
      }];
    }
    return [];
  }

  function optsSelect(it, i, key, values, unit, placeholder) {
    const opts = [`<option value="">${placeholder}</option>`]
      .concat(
        values.map(
          (v) =>
            `<option value="${v}"${String(it[key]) === String(v) ? " selected" : ""}>${v}${unit || ""}</option>`
        )
      )
      .join("");
    return `<label class="sel"><span>${unit === " см" ? "Рост, см" : "Размер"}</span>
      <select data-order-item="${i}" data-item-field="${key}">${opts}</select></label>`;
  }

  function itemCard(it, i, editable) {
    const p = (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).find((x) => x.id === it.id);
    if (!p) return "";
    const photo = (p.photos || [])[0] || "";
    const sum = itemSum(it);
    const controls = editable
      ? `
        <div class="cart-item-opts">
          ${optsSelect(it, i, "size", SIZES, "", "Не выбран")}
          ${optsSelect(it, i, "height", HEIGHTS, " см", "Не выбран")}
        </div>
        <label class="order-check cart-custom">
          <input type="checkbox" data-order-item="${i}" data-item-field="custom"${it.custom ? " checked" : ""}>
          <span>Индивидуальный пошив (+2 000 ₽)</span>
        </label>
        <div class="cart-item-side">
          <div class="cart-item-price">${money(sum)}</div>
          <div class="cart-item-qty">
            <button type="button" data-item-qty="${i}" data-qty="-" aria-label="Меньше">−</button>
            <span>${it.qty}</span>
            <button type="button" data-item-qty="${i}" data-qty="+" aria-label="Больше">+</button>
          </div>
          <button type="button" class="cart-item-del" data-item-remove="${i}">Убрать</button>
        </div>`
      : `
        <div class="cart-item-opts">
          ${it.size ? `<span class="op-chip">Размер ${escHtml(it.size)}</span>` : ""}
          ${it.height ? `<span class="op-chip">Рост ${escHtml(it.height)} см</span>` : ""}
          ${it.custom ? `<span class="op-chip">Индивидуальный пошив</span>` : ""}
        </div>
        <div class="cart-item-side">
          <div class="cart-item-price">${money(sum)}</div>
        </div>`;
    const base = "../";
    const img = photo ? (base + photo) : "";
    const imgWebp = photo ? (base + photo.replace(".jpg", ".webp")) : "";
    return `
    <div class="cart-item">
      <a class="cart-item-img" href="${base}product/${p.id}">
        ${img ? `<picture><source srcset="${imgWebp}" type="image/webp"><img src="${img}" alt="${p.name}" loading="lazy"></picture>` : ""}
      </a>
      <div class="cart-item-info">
        <a class="cart-item-name" href="${base}product/${p.id}">${p.name}</a>
        ${controls}
      </div>
    </div>`;
  }

  function orderText(items) {
    const lines = ["Заказ KRISTINAYARS", ""];
    items.forEach((it, i) => {
      const p = (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).find((x) => x.id === it.id);
      if (!p) return;
      lines.push(`${i + 1}. ${p.name} (арт. ${p.id})`);
      if (it.size) lines.push(`   Размер: ${it.size}`);
      if (it.height) lines.push(`   Рост: ${it.height} см`);
      if (it.custom) lines.push("   Индивидуальный пошив по моим меркам (+2 000 ₽)");
      if (it.qty > 1) lines.push(`   Количество: ${it.qty}`);
    });
    if (name.value.trim()) lines.push(`Имя: ${name.value.trim()}`);
    if (contact.value.trim()) lines.push(`Контакт: ${contact.value.trim()}`);
    const d = delivery();
    lines.push(`Способ доставки: ${d.title}`);
    if (city.value.trim()) lines.push(`Город: ${city.value.trim()}`);
    if (address && address.value.trim()) {
      lines.push(`Адрес доставки: ${address.value.trim()}`);
    } else if (d.key === "pickup") {
      lines.push(`Адрес доставки: ${PICKUP_ADDRESS}`);
    }
    if (d.price) lines.push(`Стоимость доставки: ${money(d.price)}`);
    lines.push("", `Итого к оплате: ${money(total())}`);
    return lines.join("\n");
  }

  function total() {
    const items = currentItems();
    const sum = items.reduce((acc, it) => acc + itemSum(it), 0);
    return sum + delivery().price;
  }

  function shareLink(kind) {
    const url = "https://www.kristinayars.ru/order/";
    const text = orderText(currentItems());
    return kind === "tg"
      ? "https://t.me/KRISTINAYARS_bot?text=" + encodeURIComponent(text)
      : "https://vk.me/kristinayars?text=" + encodeURIComponent(text);
  }

  const clearBtn = document.getElementById("op-clear");

  function paint() {
    const items = currentItems();
    const fromCart = cartItems().length > 0;
    if (clearBtn) clearBtn.hidden = !fromCart;
    if (!items.length) {
      itemsBox.innerHTML =
        '<p class="cart-empty">В корзине пусто — выберите модель в каталоге и нажмите «В корзину».</p>';
    } else {
      itemsBox.innerHTML = `<div class="cart-list">${items
        .map((it, i) => itemCard(it, i, true))
        .join("")}</div>`;
    }
    sumEl.textContent = items.length ? money(total()) : "—";
    tg.href = items.length ? shareLink("tg") : "#";
    vk.href = items.length ? shareLink("vk") : "#";
    tg.classList.toggle("btn-disabled", !items.length);
    vk.classList.toggle("btn-disabled", !items.length);
    paintDelivery();
  }

  // Подсказки под способом доставки и полем адреса
  function paintDelivery() {
    const d = delivery();
    if (deliveryNote) deliveryNote.textContent = d.note || "";
    if (!addressHint) return;
    if (d.key === "pickup") {
      addressHint.textContent =
        "Укажите адрес пункта выдачи, в котором получите заказ, или оставьте поле пустым — заберём в Парголово.";
      if (address && !address.value.trim()) address.placeholder = PICKUP_ADDRESS;
    } else if (d.key === "courier") {
      addressHint.textContent =
        "Укажите адрес доставки в Санкт-Петербурге или Ленинградской области (квартира, дом, этаж).";
      if (address && address.placeholder === PICKUP_ADDRESS) {
        address.placeholder = "Ваш адрес доставки";
      }
    } else {
      addressHint.textContent =
        "Укажите адрес, куда привезти заказ, или адрес пункта выдачи, в котором получите его.";
      if (address && address.placeholder === PICKUP_ADDRESS) {
        address.placeholder = "Ваш адрес или адрес пункта выдачи";
      }
    }
  }

  /* редактирование позиции корзины прямо на странице */
  itemsBox.addEventListener("change", (e) => {
    const el = e.target.closest("[data-item-field]");
    if (!el || typeof cartSet !== "function") return;
    const i = Number(el.dataset.orderItem);
    const field = el.dataset.itemField;
    const patch = field === "custom" ? { custom: el.checked } : { [field]: el.value };
    cartSet(i, patch);
    paint();
  });
  itemsBox.addEventListener("click", (e) => {
    const rm = e.target.closest("[data-item-remove]");
    if (rm) {
      if (typeof cartRemove === "function") cartRemove(Number(rm.dataset.itemRemove));
      paint();
      return;
    }
    const q = e.target.closest("[data-item-qty]");
    if (q) {
      const i = Number(q.dataset.itemQty);
      const arr = cart();
      const it = arr[i];
      if (!it) return;
      it.qty = (it.qty || 1) + (q.dataset.qty === "+" ? 1 : -1);
      if (it.qty < 1) arr.splice(i, 1);
      if (typeof cartSave === "function") cartSave(arr);
      paint();
    }
  });

  [name, contact, city].forEach((el) => {
    el.addEventListener("input", () => {
      tg.href = shareLink("tg");
      vk.href = shareLink("vk");
    });
  });

  // способ доставки
  document.querySelectorAll('input[name="op-delivery"]').forEach((el) => {
    el.addEventListener("change", () => {
      paintDelivery();
      paint();
      if (window.ymGoal) ymGoal("order_delivery");
    });
  });

  // адрес доставки
  if (address) {
    address.addEventListener("input", () => {
      tg.href = shareLink("tg");
      vk.href = shareLink("vk");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (typeof cartSave === "function") cartSave([]);
      paint();
    });
  }

  paint();
})();
