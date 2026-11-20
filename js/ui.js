// KRISTINAYARS — общие элементы интерфейса: кнопки «наверх» и «Назад».
// Подключается на всех страницах сайта.

// Кнопка «Назад»: слева, на одном уровне с «наверх».
// Возвращает на предыдущую страницу, а если истории нет — на главную.
(function () {
  if (document.querySelector(".to-back")) return;

  var btn = document.createElement("button");
  btn.className = "to-back";
  btn.type = "button";
  btn.setAttribute("aria-label", "Назад");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>' +
    '<span class="to-back-tip">Назад</span>';
  document.body.appendChild(btn);

  btn.addEventListener("click", function () {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  });
})();

(function () {
  if (document.querySelector(".to-top")) return;

  var btn = document.createElement("button");
  btn.className = "to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Наверх");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>' +
    '<span class="to-top-tip">Наверх</span>';
  document.body.appendChild(btn);

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // фокус наверх — для клавиатуры и скринридеров
    var skip = document.getElementById("top");
    if (skip) {
      skip.setAttribute("tabindex", "-1");
      skip.focus({ preventScroll: true });
    }
  });

  function update() {
    btn.classList.toggle("is-visible", window.pageYOffset > 400);
  }
  // без requestAnimationFrame: обновление класса и так дешёвое,
  // а в headless-режиме rAF может не сработать
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* ---------- Свои выпадающие списки с прозрачным фоном ---------- */
/* На десктопе нативный список <select> непрозрачный. Подменяем его своим:
   полупрозрачная панель с размытием, как системный список на телефоне.
   Работает для всех .sel select (фильтры, размер/рост в мини-окне и на
   странице товара). На телефоне (до 760px) оставляем системный список. */

(function () {
  var panel = null;
  var openSelect = null;

  function isMobile() {
    return window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
  }

  function closePanel() {
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
    if (openSelect) openSelect.setAttribute("aria-expanded", "false");
    openSelect = null;
  }

  function place(sel) {
    var r = sel.getBoundingClientRect();
    panel.style.left = Math.round(r.left) + "px";
    panel.style.width = Math.round(r.width) + "px";
    var top = Math.round(r.bottom + 6);
    var h = panel.offsetHeight;
    if (top + h > window.innerHeight - 10) {
      top = Math.max(10, Math.round(r.top - 6 - h));
    }
    panel.style.top = top + "px";
  }

  function openFor(sel) {
    if (isMobile()) return;
    if (openSelect === sel) { closePanel(); return; }
    closePanel();

    panel = document.createElement("div");
    panel.className = "ky-cs-panel";
    panel.setAttribute("role", "listbox");

    for (var i = 0; i < sel.options.length; i++) {
      (function (opt) {
        var item = document.createElement("button");
        item.type = "button";
        item.className = "ky-cs-item" + (opt.selected ? " is-sel" : "");
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", opt.selected ? "true" : "false");
        item.textContent = opt.textContent;
        item.addEventListener("click", function () {
          sel.value = opt.value;
          sel.dispatchEvent(new Event("change", { bubbles: true }));
          closePanel();
          sel.focus({ preventScroll: true });
        });
        panel.appendChild(item);
      })(sel.options[i]);
    }

    document.body.appendChild(panel);
    openSelect = sel;
    sel.setAttribute("aria-haspopup", "listbox");
    sel.setAttribute("aria-expanded", "true");
    place(sel);
  }

  // Открываем свой список вместо нативного
  document.addEventListener("mousedown", function (e) {
    var el = e.target;
    var sel = el && el.closest ? el.closest(".sel select") : null;
    if (!sel || isMobile()) return;
    e.preventDefault();
    openFor(sel);
  }, true);

  // Клавиатура: Enter / пробел / стрелка вниз
  document.addEventListener("keydown", function (e) {
    var el = e.target;
    var sel = el && el.closest ? el.closest(".sel select") : null;
    if (!sel || isMobile()) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      openFor(sel);
    }
  }, true);

  // Закрытие: клик мимо, Esc, прокрутка, изменение размера
  document.addEventListener("click", function (e) {
    if (!panel) return;
    var el = e.target;
    if (panel.contains(el)) return;
    if (el && el.closest && el.closest(".sel select")) return;
    closePanel();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel) {
      var sel = openSelect;
      closePanel();
      if (sel) sel.focus({ preventScroll: true });
    }
  });

  window.addEventListener("scroll", function () { if (panel) closePanel(); }, true);
  window.addEventListener("resize", function () { if (panel) closePanel(); });
})();

// Битые изображения прячем без inline-обработчиков onerror:
// так страницы работают при строгом Content-Security-Policy.
(function () {
  window.addEventListener(
    "error",
    function (e) {
      var el = e.target;
      if (el && el.tagName === "IMG") {
        el.classList.add("broken-image");
        el.style.display = "none";
      }
    },
    true
  );
})();


/* ---------- Прямые чаты: копирование текста заказа + подсказка ---------- */
/* Работает по делегированию: клик по любой ссылке, ведущей в чат бренда
   (t.me/KRISTINAYARS_bot?text=... или vk.me/kristinayars?text=...),
   копирует текст заказа в буфер обмена и показывает подсказку. */

function kyToast(msg) {
  var t = document.getElementById("ky-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "ky-toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(kyToast._h);
  kyToast._h = setTimeout(function () { t.classList.remove("show"); }, 7000);
}

function kyFallbackCopy(text, done) {
  try {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    done();
  } catch (e) {
    /* буфер недоступен — просто открываем чат */
  }
}

window.kyCopyOrder = function (text, msg) {
  var done = function () {
    kyToast(msg || "Текст заказа скопирован в буфер обмена");
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, function () {
      kyFallbackCopy(text, done);
    });
  } else {
    kyFallbackCopy(text, done);
  }
};

document.addEventListener("click", function (e) {
  var el = e.target;
  var a = el && el.closest ? el.closest('a[target="_blank"]') : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  var isTg = h.indexOf("https://t.me/KRISTINAYARS_bot?text=") === 0;
  var isVk = h.indexOf("https://vk.me/kristinayars") === 0;
  if (!isTg && !isVk) return;
  var i = h.indexOf("?text=");
  var text = i > -1 ? decodeURIComponent(h.slice(i + 6)) : "";
  if (!text) return;
  window.kyCopyOrder(
    text,
    isTg
      ? "Откроется чат с брендом в Telegram — текст заказа подставится в поле сообщения. Если нет — он скопирован в буфер обмена, вставьте его."
      : "Откроются сообщения сообщества VK — текст заказа скопирован в буфер обмена, вставьте его в поле сообщения."
  );
});


// Применение data-атрибутов оформления через DOM API (совместимо со строгим CSP,
// без inline-атрибутов style в HTML). Работает и для динамически добавленных узлов.
(function () {
  function applyOne(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.dataset && el.dataset.ph) el.style.setProperty("--ph", el.dataset.ph);
    if (el.dataset && el.dataset.bg) el.style.background = el.dataset.bg;
    if (el.dataset && el.dataset.span) el.style.setProperty("--span", el.dataset.span);
  }
  function apply(root) {
    root = root || document;
    if (root !== document) applyOne(root);
    var nodes = root.querySelectorAll ? root.querySelectorAll("[data-ph],[data-bg],[data-span]") : [];
    for (var i = 0; i < nodes.length; i++) applyOne(nodes[i]);
  }
  window.kyApplyDataStyles = apply;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(function () { apply(document); });

  // динамический контент (каталог, модалки, карточки)
  if (typeof MutationObserver !== "undefined") {
    var obs = new MutationObserver(function (mutations) {
      for (var m = 0; m < mutations.length; m++) {
        var added = mutations[m].addedNodes;
        for (var j = 0; j < added.length; j++) apply(added[j]);
      }
    });
    ready(function () {
      if (document.body) obs.observe(document.body, { childList: true, subtree: true });
    });
  }
})();

/* ---------- Полноэкранный просмотр фото товара ---------- */
/* Клик по главному фото в карточке товара (страница товара и мини-окно)
   открывает просмотр на весь экран: стрелки/свайп — листание, колесо,
   пинч и двойной клик — приближение, перетаскивание — сдвиг. */

(function () {
  var lb = null, stage = null, imgEl = null, countEl = null;
  var photos = [], idx = 0;
  var scale = 1, tx = 0, ty = 0;
  var lastFocus = null;
  var ptrs = new Map();
  var pinch = null, drag = null;
  var downPt = null;

  var ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>';
  var ICON_L = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  var ICON_R = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function apply() {
    imgEl.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    lb.classList.toggle("is-zoomed", scale > 1);
  }

  function reset() {
    scale = 1; tx = 0; ty = 0;
    if (imgEl) apply();
  }

  function clampPan() {
    var maxX = Math.max(0, (imgEl.offsetWidth * scale - stage.clientWidth) / 2);
    var maxY = Math.max(0, (imgEl.offsetHeight * scale - stage.clientHeight) / 2);
    tx = clamp(tx, -maxX, maxX);
    ty = clamp(ty, -maxY, maxY);
  }

  function zoomAt(cx, cy, factor) {
    var prev = scale;
    scale = clamp(scale * factor, 1, 5);
    if (scale === prev) return;
    var r = stage.getBoundingClientRect();
    var ox = cx - (r.left + r.width / 2);
    var oy = cy - (r.top + r.height / 2);
    var k = scale / prev;
    tx = (tx - ox) * k + ox;
    ty = (ty - oy) * k + oy;
    clampPan();
    apply();
  }

  function show(n) {
    idx = (n + photos.length) % photos.length;
    reset();
    imgEl.src = photos[idx];
    countEl.textContent = (idx + 1) + " / " + photos.length;
    lb.classList.toggle("is-single", photos.length < 2);
    [idx + 1, idx - 1].forEach(function (k) {
      var p = photos[(k + photos.length) % photos.length];
      if (p && p !== photos[idx]) { var im = new Image(); im.src = p; }
    });
  }

  function onKey(e) {
    if (!lb) return;
    var k = e.key;
    if (k === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    else if (k === "ArrowLeft") { e.preventDefault(); e.stopPropagation(); show(idx - 1); }
    else if (k === "ArrowRight") { e.preventDefault(); e.stopPropagation(); show(idx + 1); }
    else if (k === "+" || k === "=") {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.25);
    } else if (k === "-" || k === "_") {
      e.preventDefault();
      var r2 = stage.getBoundingClientRect();
      zoomAt(r2.left + r2.width / 2, r2.top + r2.height / 2, 0.8);
    } else if (k === "0") {
      e.preventDefault();
      reset();
    }
  }

  function close() {
    if (!lb) return;
    document.removeEventListener("keydown", onKey, true);
    window.removeEventListener("resize", reset);
    if (lb.parentNode) lb.parentNode.removeChild(lb);
    lb = null; stage = null; imgEl = null; countEl = null;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) {
      try { lastFocus.focus({ preventScroll: true }); } catch (err) {}
    }
  }

  function open(list, start) {
    photos = list.slice();
    lastFocus = document.activeElement;
    lb = document.createElement("div");
    lb.className = "ky-lb";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Просмотр фото");
    lb.innerHTML =
      '<div class="ky-lb-top"><span class="ky-lb-count"></span>' +
      '<button type="button" class="ky-lb-close" aria-label="Закрыть">' + ICON_X + '</button></div>' +
      '<button type="button" class="ky-lb-arrow ky-lb-prev" aria-label="Предыдущее фото">' + ICON_L + '</button>' +
      '<button type="button" class="ky-lb-arrow ky-lb-next" aria-label="Следующее фото">' + ICON_R + '</button>' +
      '<div class="ky-lb-stage"><img class="ky-lb-img" alt="" decoding="async"></div>';
    document.body.appendChild(lb);
    stage = lb.querySelector(".ky-lb-stage");
    imgEl = lb.querySelector(".ky-lb-img");
    countEl = lb.querySelector(".ky-lb-count");
    document.body.style.overflow = "hidden";

    lb.querySelector(".ky-lb-close").addEventListener("click", close);
    lb.querySelector(".ky-lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".ky-lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target === stage) close();
    });

    stage.addEventListener("dblclick", function (e) {
      e.preventDefault();
      if (scale > 1) reset(); else zoomAt(e.clientX, e.clientY, 2.5);
    });
    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });

    stage.addEventListener("pointerdown", function (e) {
      if (e.target.closest && e.target.closest("button")) return;
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 1) {
        drag = { x: e.clientX, y: e.clientY, tx: tx, ty: ty, scale: scale };
      } else if (ptrs.size === 2) {
        var a = Array.from(ptrs.values());
        pinch = {
          d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1,
          s: scale, tx: tx, ty: ty
        };
        drag = null;
      }
    });

    stage.addEventListener("pointermove", function (e) {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 2 && pinch) {
        var a = Array.from(ptrs.values());
        var d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
        var cx = (a[0].x + a[1].x) / 2, cy = (a[0].y + a[1].y) / 2;
        var ns = clamp(pinch.s * (d / pinch.d), 1, 5);
        var r = stage.getBoundingClientRect();
        var ox = cx - (r.left + r.width / 2);
        var oy = cy - (r.top + r.height / 2);
        var k = ns / pinch.s;
        scale = ns;
        tx = (pinch.tx - ox) * k + ox;
        ty = (pinch.ty - oy) * k + oy;
        clampPan();
        apply();
      } else if (drag && drag.scale > 1) {
        tx = drag.tx + (e.clientX - drag.x);
        ty = drag.ty + (e.clientY - drag.y);
        clampPan();
        apply();
      }
    });

    function pointerEnd(e) {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.delete(e.pointerId);
      if (ptrs.size < 2) pinch = null;
      if (ptrs.size === 0) {
        if (drag && drag.scale <= 1) {
          var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            show(idx + (dx < 0 ? 1 : -1));
          }
        }
        drag = null;
      }
    }
    stage.addEventListener("pointerup", pointerEnd);
    stage.addEventListener("pointercancel", pointerEnd);

    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", reset);
    show(start || 0);
  }

  // открытие: клик по главному фото товара (не по миниатюре и не после свайпа)
  document.addEventListener("pointerdown", function (e) {
    downPt = { x: e.clientX, y: e.clientY };
  }, true);

  document.addEventListener("click", function (e) {
    if (lb) return;
    var el = e.target;
    if (!el || !el.closest) return;
    if (el.closest(".thumbs, .pdp-nav, .pdp-counter, .ky-lb")) return;
    if (downPt && (Math.abs(e.clientX - downPt.x) > 8 || Math.abs(e.clientY - downPt.y) > 8)) return;
    var box = el.closest("#pdp-img, #modal-img");
    if (!box) return;
    var img = box.querySelector("img");
    if (!img) return;
    var host = box.closest(".pdp-media, .vA-photo") || box;
    var list = [];
    var thumbs = host.querySelectorAll(".thumbs img[data-src]");
    for (var i = 0; i < thumbs.length; i++) list.push(thumbs[i].getAttribute("data-src"));
    if (!list.length) {
      var s = img.getAttribute("src");
      if (!s) return;
      list = [s];
    }
    var cur = img.getAttribute("src") || "";
    var start = 0;
    for (var j = 0; j < list.length; j++) {
      if (list[j] === cur) { start = j; break; }
    }
    open(list, start);
  });
})();
