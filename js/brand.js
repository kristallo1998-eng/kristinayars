// KRISTINAYARS — данные бренда и адрес сайта.
// Единственный источник правды: контакты, тексты и домен меняются здесь.

const BRAND = {
  name: "KRISTINAYARS",
  tagline: "Авторский пошив одежды · EST 2018 · Санкт-Петербург",
  about: "KRISTINAYARS — это не просто бренд, это отражение страсти к дизайну и качественному пошиву одежды. Моя цель — создать одежду, которая будет не только стильной, но и комфортной, отражая индивидуальность. Я верю, что каждая деталь имеет значение.",
  founder: "Кристина — создательница бренда",
  phone: "+7 (999) 247-39-52",
  email: "kristinayars@bk.ru",
  vk: "https://vk.com/kristinayars",
  tg: "https://t.me/kristinayars",
  bot: "https://t.me/KRISTINAYARS_bot",
  market: "https://vk.com/market-174985872?screen=group",
  address: "г. Санкт-Петербург, пос. Парголово, ул. Тихоокеанская, д. 1 к. 2 (самовывоз)",
  pinterest: "https://ru.pinterest.com/KRISTINAYARS1/",
};

const SITE = {
  url: "https://www.kristinayars.ru",
  locale: "ru_RU",
  currency: "RUB",
  lang: "ru",
};

// Абсолютный URL ресурса относительно корня сайта.
function siteUrl(path = "") {
  const base = SITE.url.replace(/\/+$/, "");
  if (!path) return base + "/";
  return base + "/" + String(path).replace(/^\/+/, "");
}

// Цель в Яндекс.Метрике. Реальная отправка — в js/analytics.js (подключается
// позже), а эта заглушка нужна, чтобы страница не ломалась без метрики.
window.ymGoal = window.ymGoal || function () {};
