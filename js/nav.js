// KRISTINAYARS — мобильное меню для страниц без каталога (гамбургер).
// Повторяет поведение главной страницы: закрывается при скролле,
// при тапе вне меню и при выборе пункта.

(function () {
  var burger = document.getElementById("burger");
  var links = document.querySelector(".nav-links");
  if (!burger || !links) return;

  var close = function () { links.classList.remove("open"); };

  burger.addEventListener("click", function (e) {
    e.stopPropagation();
    links.classList.toggle("open");
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) close();
  });
  document.addEventListener("click", function (e) {
    if (!links.classList.contains("open")) return;
    if (!e.target.closest(".nav")) close();
  });
  window.addEventListener("scroll", close, { passive: true });
})();
