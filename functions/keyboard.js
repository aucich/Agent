function render(sid, buffer) {
  const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const rows = [keys.slice(0, 10), keys.slice(10, 19), keys.slice(19, 26)];

  const keyLink = (label, c) =>
    `<a style="display:inline-block;padding:8px 10px;margin:4px;border:1px solid #999;border-radius:8px;text-decoration:none"
        href="/k?sid=${encodeURIComponent(sid)}&c=${encodeURIComponent(c)}">${label}</a>`;

  let html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Keyboard</title></head><body>`;
  html += `<h2>Room</h2><p><b>${sid}</b></p>`;
  html += `<h2>Buffer (condiviso)</h2><pre style="white-space:pre-wrap;border:1px solid #ddd;padding:10px;border-radius:8px;min-height:70px">${buffer || ""}</pre>`;
  html += `<h2>Tastiera</h2>`;

  for (const r of rows) html += `<div>${r.map(ch => keyLink(ch, ch)).join("")}</div>`;

  html += `<div style="margin-top:10px">`;
  html += keyLink("␠ SPACE", "SPACE");
  html += keyLink("⌫ BKSP", "BKSP");
  html += keyLink("↵ ENTER", "ENTER");
  html += keyLink("🧹 CLEAR", "CLEAR");
  html += `</div>`;

  html += `<p style="margin-top:16px">
    <a href="/keyboard?sid=${encodeURIComponent(sid)}">Ricarica</a> |
    <a href="/">Home</a>
  </p>`;
  html += `</body></html>`;
  return html;
}

function newSid() {
  // SID corto e leggibile
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  let sid = url.searchParams.get("sid");

  if (!sid) {
    sid = newSid();
    // crea room vuota
    await context.env.ROOMS.put(`room:${sid}`, "");
    // redirect a room specifica
    url.pathname = "/keyboard";
    url.search = `?sid=${encodeURIComponent(sid)}`;
    return Response.redirect(url.toString(), 302);
  }

  const buffer = (await context.env.ROOMS.get(`room:${sid}`)) || "";
  return new Response(render(sid, buffer), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
