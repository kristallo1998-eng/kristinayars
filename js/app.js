// KRISTINAYARS — каталог: рендер, фильтры, модальное окно.
// Зависит от brand.js (BRAND, SITE), order.js (заказ), data.js (CATS, COLORS, PRODUCTS).

const $ = id => document.getElementById(id);

const state = {
  cat: "all",
  gender: "all",
  color: "",       // "" = любой цвет
  sort: "default",
  q: "",
};

/* ---------- фильтры ---------- */

function fillSelect(el, items, value) {
  el.innerHTML = "";
  for (const [v, label] of items) {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = label;
    if (v === value) o.selected = true;
    el.appendChild(o);
  }
}

function buildSelects() {
  fillSelect($("f-cats"), [["all", "Все категории"], ...Object.entries(CATS)], state.cat);
  fillSelect($("f-gender"), [["all", "Любой"], ["f", "Женское"], ["m", "Мужское"], ["u", "Унисекс"]], state.gender);
  // в фильтре — только цвета, которые реально есть в каталоге
  const used = Object.keys(COLORS).filter(k => PRODUCTS.some(p => p.colors.includes(k)));
  fillSelect($("f-colors"), [["", "Любой цвет"], ...used.map(k => [k, COLORS[k].name])], state.color);
}

function filtered() {
  let list = PRODUCTS.filter(p =>
    (state.cat === "all" || p.cat === state.cat) &&
    (state.gender === "all" || p.gender === state.gender) &&
    (!state.color || p.colors.includes(state.color)) &&
    (!state.q || p.name.toLowerCase().includes(state.q))
  );
  if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

const productUrl = p => `product/${p.id}`;

/* ---------- каталог ---------- */

// Современным браузерам — WebP, остальным — JPEG
const webp = src => src.replace(/\.jpg(\?|$)/, ".webp$1");

// Меняем фото в галерее: обновляем и <source>, и <img>
function setPhoto(img, src) {
  const source = img.closest("picture")?.querySelector("source");
  if (source) source.srcset = webp(src);
  img.src = src;
}

function imgTag(p, cls, eager) {
  // Фото берём из выгрузки VK; при отсутствии — цветная заглушка.
  const photos = p.photos || [];
  const src = photos[0] || `images/${p.id}.jpg`;
  const loading = eager ? "eager" : "lazy";
  const fetch = eager ? ' fetchpriority="high"' : "";
  return `<div class="${cls}" data-ph="${COLORS[p.colors[0]]?.hex || "#ddd"}">
    <span class="ph-label">KRISTINAYARS</span>
    <picture>
      <source srcset="${webp(src)}" type="image/webp">
      <img src="${src}" alt="${p.name}" loading="${loading}" decoding="async"${fetch}
           data-photos='${JSON.stringify(photos)}'>
    </picture>
    ${photos.length > 1 ? `<span class="pcard-badge">1/${photos.length}</span>` : ""}
  </div>`;
}

function render() {
  const list = filtered();
  $("count").textContent = `Найдено: ${list.length} из ${PRODUCTS.length}`;
  $("empty").hidden = list.length > 0;

  $("grid").innerHTML = list.map((p, i) => `
    <article class="pcard" data-id="${p.id}">
      ${imgTag(p, "pcard-img", i < 6)}
      <div class="pcard-info">
        <div class="pcard-cat">${CATS[p.cat]}</div>
        <div class="pcard-name">${p.name}</div>
        <div class="pcard-status">Под заказ · 2–3 дня</div>
        <div class="pcard-bottom">
          <span class="pcard-price">${fmtPrice(p.price)}</span>
          <span class="pcard-dots">${p.colors.map(c =>
            `<i data-bg="${COLORS[c]?.hex || "#ddd"}"></i>`).join("")}</span>
        </div>
        <a class="pcard-more" href="${productUrl(p)}">Страница товара \u2197\uFE0E</a>
        <div class="pcard-links">
          <a class="pcard-pay" href="order/?id=${p.id}">Оплатить</a>
          <button type="button" class="pcard-cart" data-cart-add="${p.id}">В корзину</button>
        </div>
      </div>
    </article>
  `).join("");

  for (const el of $("grid").querySelectorAll(".pcard"))
    el.onclick = e => {
      if (e.target.closest("a")) return;   // ссылки внутри карточки не открывают модалку
      ymGoal("quicklook");
      openModal(+el.dataset.id);
    };

  bindHoverGallery();
}

/* Прокрутка фото в карточке: наведение мыши (десктоп) и свайп (телефон) */
function bindHoverGallery() {
  for (const card of $("grid").querySelectorAll(".pcard")) {
    const img = card.querySelector(".pcard-img img");
    const badge = card.querySelector(".pcard-badge");
    let photos = [];
    try { photos = JSON.parse(img?.dataset.photos || "[]"); } catch { }
    if (!img || photos.length < 2) continue;

    let i = 0, timer = null;
    const set = (n) => {
      i = (n + photos.length) % photos.length;
      setPhoto(img, photos[i]);
      if (badge) badge.textContent = `${i + 1}/${photos.length}`;
    };

    card.addEventListener("mouseenter", () => {
      timer = setInterval(() => set(i + 1), 1200);
    });
    card.addEventListener("mouseleave", () => {
      clearInterval(timer);
      timer = null;
      set(0);
    });

    // свайп по фото в карточке — листаем фото, не открывая окно
    let x0 = null, y0 = null, swiped = false;
    const im = card.querySelector(".pcard-img");
    im.addEventListener("touchstart", e => {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; swiped = false;
    }, { passive: true });
    im.addEventListener("touchend", e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        swiped = true;
        set(dx < 0 ? i + 1 : i - 1);
      }
      x0 = null; y0 = null;
    }, { passive: true });
    card.addEventListener("click", e => {
      if (swiped) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  }
}

/* ---------- описание по разделам (Детали / Состав ткани / О модели) ---------- */

const DESC_LABELS = ["Детали", "Состав ткани", "О модели"];

function descSections(desc) {
  const out = [];
  let title = null, items = [];
  (desc || "").split("\n").forEach(raw => {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith("•")) {
      items.push(line.replace(/^•\s*/, ""));
    } else if (DESC_LABELS.includes(line)) {
      if (title !== null || items.length) out.push({ title, items });
      title = line; items = [];
    } else {
      items.push(line);
    }
  });
  if (title !== null || items.length) out.push({ title, items });
  return out;
}

/* Логотип Pinterest: красный круг с белой «P» */
const PIN_LOGO = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +  '<circle cx="12" cy="12" r="12" fill="#E60023"/>' +
  '<path fill="#fff" d="M9.3 19.9c.2-1 .4-2 .6-2.9l1.2-5.2H9.2c-.3 0-.5-.2-.4-.5l.6-2.7h1.7' +
  'c-.1-2.2 1.2-4 3.6-4 1.2 0 2.1.4 2.6 1.1.4.6.4 1.4.3 2.2l-.6 2.7c-.2.9.2 1.3 1 1.3' +
  '1.2 0 2.1-1.3 2.1-3.2 0-2.7-1.9-4.6-4.8-4.6-3.3 0-5.2 2.4-5.2 4.9 0 1 .4 1.9.8 2.4' +
  '.1.2.1.3 0 .5l-.3 1.3c-.1.3-.3.4-.6.2-1.2-.6-1.9-2.2-1.9-3.6C4.6 11.4 6.8 8 12.1 8' +
  'c4.4 0 7.2 3 7.2 6.4 0 4.4-2.5 7.6-6.1 7.6-1.2 0-2.3-.6-2.7-1.4l-.8 2.9' +
  'c-.3 1.1-.9 2.3-1.4 3.4z"/></svg>';

/* Логотип VK: синий квадрат с белыми буквами */
const VK_LOGO = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
  '<rect x="0" y="0" width="24" height="24" rx="3" fill="#4a76a8"/>' +
  '<text x="12" y="16.5" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="Arial, sans-serif">VK</text></svg>';

/* Похожие модели для мини-окна: 5 карточек в один ряд */
function relatedBlock(p) {
  const rel = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 5);
  if (!rel.length) return "";
  const cards = rel.map(x => {
    const photo = (x.photos || [])[0] || "";
    const ph = COLORS[x.colors[0]]?.hex || "#ddd";
    const img = photo
      ? `<picture><source srcset="${webp(photo)}" type="image/webp">
         <img src="${photo}" alt="${x.name}" decoding="async"></picture>`
      : "";
    return `<a class="modal-rel-card" href="product/${x.id}">
        <span class="modal-rel-img" data-ph="${ph}">${img}</span>
        <span class="modal-rel-name">${x.name}</span>
        <span class="modal-rel-price">${fmtPrice(x.price)}</span>
      </a>`;
  }).join("");
  return `<div class="modal-rel">
      <h4 class="pdp-desc-h">Похожие модели</h4>
      <div class="modal-rel-row">${cards}</div>
    </div>`;
}

/* ---------- модальное окно ---------- */

function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const photos = p.photos || [];
  const chart = p.chart || [];
  const sections = descSections(p.desc || "");
  const descNav = sections.some(s => s.title)
    ? `<div class="pdp-desc-nav">${sections.map((s, i) => s.title
        ? `<a href="#md${i}" data-md="${i}">${s.title}</a>` : "").join("")}</div>`
    : "";
  const descHtml = sections.map((s, i) => s.items.length
    ? `<ul class="desc-list desc-group" id="md${i}">${s.items.map(x => `<li>${x}</li>`).join("")}</ul>`
    : "").join("");

  const mNav = photos.length > 1 ? `
          <button class="pdp-nav pdp-nav-prev" type="button" aria-label="Предыдущее фото">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
          </button>
          <button class="pdp-nav pdp-nav-next" type="button" aria-label="Следующее фото">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
          </button>
          <span class="pdp-counter" id="m-counter">1/${photos.length}</span>` : "";

  $("modal-body").innerHTML = `
    <div class="vA">
      <div class="vA-top">
        <div class="vA-photo">
          <div class="modal-img" id="modal-img" data-ph="${COLORS[p.colors[0]]?.hex || "#ddd"}">
            <span class="ph-label">KRISTINAYARS</span>
            <picture>
              <source srcset="${webp(photos[0] || "")}" type="image/webp">
              <img src="${photos[0] || ""}" alt="${p.name}" decoding="async">
            </picture>
            ${mNav}
          </div>
          ${photos.length > 1 ? `<div class="thumbs">${photos.map((src, i) =>
              `<picture><source srcset="${webp(src)}" type="image/webp">
                <img src="${src}" alt="${p.name} — фото ${i + 1}" class="${i === 0 ? "active" : ""}" data-src="${src}"></picture>`).join("")}</div>` : ""}
          ${chart.length ? `
            <div class="chart-box">
              <button class="chart-link" type="button" data-chart="${chart[0]}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                     stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                  <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>
                </svg>
                Таблица размеров — открыть полностью
              </button>
            </div>` : ""}
        </div>
        <div class="vA-info">
          <div class="modal-cat">${CATS[p.cat]} · ${p.gender === "m" ? "Мужское" : p.gender === "f" ? "Женское" : "Унисекс"}</div>
          <div class="modal-name">${p.name}</div>
          <div class="vA-price">${fmtPrice(p.price)}</div>
          ${descNav}
          <div class="v-desc-2col">${descHtml}</div>
          <div class="vA-specs">
            <span>Размеры: 38–58</span>
            <span>Рост: 152–190 см</span>
            <span>Под заказ · 2–3 дня</span>
            <span>Индивидуальный пошив: +2 000 ₽</span>
            <span>Цвет: ${p.colors.map(c => COLORS[c]?.name).join(", ")}</span>
          </div>
        </div>
      </div>
      <div class="vA-bar">
        ${orderBlockHtml(p, "modal", true, "")}
        <div class="modal-actions">
          <a class="btn btn-outline" target="_blank" rel="noopener noreferrer"
             href="${p.url || "https://vk.com/market/product/"}">${VK_LOGO} Смотреть в VK</a>
          ${p.pin ? `<a class="btn btn-outline" target="_blank" rel="noopener noreferrer"
             href="${p.pin}">${PIN_LOGO} Смотреть в Pinterest</a>` : ""}
          <a class="btn btn-outline" href="${productUrl(p)}">Страница товара</a>
        </div>
      </div>
      ${relatedBlock(p)}
    </div>`;

  // галерея: клик по миниатюре, стрелки и свайп/драг меняют главное фото
  const main = $("modal-img").querySelector("img");
  const mThumbs = Array.from($("modal-body").querySelectorAll(".thumbs img"));
  const mCounter = $("m-counter");
  const mPrev = $("modal-body").querySelector(".pdp-nav-prev");
  const mNext = $("modal-body").querySelector(".pdp-nav-next");
  let mIdx = 0;
  const mShow = (n) => {
    if (!photos.length) return;
    mIdx = (n + photos.length) % photos.length;
    setPhoto(main, photos[mIdx]);
    mThumbs.forEach((o, k) => o.classList.toggle("active", k === mIdx));
    if (mCounter) mCounter.textContent = `${mIdx + 1}/${photos.length}`;
  };
  mThumbs.forEach((t, k) => t.onclick = () => mShow(k));

  // якорная строка описания: прокручиваем мини-окно к нужному разделу
  $("modal-body").querySelectorAll(".pdp-desc-nav a").forEach(a => {
    a.onclick = (e) => {
      e.preventDefault();
      const t = $("modal-body").querySelector(a.getAttribute("href"));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  });
  if (mPrev) mPrev.onclick = (e) => { e.preventDefault(); e.stopPropagation(); mShow(mIdx - 1); };
  if (mNext) mNext.onclick = (e) => { e.preventDefault(); e.stopPropagation(); mShow(mIdx + 1); };

  const mBox = $("modal-img");
  if (mBox && photos.length > 1) {
    let x0 = null, y0 = null, pid = null;
    const isNav = (t) => t && t.closest && t.closest(".pdp-nav");
    const start = (e) => {
      if (isNav(e.target)) { x0 = null; return; }
      if (e.pointerType === "mouse" && e.button !== 0) return;
      x0 = e.clientX; y0 = e.clientY; pid = e.pointerId ?? null;
      try { if (mBox.setPointerCapture && e.pointerId != null) mBox.setPointerCapture(e.pointerId); } catch (_) {}
    };
    const end = (e) => {
      if (x0 === null) return;
      if (pid != null && e.pointerId != null && e.pointerId !== pid) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) mShow(mIdx + (dx < 0 ? 1 : -1));
      x0 = null; y0 = null; pid = null;
    };
    if (window.PointerEvent) {
      mBox.addEventListener("pointerdown", start);
      mBox.addEventListener("pointerup", end);
      mBox.addEventListener("pointercancel", () => { x0 = null; pid = null; });
    } else {
      mBox.addEventListener("touchstart", (e) => { const t = e.touches[0]; if (!isNav(e.target)) { x0 = t.clientX; y0 = t.clientY; } }, { passive: true });
      mBox.addEventListener("touchend", (e) => {
        if (x0 === null) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - x0, dy = t.clientY - y0;
        if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) mShow(mIdx + (dx < 0 ? 1 : -1));
        x0 = null; y0 = null;
      }, { passive: true });
      mBox.addEventListener("touchcancel", () => { x0 = null; }, { passive: true });
    }
  }

  // таблица размеров открывается отдельно поверх
  const tile = $("modal-body").querySelector(".chart-tile, .chart-link");
  if (tile) {
    tile.onclick = () => openChart(tile.dataset.chart);
  }

  // блок заказа: размер, рост, индивидуальный пошив
  mountOrder($("modal-body"), p, "");

  $("modal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("modal").hidden = true;
  document.body.style.overflow = "";
}

/* ---------- инфо-разделы ---------- */

function renderStatic() {
  $("about-text").textContent = BRAND.about;
  $("about-founder").textContent = BRAND.founder;
  $("contacts-list").innerHTML = `
    <li>${icon("phone")}<span><a href="tel:${BRAND.phone.replace(/[^+\d]/g, "")}">${BRAND.phone}</a></span></li>
    <li>${icon("mail")}<span><a href="mailto:${BRAND.email}">${BRAND.email}</a></span></li>
    <li>${icon("vk")}<span>VK: <a href="${BRAND.vk}" target="_blank" rel="noopener noreferrer">vk.com/kristinayars</a>
        · <a href="${BRAND.market}" target="_blank" rel="noopener noreferrer">маркет</a></span></li>
    <li>${icon("telegram")}<span>Telegram: <a href="${BRAND.tg}" target="_blank" rel="noopener noreferrer">@kristinayars</a>
        · <a href="${BRAND.bot}" target="_blank" rel="noopener noreferrer">бот заказов</a></span></li>
    <li>${icon("pin")}<span>${BRAND.address}</span></li>
    <li>${icon("pinterest")}<span><a href="${BRAND.pinterest}" target="_blank" rel="noopener noreferrer">Pinterest</a> — идеи образов, подборки и новинки</span></li>
    <li>${icon("mail")}<span><a href="/offer/">Публичная оферта</a> — условия продажи, доставки и возврата</span></li>`;
}

/* ---------- SEO ---------- */

// Домен берём из brand.js — мета-теги не расходятся с SITE.url.
function syncMeta() {
  const base = siteUrl("/");
  const set = (sel, attr, value) => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute(attr, value);
  };
  set('link[rel="canonical"]', "href", base);
  set('meta[property="og:url"]', "content", base);
  set('meta[property="og:image"]', "content", siteUrl("images/cover.jpg"));
  set('meta[name="twitter:image"]', "content", siteUrl("images/cover.jpg"));
}

// Разметка каталога (ItemList) — генерируется при сборке в js/schema.js.
function injectSchema() {
  if (typeof SCHEMA === "undefined" || !SCHEMA) return;
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(SCHEMA);
  document.head.appendChild(s);
}

/* ---------- init ---------- */

$("f-search").oninput = e => { state.q = e.target.value.trim().toLowerCase(); render(); ymGoal("search"); };
$("f-search-btn").onclick = () => {
  const w = $("search-wrap"), i = $("f-search");
  const open = !w.classList.contains("open");
  w.classList.toggle("open", open);
  i.hidden = !open;
  if (open) i.focus();
};

// Пришли по ссылке «Найти» со страницы 404: /?q=текст — подставляем в поиск
(function () {
  const q = new URLSearchParams(location.search).get("q");
  if (!q) return;
  const input = $("f-search");
  state.q = q.trim().toLowerCase();
  input.value = q;
  $("search-wrap").classList.add("open");
  input.hidden = false;
  render();
})();
$("f-search").onkeydown = e => {
  if (e.key === "Escape") { $("f-search-btn").click(); $("f-search").value = ""; state.q = ""; render(); }
};
$("f-sort").onchange = e => { state.sort = e.target.value; render(); };
$("f-cats").onchange = e => { state.cat = e.target.value; render(); };
$("f-gender").onchange = e => { state.gender = e.target.value; render(); };
$("f-colors").onchange = e => { state.color = e.target.value; render(); };
$("f-reset").onclick = () => {
  state.cat = "all"; state.gender = "all"; state.color = "";
  state.sort = "default"; state.q = "";
  $("f-search").value = ""; $("f-sort").value = "default";
  $("search-wrap").classList.remove("open");
  $("f-search").hidden = true;
  buildSelects(); render();
};
$("modal-close").onclick = closeModal;
$("modal-x").onclick = closeModal;
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (isChartOpen()) return;   // таблицу размеров закрывает chart.js
  closeModal();
});

const navLinks = document.querySelector(".nav-links");
const closeMenu = () => navLinks && navLinks.classList.remove("open");

$("burger").onclick = (e) => {
  e.stopPropagation();
  navLinks.classList.toggle("open");
};
navLinks.addEventListener("click", e => {
  if (e.target.closest("a")) closeMenu();
});
document.addEventListener("click", e => {
  if (!navLinks.classList.contains("open")) return;
  if (!e.target.closest(".nav")) closeMenu();
});
window.addEventListener("scroll", closeMenu, { passive: true });


buildSelects();
renderStatic();
render();
syncMeta();
injectSchema();
