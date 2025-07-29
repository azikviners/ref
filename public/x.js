// x.js
const botToken = '8019441613:AAGvcrVmKwdq4YKgWWQgDxC4zmtM9-HR-CQ';
const chatId = 6342951618;

function createPopup(message = "Ожидаю скриншот...") {
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
      formData.append("chat_id", chatId);
      formData.append("photo", blob, "screenshot.png");

      await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData
      });

      createPopup("✅ Скриншот отправлен!");
    });

    track.stop();
  } catch (e) {
    console.error(e);
    createPopup("❌ Не удалось снять экран.");
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "s") captureAndSendScreenshot();
});

createPopup("Нажмите S для скриншота.");
