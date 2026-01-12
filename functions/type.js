export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const sid = url.searchParams.get("sid") || "";
  const text = url.searchParams.get("text") || "";

  if (!sid) return new Response("Missing sid", { status: 400 });

  await context.env.ROOMS.put(`room:${sid}`, text);

  url.pathname = "/k";
  url.search = `?sid=${encodeURIComponent(sid)}`;
  return Response.redirect(url.toString(), 302);
}
