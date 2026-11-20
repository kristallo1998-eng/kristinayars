// KRISTINAYARS — просмотр таблицы размеров поверх страницы.
// Используется и в модальном окне каталога, и на странице товара.

function chartBox() {
  let box = document.getElementById("chart-view");
  if (!box) {
    box = document.createElement("div");
    box.className = "chart-view";
    box.id = "chart-view";
    document.body.appendChild(box);
  }
  return box;
}

function openChart(src) {
  const box = chartBox();
  box.innerHTML = `
    <div class="chart-backdrop" data-chart-close></div>
    <div class="chart-window">
      <button class="modal-x" data-chart-close aria-label="Закрыть">✕</button>
      <img src="${src}" alt="Таблица размеров">
      <a class="btn" href="${src}" target="_blank" rel="noopener noreferrer">Открыть в новой вкладке</a>
    </div>`;
  box.hidden = false;
  for (const el of box.querySelectorAll("[data-chart-close]")) el.onclick = closeChart;
}

function closeChart() {
  const box = document.getElementById("chart-view");
  if (box) box.hidden = true;
}

function isChartOpen() {
  const box = document.getElementById("chart-view");
  return !!(box && !box.hidden);
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && isChartOpen()) {
    e.stopImmediatePropagation();   // одним Esc закрываем только таблицу
    closeChart();
  }
});
