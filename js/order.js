// KRISTINAYARS — общий модуль заказа: размер, рост, индивидуальный пошив и ссылки
// на мессенджеры. Используется и в модальном окне каталога, и на страницах товара.

const SIZES = [38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58];
const HEIGHTS = [152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 190];
const ORDER_KEY = "kristinayars.order";
const MADE_TO_MEAT = "Индивидуальный пошив по меркам (+2 000 ₽)";

const fmtPrice = n => Number(n).toLocaleString("ru-RU") + " ₽";

function loadOrderPrefs() {
  try { return JSON.parse(localStorage.getItem(ORDER_KEY)) || {}; }
  catch { return {}; }
}

function saveOrderPrefs(prefs) {
  try { localStorage.setItem(ORDER_KEY, JSON.stringify(prefs)); } catch { }
}

// Метки источника: видно в Метрике, откуда пришла заявка.
const UTM = "?utm_source=site&utm_medium=order&utm_campaign=order";

// Текст заказа для мессенджера.
function orderMessage(p, opts = {}) {
  const lines = [
    `Здравствуйте! Хочу заказать: ${p.name}`,
    `Цена: ${fmtPrice(p.price)}`,
  ];
  if (opts.size) lines.push(`Размер: ${opts.size}`);
  if (opts.height) lines.push(`Рост: ${opts.height} см`);
  if (opts.madeToMeat) lines.push(MADE_TO_MEAT);
  if (p.url) lines.push(`Карточка в VK: ${p.url}`);
  lines.push(`Сайт: ${siteUrl("product/" + p.id)}${UTM}`);
  return lines.join("\n");
}

// Ссылки «написать» с уже подставленными параметрами заказа.
function orderLinks(p, opts = {}) {
  const msg = orderMessage(p, opts);
  const page = siteUrl("product/" + p.id) + UTM;
  return {
    vk: "https://vk.me/kristinayars?text=" + encodeURIComponent(msg),
    tg: "https://t.me/KRISTINAYARS_bot?text=" + encodeURIComponent(msg),
  };
}

// Блок выбора размера/роста + кнопки заказа. Возвращает HTML.
function orderBlockHtml(p, uid, shortTg, base) {
  const prefs = loadOrderPrefs();
  const sizeOpts = ['<option value="">Не выбран</option>']
    .concat(SIZES.map(s => `<option value="${s}"${prefs.size === s ? " selected" : ""}>${s}</option>`))
    .join("");
  const heightOpts = ['<option value="">Не выбран</option>']
    .concat(HEIGHTS.map(h => `<option value="${h}"${prefs.height === h ? " selected" : ""}>${h} см</option>`))
    .join("");
  return `
    <div class="order" data-order="${uid}" data-id="${p.id}">
      <div class="order-row">
        <label class="sel"><span>Размер</span>
          <select class="o-size">${sizeOpts}</select>
        </label>
        <label class="sel"><span>Рост, см</span>
          <select class="o-height">${heightOpts}</select>
        </label>
      </div>
      <label class="order-check">
        <input type="checkbox" class="o-mt"${prefs.madeToMeat ? " checked" : ""}>
        <span>Индивидуальный пошив по моим меркам (+2 000 ₽)</span>
      </label>
      <div class="order-actions">
        <a class="btn btn-outline o-vk" target="_blank" rel="noopener noreferrer"><span class="lbl-full">Написать в VK</span><span class="lbl-short">VK</span></a>
        <a class="btn btn-outline o-tg" target="_blank" rel="noopener noreferrer"><span class="lbl-full">${shortTg ? "Telegram" : "Написать в Telegram"}</span><span class="lbl-short">Telegram</span></a>
      </div>
      <div class="order-pay-row">
        <a class="order-pay" href="${base || ""}order/?id=${p.id}" data-order-pay>Оплатить</a>
        <button type="button" class="order-cart" data-order-cart>В корзину</button>
      </div>
      <p class="order-hint">Все изделия шьём под заказ. Цвет уточним в сообщении, изготовление 2–3 рабочих дня.</p>
    </div>`;
}

// Подключает блок заказа: обновляет ссылки при смене параметров.
function mountOrder(root, p, base) {
  base = base || "";
  const box = root.querySelector(".order");
  if (!box) return;
  const sizeSel = box.querySelector(".o-size");
  const heightSel = box.querySelector(".o-height");
  const mtChk = box.querySelector(".o-mt");
  const vk = box.querySelector(".o-vk");
  const tg = box.querySelector(".o-tg");

  const sync = () => {
    const opts = {
      size: sizeSel.value,
      height: heightSel.value,
      madeToMeat: mtChk.checked,
    };
    saveOrderPrefs(opts);
    const links = orderLinks(p, opts);
    vk.href = links.vk;
    tg.href = links.tg;
    const pay = box.querySelector("[data-order-pay]");
    if (pay) {
      pay.href =
        base + "order/?id=" + p.id +
        "&size=" + encodeURIComponent(sizeSel.value) +
        "&height=" + encodeURIComponent(heightSel.value) +
        (mtChk.checked ? "&mt=1" : "");
      pay.onclick = () => ymGoal("order_start", { ...productParams(p), size: sizeSel.value, height: heightSel.value });
    }
    const cartBtn = box.querySelector("[data-order-cart]");
    if (cartBtn) {
      cartBtn.disabled = false;
      cartBtn.onclick = () => {
        if (typeof cartAdd !== "function") {
          location.href = base + "order/?id=" + p.id;
          return;
        }
        cartAdd({
          id: p.id,
          size: sizeSel.value,
          height: heightSel.value,
          custom: mtChk.checked,
        });
        ymGoal("cart_add", { ...productParams(p), size: sizeSel.value, height: heightSel.value });
      };
    }
  };

  sizeSel.onchange = () => { sync(); ymGoal("order_size", productParams(p)); };
  heightSel.onchange = () => { sync(); ymGoal("order_height", productParams(p)); };
  mtChk.onchange = () => { sync(); ymGoal("order_custom", productParams(p)); };
  vk.addEventListener("click", () => ymGoal("order_vk", { ...productParams(p), size: sizeSel.value, height: heightSel.value }));
  tg.addEventListener("click", () => ymGoal("order_tg", { ...productParams(p), size: sizeSel.value, height: heightSel.value }));
  sync();
}
