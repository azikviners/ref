(() => {
  const TELEGRAM_BOT_TOKEN = "8019441613:AAGvcrVmKwdq4YKgWWQgDxC4zmtM9-HR-CQ";
  const TELEGRAM_CHAT_ID = "6342951618";

  // 🔒 Блокировка F5
  window.addEventListener("keydown", (e) => {
    if (e.key === "F5") {
      e.preventDefault();
      alert("🔒 Обновление страницы заблокировано.");
    }
  });

  // ⏰ Автоотключение через 1 час
  setTimeout(() => {
    alert("⛔️ Сессия завершена. Панель отключена.");
    const panel = document.getElementById("helpx-panel");
    if (panel) panel.remove();
  }, 60 * 60 * 1000); // 1 час

  // 🖱 Создание панели и привязка к мышке
  function createPanel() {
    const panel = document.createElement("div");
    panel.id = "helpx-panel";
    panel.style = `
      position: fixed;
      top: 100px;
      left: 100px;
      width: 300px;
      height: 160px;
      background: #fff;
      border: 2px solid #333;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      z-index: 999999;
      padding: 10px;
      font-family: sans-serif;
      font-size: 14px;
      cursor: move;
    `;
    panel.innerHTML = `
      <div><b>🖱 Helpx — отправка вопроса</b></div>
      <textarea id="question-box" placeholder="Вопрос..." style="width:100%; height:60px; margin-top:6px;"></textarea>
      <button id="send-question" style="margin-top:8px;">📤 Отправить</button>
    `;
    document.body.appendChild(panel);

    // 🧠 Обработка отправки
    document.getElementById("send-question").onclick = async () => {
      const question = document.getElementById("question-box").value.trim();
      if (!question) return alert("❗ Введите вопрос");
      document.getElementById("send-question").innerText = "⏳ Отправка...";
      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: `❓ Вопрос с Helpx:\n\n${question}`,
          }),
        });
        document.getElementById("send-question").innerText = "✅ Отправлено!";
      } catch (err) {
        alert("⚠ Ошибка при отправке");
        document.getElementById("send-question").innerText = "📤 Отправить";
      }
    };

    // 🖱 Перетаскивание мышкой
    let isDragging = false;
    let offsetX, offsetY;

    panel.addEventListener("mousedown", function (e) {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        panel.style.left = e.clientX - offsetX + "px";
        panel.style.top = e.clientY - offsetY + "px";
      }
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
    });
  }

  // ⌨ Ctrl+Alt для вызова панели
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.altKey && !document.getElementById("helpx-panel")) {
      createPanel();
    }
  });
})();
