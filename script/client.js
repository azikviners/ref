// client.js

function createPopup(message = "Ожидаю действия...") {
  let popup = document.getElementById("tg-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "tg-popup";
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.padding = "12px 20px";
    popup.style.background = "#222";
    popup.style.color = "#fff";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    popup.style.zIndex = 99999;
    popup.style.fontFamily = "Arial";
    popup.style.maxWidth = "300px";
    document.body.appendChild(popup);
  }
  popup.innerText = message;
}

async function captureAndSendScreenshot() {
  createPopup("📸 Снимаю экран...");
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const bitmap = await imageCapture.grabFrame();

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    canvas.toBlob(async blob => {
      const formData = new FormData();
      formData.append("photo", blob, "screenshot.png");

      const resp = await fetch("/api/send-photo", {
        method: "POST",
        body: formData,
      });

      if (resp.ok) {
        createPopup("✅ Скриншот отправлен!");
      } else {
        createPopup("❌ Ошибка при отправке.");
      }
    });

    track.stop();
  } catch (e) {
    console.error(e);
    createPopup("❌ Не удалось снять экран.");
  }
}

// Отправляем скриншот по клику левой кнопкой мыши
document.addEventListener("click", (e) => {
  if (e.button === 0) { // левая кнопка мыши
    captureAndSendScreenshot();
  }
});

// --- Чат-окно с ботом ---
function createChat() {
  let chat = document.getElementById("tg-chat");
  if (!chat) {
    chat = document.createElement("div");
    chat.id = "tg-chat";
    chat.style.position = "fixed";
    chat.style.bottom = "80px";
    chat.style.right = "20px";
    chat.style.width = "300px";
    chat.style.height = "400px";
    chat.style.background = "#fff";
    chat.style.border = "1px solid #ccc";
    chat.style.borderRadius = "8px";
    chat.style.display = "flex";
    chat.style.flexDirection = "column";
    chat.style.fontFamily = "Arial";
    chat.style.zIndex = 99999;

    const messages = document.createElement("div");
    messages.id = "messages";
    messages.style.flex = "1";
    messages.style.padding = "10px";
    messages.style.overflowY = "auto";
    messages.style.borderBottom = "1px solid #ddd";
    chat.appendChild(messages);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Введите ответ...";
    input.style.border = "none";
    input.style.padding = "10px";
    input.style.fontSize = "16px";
    input.style.outline = "none";
    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        addMessage("Вы: " + input.value.trim());
        await sendMessageToBot(input.value.trim());
        input.value = "";
      }
    });
    chat.appendChild(input);

    document.body.appendChild(chat);
  }
}

function addMessage(text) {
  const messages = document.getElementById("messages");
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.style.marginBottom = "8px";
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessageToBot(text) {
  try {
    const resp = await fetch("/api/send-message", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: text })
    });
    const data = await resp.json();
    addMessage("Бот: " + data.reply);
  } catch (e) {
    addMessage("Ошибка отправки сообщения.");
  }
}

createChat();
createPopup("Кликните ЛКМ, чтобы отправить скриншот.");
