// KRISTINAYARS — аналитика: Яндекс.Метрика (114216743) и Google Analytics 4
// (G-L5W9HV5979). Подключается на всех страницах: вебвизор, карта кликов, цели.

// --- Google Tag Manager (GTM-5H4ZL74C) --------------------------------------
// Контейнер GTM уже содержит GA4 G-L5W9HV5979 и расширенные события,
// поэтому отдельный gtag.js не загружаем — только один тег Google на страницу.
(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  var first = document.getElementsByTagName('script')[0];
  var s = document.createElement('script');
  s.async = 1;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5H4ZL74C';
  if (first && first.parentNode) first.parentNode.insertBefore(s, first);
  else document.head.appendChild(s);
})();

// --- Яндекс.Метрика ---------------------------------------------------------
(function (m, e, t, r, i, k, a) {
  m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
  m[i].l = 1 * new Date();
  for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === r) { return; }
  }
  k = e.createElement(t), a = e.getElementsByTagName(t)[0],
    k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=114216743', 'ym');

ym(114216743, 'init', {
  ssr: true,
  webvisor: true,
  clickmap: true,
  ecommerce: "dataLayer",
  referrer: document.referrer,
  url: location.href,
  accurateTrackBounce: true,
  trackLinks: true
});

// Цели: событие уходит в Метрику и в GA4.
// Список целей — в целях Метрики: заявка, поиск, смена вида, быстрый просмотр,
// шэринг, сохранение в Pinterest, просмотр товара, ошибка 404.
window.ymGoal = function (goal) {
  try {
    if (typeof ym === "function") ym(114216743, "reachGoal", goal);
  } catch (e) { /* метрика недоступна — не мешаем сайту */ }
  try {
    if (typeof window.gtag === "function") window.gtag("event", goal);
  } catch (e) { /* GA4 недоступна — не мешаем сайту */ }
};

// Цель «просмотр 404» — на странице ошибки (класс body).
(function () {
  try {
    if (document.body && document.body.classList.contains("nf-page")) {
      window.ymGoal("404_view");
    }
  } catch (e) { /* метрика недоступна */ }
})();
