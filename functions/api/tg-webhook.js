// Cloudflare Pages Function: приёмник заказов Telegram → чат сообщества.
// Путь на сайте: /api/tg-webhook
//
// Что делает: покупатель отправляет заказ боту @KRISTINAYARS_bot (текст заказа
// подставляется кнопкой на сайте автоматически), вебхук принимает сообщение и:
//   1. пересылает заказ в закрытый чат сообщества (env.TG_TARGET_CHAT);
//   2. отвечает покупателю, что заказ получен.
//
// Секреты проекта Pages (wrangler pages secret put ...):
//   TG_BOT_TOKEN    — токен бота из @BotFather
//   TG_TARGET_CHAT  — куда присылать заказ: "@username_канала" или числовой ID группы
//   WEBHOOK_SECRET  — случайная строка, заданная в set_webhook (проверяется в заголовке)

const REPLY_OK =
  "✅ Заказ получен! Мы свяжемся с вами в ближайшее время для подтверждения: уточним цвет и детали, пришлём итоговую сумму и способ оплаты.";

const REPLY_START =
  "Здравствуйте! 👗 KRISTINAYARS — авторский пошив одежды, Санкт-Петербург.\n\n" +
  "Заказ оформляется на сайте kristinayars.ru: выберите модель, размер и рост " +
  "и нажмите «Отправить заказ в Telegram» — готовый текст заказа придёт сюда, " +
  "вам останется его отправить.\n\n" +
  "Все изделия шьём под заказ — 2–3 рабочих дня. Размеры 38–58, рост 152–190, " +
  "шьём и по вашим меркам.\n\n" +
  "Остались вопросы — просто напишите здесь 💬";

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

async function tg(token, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json().catch(() => ({}));
}

export async function onRequestGet(context) {
  const { request, env } = context;

  // Защищённый режим настройки: /api/tg-webhook?setup=<WEBHOOK_SECRET>&method=getMe
  // Прозрачно вызывает метод Bot API (Cloudflare имеет доступ к api.telegram.org
  // даже там, где с локальной машины он заблокирован).
  const url = new URL(request.url);
  const setup = url.searchParams.get("setup") || "";
  const secret = env.WEBHOOK_SECRET || "";
  if (secret && setup && setup === secret) {
    const method = url.searchParams.get("method");
    if (!method) return json({ error: "method required" });
    const token = env.TG_BOT_TOKEN;
    if (!token) return json({ error: "TG_BOT_TOKEN not set" });
    const params = {};
    for (const [k, v] of url.searchParams) {
      if (k !== "setup" && k !== "method") params[k] = v;
    }
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return json(await r.json().catch(() => ({})));
  }

  return new Response("ok");
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Проверка, что запрос пришёл от Telegram
  const secret = env.WEBHOOK_SECRET;
  if (secret) {
    const got = request.headers.get("X-Telegram-Bot-Api-Secret-Token") || "";
    if (got !== secret) return new Response("forbidden", { status: 403 });
  }

  let update;
  try {
    update = await request.json();
  } catch (e) {
    return new Response("ok");
  }

  const token = env.TG_BOT_TOKEN;
  const target = env.TG_TARGET_CHAT;
  if (!token || !target) return new Response("ok");

  const msg = update.message;
  // Работаем только с личными сообщениями покупателей
  if (!msg || !msg.chat || msg.chat.type !== "private") {
    return new Response("ok");
  }

  const text = (msg.text || msg.caption || "").trim();

  try {
    // Приветствие на /start — без пересылки в чат сообщества
    if (text.startsWith("/start") || text.startsWith("/help")) {
      await tg(token, "sendMessage", {
        chat_id: msg.chat.id,
        text: REPLY_START,
      });
      return new Response("ok");
    }

    const from = msg.from || {};
    const who =
      [from.first_name, from.last_name].filter(Boolean).join(" ") ||
      (from.username ? "@" + from.username : "Покупатель");
    const nick = from.username ? ` (@${from.username})` : "";
    const body = text || "[сообщение без текста — фото/файл]";

    if (text) {
      await tg(token, "sendMessage", {
        chat_id: target,
        text: `🧵 Заказ с сайта — ${who}${nick}\n\n${body}`,
        disable_web_page_preview: true,
      });
    } else {
      // Фото/документ: копируем сообщение как есть и подписываем отдельно
      await tg(token, "copyMessage", {
        chat_id: target,
        from_chat_id: msg.chat.id,
        message_id: msg.message_id,
      });
      await tg(token, "sendMessage", {
        chat_id: target,
        text: `🧵 Сообщение с сайта — ${who}${nick}`,
      });
    }

    // Подтверждение покупателю
    await tg(token, "sendMessage", {
      chat_id: msg.chat.id,
      text: REPLY_OK,
    });
  } catch (e) {
    // Не возвращаем ошибку, чтобы Telegram не зациклил повторы
  }

  return new Response("ok");
}
