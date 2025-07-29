export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { message } = await request.json();

  let reply = "Я вас не понял.";

  if (message.toLowerCase().includes("привет")) {
    reply = "Привет! Какой ваш следующий ответ?";
  } else if (message.toLowerCase().includes("да")) {
    reply = "Отлично! Вопрос следующий: ...";
  } else if (message.toLowerCase().includes("нет")) {
    reply = "Понял. Попробуйте еще раз.";
  } else {
    reply = "Пожалуйста, ответьте 'да' или 'нет'.";
  }

  return new Response(JSON.stringify({ reply }), {
    headers: { "Content-Type": "application/json" },
  });
}
