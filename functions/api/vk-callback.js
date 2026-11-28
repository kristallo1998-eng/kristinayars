// Cloudflare Pages Function: приёмник сообщений VK → чат «Заказы».
// Путь на сайте: /api/vk-callback
//
// Что делает: покупатель пишет в сообщения сообщества (кнопка на сайте
// подставляет текст заказа в буфер обмена), Callback API VK присылает
// сообщение сюда, и функция:
//   1. пересылает заказ в чат/диалог (env.VK_TARGET_PEER);
//   2. отвечает покупателю, что заказ получен.
//
// Секреты проекта Pages (wrangler pages secret put ...):
//   VK_TOKEN        — ключ доступа сообщества с правом «Сообщения»
//   VK_CONFIRMATION — строка подтверждения из настроек Callback API
//   VK_SECRET       — секретная строка в настройках Callback API (защита)
//   VK_TARGET_PEER  — куда присылать заказ: 2000000000+ID чата или ID пользователя

const REPLY_OK =
  "✅ Заказ получен! Мы свяжемся с вами в ближайшее время для подтверждения: уточним цвет и детали, пришлём итоговую сумму и способ оплаты.";

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

async function vk(env, method, params) {
  const p = new URLSearchParams();
  for (const k in params) p.set(k, String(params[k]));
  p.set("access_token", env.VK_TOKEN);
  p.set("v", "5.199");
  const r = await fetch(`https://api.vk.com/method/${method}`, {
    method: "POST",
    body: p,
  });
  return r.json().catch(() => ({}));
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response("ok");
  }

  // Диагностика: видно в wrangler pages deployment tail
  if (env.VK_TOKEN && body.type === "message_new") {
    const om = (body.object && (body.object.message || body.object)) || {};
    console.log(
      "vk-callback message_new peer=" + (om.peer_id || "?") +
      " from=" + (om.from_id || "?") +
      " text=" + String(om.text || "").slice(0, 40)
    );
  }

  // Подтверждение сервера при подключении Callback API
  if (body.type === "confirmation") {
    return new Response(env.VK_CONFIRMATION || "no-confirmation-set");
  }

  // Защита: секретная строка из настроек Callback API
  if (env.VK_SECRET && body.secret !== env.VK_SECRET) {
    return new Response("forbidden", { status: 403 });
  }

  if (body.type === "message_new" && env.VK_TOKEN && env.VK_TARGET_PEER) {
    const m = (body.object && (body.object.message || body.object)) || {};
    const fromId = Number(m.from_id || 0);
    // Только входящие от людей (не от сообществ и не исходящие)
    if (fromId > 0) {
      try {
        const text = (m.text || "").trim();
        const name = await vk(env, "users.get", {
          user_ids: String(fromId),
          fields: "screen_name",
        });
        const u =
          (name.response && name.response[0]) || {};
        const who =
          [u.first_name, u.last_name].filter(Boolean).join(" ") ||
          "Покупатель";
        const link = u.screen_name
          ? "vk.com/" + u.screen_name
          : "vk.com/id" + fromId;
        const body_ = text || "[сообщение без текста — вложение]";

        await vk(env, "messages.send", {
          peer_id: env.VK_TARGET_PEER,
          message: `🧵 Заказ с сайта — ${who} (${link})\n\n${body_}`,
          random_id: Date.now(),
          dont_parse_links: 1,
        });
        await vk(env, "messages.send", {
          peer_id: fromId,
          message: REPLY_OK,
          random_id: Date.now() + 1,
        });
      } catch (e) {
        // Не возвращаем ошибку, чтобы VK не зациклил повторы
      }
    }
  }

  return new Response("ok");
}

export async function onRequestGet() {
  return new Response("ok");
}
