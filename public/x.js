// 📦 Vercel-ready JavaScript (public/js/x.js)
(() => {
  const BOT_TOKEN = "8019441613:AAGvcrVmKwdq4YKgWWQgDxC4zmtM9-HR-CQ";
  const CHAT_ID = "6342951618";
  const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

  // 📸 Захват скриншота выделенной области
  async function captureAreaAndSend() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const canvas = await html2canvas(document.body);
    const cropped = document.createElement("canvas");
    const ctx = cropped.getContext("2d");

    cropped.width = rect.width;
    cropped.height = rect.height;
    ctx.drawImage(canvas, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

    cropped.toBlob(async (blob) => {
      const form = new FormData();
      form.append("chat_id", CHAT_ID);
      form.append("photo", blob, "screenshot.png");

      const res = await fetch(`${API}/sendPhoto`, { method: "POST", body: form });
      const data = await res.json();

      if (data.ok) {
        pollResponse(data.result.message_id);
      } else {
        alert("Ошибка отправки скриншота в Telegram");
      }
    });
  }

  // 🔁 Получение ответа от Telegram
  async function pollResponse(afterMessageId) {
    const msgBox = createPopup("⏳ Ожидание ответа...");
    let lastText = "";
    for (let i = 0; i < 30; i++) {
      const res = await fetch(`${API}/getUpdates`);
      const data = await res.json();
      if (data.ok) {
        const updates = data.result.filter(u =>
          u.message &&
          u.message.reply_to_message &&
          u.message.reply_to_message.message_id === afterMessageId &&
          u.message.from.id.toString() === CHAT_ID
        );
        if (updates.length) {
          lastText = updates[updates.length - 1].message.text;
          break;
        }
      }
      await new Promise(r => setTimeout(r, 2000));
    }
    msgBox.innerText = lastText || "⚠ Ответ не получен.";
  }

  // 💬 Всплывающее окно ответа
  function createPopup(text) {
    let box = document.getElementById("ref-popup");
    if (box) box.remove();
    box = document.createElement("div");
    box.id = "ref-popup";
    box.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 12px;
      border: 1px solid #aaa;
      border-radius: 10px;
      box-shadow: 0 0 8px rgba(0,0,0,0.2);
      font-family: sans-serif;
      z-index: 10000;
    `;
    box.innerText = text;
    document.body.appendChild(box);
    return box;
  }

  // ⌨ Включение по Ctrl+Shift+X
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyX") {
      captureAreaAndSend();
    }
  });

  // Загрузка html2canvas
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
  script.onload = () => console.log("📸 html2canvas загружен");
  document.head.appendChild(script);
})();
