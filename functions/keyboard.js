function newSid() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  let sid = url.searchParams.get("sid");

  if (!sid) {
    sid = newSid();
    await context.env.ROOMS.put(`room:${sid}`, "");
  }

  url.pathname = "/k";
  url.search = `?sid=${encodeURIComponent(sid)}`;
  return Response.redirect(url.toString(), 302);
}
