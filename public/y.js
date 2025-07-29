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
    const panel = document.getElementById("ref-panel");
    if (panel) panel.remove();
  }, 60 * 60 * 1000); // 1 час

  // 🖱 Создание панели и привязка к мышке
  function createPanel() {
    const panel = document.createElement("div");
    panel.id = "ref-panel";
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
      <div><b>🖱 Ref — отправка вопроса</b></div>
      <textarea id="question-box" placeholder="Вопрос..." style="width:100%; height:60px; margin-top:6px;"></textarea>
      <button id="send-question" style="margin-top:8px;">📤 Отправить</button>
    `;
    document.body.appendChild(panel);

    // 🧠 Обработка отправки
    document.getElementById("send-question").onclick = async () => {
      const question = document.getElementById("question-box").value.trim();
      if (!question) return alert("❗ Введите вопрос");
      const btn = document.getElementById("send-question");
      btn.innerText = "⏳ Отправка...";
      btn.disabled = true;
      try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: `❓ Вопрос с Ref:\n\n${question}`,
          }),
        });
        if (!res.ok) throw new Error("Telegram API Error");
        btn.innerText = "✅ Отправлено!";
      } catch (err) {
        alert("⚠ Ошибка при отправке");
        btn.innerText = "📤 Отправить";
      }
      btn.disabled = false;
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
    if (e.ctrlKey && e.altKey && !document.getElementById("ref-panel")) {
      createPanel();
    }
  });
})();
