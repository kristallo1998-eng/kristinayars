// KRISTINAYARS — страница товара: галерея, заказ, таблица размеров.
// Данные товара лежат в <script type="application/json" id="product-data">.

(function () {
  const raw = document.getElementById("product-data");
  if (!raw) return;
  const p = JSON.parse(raw.textContent);
  ymGoal("product_view", productParams(p));

  /* ---------- галерея фото ---------- */
  const main = document.getElementById("pdp-main");
  if (main) {
    const box = document.getElementById("pdp-img");
    const source = main.closest("picture")?.querySelector("source");
    const thumbs = Array.from(document.querySelectorAll(".thumbs img"));
    const counter = document.getElementById("pdp-counter");
    const prev = document.querySelector(".pdp-nav-prev");
    const next = document.querySelector(".pdp-nav-next");

    const photos = thumbs.length
      ? thumbs.map(t => t.dataset.src)
      : [main.getAttribute("src")];
    let idx = 0;

    const show = (n) => {
      idx = (n + photos.length) % photos.length;
      const src = photos[idx];
      // меняем и <source> (WebP), и <img> — иначе браузер оставит первое фото
      if (source) source.srcset = src.replace(/\.jpg(\?|$)/i, ".webp$1");
      main.src = src;
      thumbs.forEach((t, k) => t.classList.toggle("active", k === idx));
      if (counter) counter.textContent = `${idx + 1}/${photos.length}`;
    };

    thumbs.forEach((t, k) => t.addEventListener("click", () => show(k)));
    if (prev) prev.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); show(idx - 1); });
    if (next) next.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); show(idx + 1); });

    // клавиатура: стрелки влево/вправо
    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });

    // свайп по большому фото (мобильные, в т.ч. iOS Safari)
    if (box && photos.length > 1) {
      let x0 = null, y0 = null, pid = null;
      const isNav = (t) => t && t.closest && t.closest(".pdp-nav");

      const start = (x, y, p, target) => {
        if (isNav(target)) { x0 = null; return; }
        x0 = x; y0 = y; pid = p;
      };
      const end = (x, y, p, target) => {
        if (x0 === null || (pid !== null && p !== null && p !== pid)) return;
        if (isNav(target)) { x0 = null; return; }
        const dx = x - x0, dy = y - y0;
        if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
          show(idx + (dx < 0 ? 1 : -1));
        }
        x0 = null; y0 = null; pid = null;
      };

      if (window.PointerEvent) {
        box.addEventListener("pointerdown", (e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          start(e.clientX, e.clientY, e.pointerId, e.target);
        });
        box.addEventListener("pointerup", (e) => end(e.clientX, e.clientY, e.pointerId, e.target));
        box.addEventListener("pointercancel", () => { x0 = null; pid = null; });
      } else {
        box.addEventListener("touchstart", (e) => {
          const t = e.touches[0];
          start(t.clientX, t.clientY, null, e.target);
        }, { passive: true });
        box.addEventListener("touchend", (e) => {
          const t = e.changedTouches[0];
          end(t.clientX, t.clientY, null, e.target);
        }, { passive: true });
        box.addEventListener("touchcancel", () => { x0 = null; }, { passive: true });
      }
    }

    show(0);
  }

  // Заказ: размер, рост, индивидуальный пошив
  const orderBox = document.getElementById("pdp-order");
  if (orderBox) {
    orderBox.innerHTML = orderBlockHtml(p, "pdp", false, "../");
    mountOrder(orderBox, p, "../");
  }

  // Таблица размеров
  const tile = document.querySelector(".chart-tile");
  if (tile) tile.onclick = () => { ymGoal("size_table_open", productParams(p)); openChart(tile.dataset.chart); };

  // Поделиться: на телефоне — системное меню, на компьютере — копия ссылки
  const shareBtn = document.getElementById("pdp-share-btn");
  if (shareBtn) {
    const label = shareBtn.querySelector(".cta-label");
    shareBtn.addEventListener("click", async () => {
      const url = location.href;
      const data = { title: document.title, url };
      if (navigator.share) {
        try { await navigator.share(data); ymGoal("share", productParams(p)); }
        catch (e) { /* пользователь закрыл меню */ }
      } else {
        let copied = false;
        try {
          await navigator.clipboard.writeText(url);
          copied = true;
        } catch (e) {
          // запасной вариант для браузеров без доступа к буферу обмена
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.setAttribute("readonly", "");
          ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
          document.body.appendChild(ta);
          ta.select();
          try { copied = document.execCommand("copy"); } catch (e2) { copied = false; }
          ta.remove();
        }
        if (copied && label) {
          label.textContent = "Ссылка скопирована";
          setTimeout(() => { label.textContent = "Поделиться"; }, 2200);
        }
        ymGoal("share", productParams(p));
      }
    });
  }

  // Сохранить в Pinterest
  const pinSave = document.getElementById("pdp-pin-save");
  if (pinSave) pinSave.addEventListener("click", () => ymGoal("pinterest_save", productParams(p)));

  // Мобильное меню
  const burger = document.getElementById("burger");
  if (burger) {
    burger.onclick = () => document.querySelector(".nav-links").classList.toggle("open");
  }
})();
