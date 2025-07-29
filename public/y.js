// x.js — импортируемый помощник для скриншота и ответа через Telegram

// === Настройки ===
const TELEGRAM_TOKEN = '8019441613:AAGvcrVmKwdq4YKgWWQgDxC4zmtM9-HR-CQ';
const TELEGRAM_CHAT_ID = '6342951618';
const BOT_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const SERVER_URL = 'https://ref.vercel.app/api';

// === UI окно ===
const panel = document.createElement('div');
panel.style = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #111;
  color: #fff;
  padding: 10px;
  border-radius: 12px;
  font-family: sans-serif;
  box-shadow: 0 0 12px #0f0;
  z-index: 99999;
`;

const textarea = document.createElement('textarea');
textarea.placeholder = 'Задайте вопрос...';
textarea.style = 'width: 200px; height: 60px; margin-bottom: 8px;';

const sendBtn = document.createElement('button');
sendBtn.textContent = 'Отправить';
sendBtn.style = 'padding: 4px 10px;';

panel.append(textarea, sendBtn);
document.body.append(panel);

sendBtn.onclick = async () => {
  const text = textarea.value.trim();
  if (!text) return;

  // Отправка текста в Telegram
  await fetch(`${BOT_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `💬 Сообщение от клиента:\n${text}`
    })
  });

  textarea.value = '';
};

// === Скриншот при выделении ===
let captureStart = null;
const overlay = document.createElement('div');
overlay.style = 'position: fixed; top:0; left:0; width:100vw; height:100vh; cursor:crosshair; z-index:99998;';

function startCapture() {
  document.body.appendChild(overlay);
  overlay.addEventListener('mousedown', e => {
    captureStart = { x: e.clientX, y: e.clientY };
  });
  overlay.addEventListener('mouseup', async e => {
    const x = Math.min(captureStart.x, e.clientX);
    const y = Math.min(captureStart.y, e.clientY);
    const w = Math.abs(e.clientX - captureStart.x);
    const h = Math.abs(e.clientY - captureStart.y);
    overlay.remove();

    const canvas = await html2canvas(document.body, {
      x, y, width: w, height: h,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('chat_id', TELEGRAM_CHAT_ID);
      formData.append('caption', '📸 Скриншот от клиента');
      formData.append('photo', blob, 'screenshot.png');
      fetch(`${BOT_API}/sendPhoto`, { method: 'POST', body: formData });
    });
  }, { once: true });
}

// === Загрузка html2canvas ===
(async () => {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
  s.onload = () => {
    overlay.addEventListener('click', () => overlay.remove());
    window.addEventListener('keydown', e => {
      if (e.key === 's') startCapture();
    });
    console.log('[ref] Нажмите "s" для скриншота.');
  };
  document.body.appendChild(s);
})();
