export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const formData = await request.formData();
  const photo = formData.get("photo");

  if (!photo) {
    return new Response("No photo sent", { status: 400 });
  }

  const telegramForm = new FormData();
  telegramForm.append("chat_id", env.CHAT_ID);
  telegramForm.append("photo", photo, "screenshot.png");

  const telegramResp = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: telegramForm,
  });

  if (!telegramResp.ok) {
    return new Response("Failed to send photo to Telegram", { status: 500 });
  }

  return new Response("Photo sent", { status: 200 });
}
