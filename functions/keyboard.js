function b64uEncode(str) {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function render(buffer) {
  const t = encodeURIComponent(b64uEncode(buffer));
  const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const rows = [keys.slice(0, 10), keys.slice(10, 19), keys.slice(19, 26)];

  const keyLink = (label, c) =>
    `<a style="display:inline-block;padding:8px 10px;margin:4px;border:1px solid #999;border-radius:8px;text-decoration:none" href="/k?t=${t}&c=${encodeURIComponent(c)}">${label}</a>`;

  let html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Keyboard</title></head><body>`;
  html += `<h2>Buffer</h2><pre style="white-space:pre-wrap;border:1px solid #ddd;padding:10px;border-radius:8px;min-height:70px">${buffer || ""}</pre>`;
  html += `<h2>Tastiera</h2>`;

  for (const r of rows) {
    html += `<div>${r.map(ch => keyLink(ch, ch)).join("")}</div>`;
  }

  html += `<div style="margin-top:10px">`;
  html += keyLink("␠ SPACE", "SPACE");
  html += keyLink("⌫ BKSP", "BKSP");
  html += keyLink("↵ ENTER", "ENTER");
  html += keyLink("🧹 CLEAR", "CLEAR");
  html += `</div>`;

  html += `<p style="margin-top:16px"><a href="/">Home</a></p>`;
  html += `</body></html>`;
  return html;
}

export async function onRequestGet() {
  return new Response(render(""), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
