// KRISTINAYARS — вид каталога: плитка 1×1 … 6×6 или списком.
//
// Правила:
//   • десктоп: варианты 1×1, 2×2, 3×3, 4×4, 5×5, 6×6, Списком; по умолчанию 5×5
//   • телефон: варианты 1×1, 2×2, Списком; по умолчанию 1×1
//   • при смене ширины экрана список вариантов и вид пересобираются

(function () {
  var DESKTOP_VIEWS = [
    { v: "1", label: "Плитка 1×1" },
    { v: "2", label: "Плитка 2×2" },
    { v: "3", label: "Плитка 3×3" },
    { v: "4", label: "Плитка 4×4" },
    { v: "5", label: "Плитка 5×5" },
    { v: "6", label: "Плитка 6×6" },
    { v: "list", label: "Списком" }
  ];
  var MOBILE_VIEWS = [
    { v: "1", label: "1×1" },
    { v: "2", label: "2×2" },
    { v: "list", label: "Список" }
  ];
  var DESKTOP_DEFAULT = "5";
  var MOBILE_DEFAULT = "1";

  var mq = window.matchMedia("(max-width: 760px)");

  function isMobile() { return mq.matches; }
  function viewsList() { return isMobile() ? MOBILE_VIEWS : DESKTOP_VIEWS; }
  function defaultView() { return isMobile() ? MOBILE_DEFAULT : DESKTOP_DEFAULT; }

  // Иконка текущего вида: сетка плиток или полоски списка
  function viewIcon(view) {
    if (view === "list") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<rect x="3" y="5" width="18" height="3" rx="1.5"/>' +
        '<rect x="3" y="10.5" width="18" height="3" rx="1.5"/>' +
        '<rect x="3" y="16" width="18" height="3" rx="1.5"/></svg>';
    }
    var n = Math.min(parseInt(view, 10) || 2, 6);
    var gap = 1.6;
    var cell = (24 - gap * (n + 1)) / n;
    var rects = "";
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        rects += '<rect x="' + (gap + c * (cell + gap)).toFixed(2) +
          '" y="' + (gap + r * (cell + gap)).toFixed(2) +
          '" width="' + cell.toFixed(2) + '" height="' + cell.toFixed(2) + '" rx="1"/>';
      }
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + rects + '</svg>';
  }

  function setViewMeta(view) {
    var sel = document.getElementById("f-view");
    if (sel && sel.value !== view) sel.value = view;
    var ico = document.getElementById("view-ico");
    if (ico) ico.innerHTML = viewIcon(view);
  }

  function applyView(view) {
    var allowed = viewsList().map(function (o) { return o.v; });
    if (allowed.indexOf(view) === -1) view = defaultView();
    var grid = document.getElementById("grid");
    if (grid) {
      grid.classList.remove("view-1", "view-2", "view-3", "view-4", "view-5", "view-6", "view-list");
      grid.classList.add(view === "list" ? "view-list" : "view-" + view);
    }
    setViewMeta(view);
  }

  // Пересобираем список вариантов под текущий экран.
  // initial=true — только подписи/иконка, без смены класса сетки:
  // серверная разметка уже имеет нужное число колонок, а переключение
  // класса после первой отрисовки давало CLS 0.61 на десктопе.
  function buildViewSelect(keep, initial) {
    var sel = document.getElementById("f-view");
    if (!sel) return;
    var list = viewsList();
    sel.innerHTML = "";
    list.forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = o.v;
      opt.textContent = o.label;
      sel.appendChild(opt);
    });
    var view = keep && list.some(function (o) { return o.v === keep; }) ? keep : defaultView();
    if (initial) setViewMeta(view);
    else applyView(view);
  }

  function init() {
    var sel = document.getElementById("f-view");
    if (!sel) return;
    buildViewSelect(null, true);
    sel.onchange = function () { applyView(this.value); ymGoal("catalog_view"); };
    sel.oninput = function () { applyView(this.value); };
    var onChange = function () { buildViewSelect(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
