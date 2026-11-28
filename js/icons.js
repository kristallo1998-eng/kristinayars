// KRISTINAYARS — иконки контактов в стиле iOS 26/27 (Liquid Glass).
// Значки взяты из открытых наборов:
//   телефон, почта, адрес — Lucide (ISC)
//   VK — Font Awesome Brands (CC BY 4.0)
//   Telegram — Bootstrap Icons (MIT)
//   Дзен, Авито — официальные знаки сервисов (фигуры воспроизведены точно)
// Плитка: градиент + стеклянный блик + светлая кромка.

const ICON_SVG = {
  phone: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="bg-phone" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#7ef29a"/><stop offset="0.5" stop-color="#2fc94f"/><stop offset="1" stop-color="#12a03c"/>
      </linearGradient>
      <radialGradient id="hl-phone" cx="0.3" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
        <stop offset="0.45" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="rim-phone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#bg-phone)"/>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#hl-phone)"/>
    <rect x="0.7" y="0.7" width="22.6" height="22.6" rx="5.3" fill="none" stroke="url(#rim-phone)" stroke-width="0.85"/>
    <svg x="2.4" y="2.4" width="19.2" height="19.2" viewBox="0 0 24 24">
      <g fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
      </g>
    </svg>
  </svg>`,
  mail: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="bg-mail" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#8ecbff"/><stop offset="0.5" stop-color="#3f9dff"/><stop offset="1" stop-color="#0a6df0"/>
      </linearGradient>
      <radialGradient id="hl-mail" cx="0.3" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
        <stop offset="0.45" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="rim-mail" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#bg-mail)"/>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#hl-mail)"/>
    <rect x="0.7" y="0.7" width="22.6" height="22.6" rx="5.3" fill="none" stroke="url(#rim-mail)" stroke-width="0.85"/>
    <svg x="2.4" y="2.4" width="19.2" height="19.2" viewBox="0 0 24 24">
      <g fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
        <rect x="2" y="4" width="20" height="16" rx="2.6"/>
      </g>
    </svg>
  </svg>`,
  vk: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="bg-vk" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#63b5ff"/><stop offset="0.5" stop-color="#1489f5"/><stop offset="1" stop-color="#0064d2"/>
      </linearGradient>
      <radialGradient id="hl-vk" cx="0.3" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
        <stop offset="0.45" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="rim-vk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#bg-vk)"/>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#hl-vk)"/>
    <rect x="0.7" y="0.7" width="22.6" height="22.6" rx="5.3" fill="none" stroke="url(#rim-vk)" stroke-width="0.85"/>
    <svg x="2.6" y="6.8" width="18.8" height="11.4" viewBox="75 168 300 187" preserveAspectRatio="xMidYMid meet">
      <path fill="#fff" d="M75.6 168.267H126.747C128.427 253.76 166.133 289.973 196 297.44V168.267H244.16V242C273.653 238.827 304.64 205.227 315.093 168.267H363.253C359.313 187.435 351.46 205.583 340.186 221.579C328.913 237.574 314.461 251.071 297.733 261.227C316.41 270.499 332.907 283.63 346.132 299.751C359.357 315.873 369.01 334.618 374.453 354.747H321.44C316.555 337.262 306.614 321.61 292.865 309.754C279.117 297.899 262.173 290.368 244.16 288.107V354.747H238.373C136.267 354.747 78.0267 284.747 75.6 168.267Z"/>
    </svg>
  </svg>`,
  telegram: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="bg-telegram" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#7fd6fb"/><stop offset="0.5" stop-color="#29a9e8"/><stop offset="1" stop-color="#0d84cf"/>
      </linearGradient>
      <radialGradient id="hl-telegram" cx="0.3" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
        <stop offset="0.45" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="rim-telegram" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#bg-telegram)"/>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#hl-telegram)"/>
    <rect x="0.7" y="0.7" width="22.6" height="22.6" rx="5.3" fill="none" stroke="url(#rim-telegram)" stroke-width="0.85"/>
    <svg x="2.2" y="6.3" width="19.6" height="11.6" viewBox="0 4.2 16 7.6" preserveAspectRatio="xMidYMid meet">
      <path fill="#fff" d="M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
    </svg>
  </svg>`,
  pin: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="bg-pin" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#8bf5a2"/><stop offset="0.5" stop-color="#35d067"/><stop offset="1" stop-color="#16a344"/>
      </linearGradient>
      <radialGradient id="hl-pin" cx="0.3" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
        <stop offset="0.45" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="rim-pin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#bg-pin)"/>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#hl-pin)"/>
    <rect x="0.7" y="0.7" width="22.6" height="22.6" rx="5.3" fill="none" stroke="url(#rim-pin)" stroke-width="0.85"/>
    <svg x="2.4" y="2.4" width="19.2" height="19.2" viewBox="0 0 24 24">
      <g fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
        <circle cx="12" cy="10" r="3"/>
      </g>
    </svg>
  </svg>`,
  pinterest: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="bg-pinterest" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#ff6f8b"/><stop offset="0.5" stop-color="#e60023"/><stop offset="1" stop-color="#b8001b"/>
      </linearGradient>
      <radialGradient id="hl-pinterest" cx="0.3" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
        <stop offset="0.45" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="rim-pinterest" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#bg-pinterest)"/>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#hl-pinterest)"/>
    <rect x="0.7" y="0.7" width="22.6" height="22.6" rx="5.3" fill="none" stroke="url(#rim-pinterest)" stroke-width="0.85"/>
    <svg x="3.1" y="3.1" width="17.8" height="17.8" viewBox="0 0 24 24">
      <path fill="#fff" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
    </svg>
  </svg>`,

  dzen: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="bg-dzen" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#4a4a4a"/><stop offset="0.5" stop-color="#1c1c1c"/><stop offset="1" stop-color="#000"/>
      </linearGradient>
      <radialGradient id="hl-dzen" cx="0.3" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#fff" stop-opacity=".45"/>
        <stop offset="0.45" stop-color="#fff" stop-opacity=".1"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="rim-dzen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".5"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity=".1"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".05"/>
      </linearGradient>
    </defs>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#bg-dzen)"/>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#hl-dzen)"/>
    <rect x="0.7" y="0.7" width="22.6" height="22.6" rx="5.3" fill="none" stroke="url(#rim-dzen)" stroke-width="0.85"/>
    <svg x="3" y="3" width="18" height="18" viewBox="0 0 32 32">
      <path fill="#fff" d="M15.68 0C15.6 6.58 15.17 10.27 12.72 12.72C10.27 15.17 6.58 15.6 0 15.68V16.63C6.58 16.71 10.27 17.14 12.72 19.59C15.13 22 15.59 25.61 15.67 32H16.64C16.72 25.61 17.18 22 19.59 19.59C22 17.18 25.61 16.72 32 16.64V15.67C25.61 15.59 22 15.13 19.59 12.72C17.14 10.27 16.71 6.58 16.63 0H15.68Z"/>
    </svg>
  </svg>`,
  avito: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="bg-avito" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#7fe9ff"/><stop offset="0.5" stop-color="#1ba7e8"/><stop offset="1" stop-color="#0a72b8"/>
      </linearGradient>
      <radialGradient id="hl-avito" cx="0.3" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
        <stop offset="0.45" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="rim-avito" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#bg-avito)"/>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#hl-avito)"/>
    <rect x="0.7" y="0.7" width="22.6" height="22.6" rx="5.3" fill="none" stroke="url(#rim-avito)" stroke-width="0.85"/>
    <svg x="3.2" y="3.86" width="17.6" height="16.28" viewBox="0 0 122.4 113.22">
      <g fill="#fff">
        <circle cx="36.56" cy="76.51" r="36.56" opacity=".92"/>
        <circle cx="43.66" cy="21.46" r="13.61" opacity=".72"/>
        <circle cx="91.46" cy="29.59" r="29.6" opacity=".86"/>
        <circle cx="100.2" cy="86.42" r="22.2" opacity=".76"/>
      </g>
    </svg>
  </svg>`,
  doc: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="bg-doc" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#e8d8bc"/><stop offset="0.5" stop-color="#c9ad83"/><stop offset="1" stop-color="#9b7b50"/>
      </linearGradient>
      <radialGradient id="hl-doc" cx="0.3" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
        <stop offset="0.45" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="rim-doc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#bg-doc)"/>
    <rect x="0.4" y="0.4" width="23.2" height="23.2" rx="5.5" fill="url(#hl-doc)"/>
    <rect x="0.7" y="0.7" width="22.6" height="22.6" rx="5.3" fill="none" stroke="url(#rim-doc)" stroke-width="0.85"/>
    <g fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 3.8h7l4 4v12.4H7z"/>
      <path d="M14 3.8V8h4"/>
      <path d="M9.6 12h5.8M9.6 15.4h5.8"/>
    </g>
  </svg>`,
};

// Иконка для блока контактов
function icon(name) {
  const svg = ICON_SVG[name];
  return svg ? `<span class="ios-icon">${svg}</span>` : "";
}
