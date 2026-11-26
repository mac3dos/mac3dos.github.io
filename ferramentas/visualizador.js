// Visualizador: toda foto e vídeo do catálogo abre em tela cheia, com botão
// "Quero este modelo" que manda nome, código e link direto do modelo pelo WhatsApp.
// O bloco fica entre <!-- visualizador:inicio --> e <!-- visualizador:fim --> no fim de cada página
// e é recolocado a cada `node gerar-site.js` (pode rodar de novo sem duplicar).
const fs = require('fs');

const BLOCO = (page, seg) => `<!-- visualizador:inicio -->
<style>
.vz-click{cursor:zoom-in}
.show-media,.rec-ph{position:relative}
.show-media::after,.rec-ph::after{content:"";position:absolute;right:10px;bottom:10px;width:30px;height:30px;border-radius:50%;background:rgba(11,10,14,.72) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round'%3E%3Ccircle cx='10.5' cy='10.5' r='6'/%3E%3Cpath d='M15 15l5 5M10.5 8v5M8 10.5h5'/%3E%3C/svg%3E") center/16px no-repeat;border:1px solid rgba(255,255,255,.2);pointer-events:none;opacity:.85}
@media (max-width:760px){.show-media::after,.rec-ph::after{width:24px;height:24px;right:6px;bottom:6px;background-size:13px}}
.vz{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:16px;background:rgba(6,5,9,.94);backdrop-filter:blur(6px)}
.vz[hidden]{display:none}
.vz-fig{margin:0;display:grid;gap:14px;justify-items:center;max-width:min(92vw,620px);width:100%}
.vz-media{display:grid;place-items:center;width:100%}
.vz-media img,.vz-media video{max-width:100%;max-height:62vh;border-radius:14px;display:block;background:#000;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.vz-cap{display:grid;gap:4px;justify-items:center;text-align:center;color:var(--fg,#EDEBF0)}
.vz-tag{font-family:var(--f-mono,monospace);font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:var(--purple-soft,#B88BFF)}
.vz-name{font-family:var(--f-title,sans-serif);font-size:1.3rem;font-weight:700;line-height:1.15}
.vz-code{font-family:var(--f-mono,monospace);font-size:.72rem;color:var(--muted,#A39DB0)}
.vz-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.vz-wa,.vz-share{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:12px 20px;font-weight:700;font-size:.98rem;text-decoration:none;border:0;cursor:pointer;font-family:inherit}
.vz-wa{background:#25D366;color:#06260f}
.vz-wa:hover,.vz-wa:focus-visible{background:#3be27a;outline:none}
.vz-share{background:transparent;color:var(--fg,#EDEBF0);border:1px solid rgba(255,255,255,.25)}
.vz-wa svg,.vz-share svg{width:20px;height:20px;flex:none}
.vz-x,.vz-nav{position:fixed;z-index:1;border:1px solid rgba(255,255,255,.2);background:rgba(21,19,27,.85);color:#fff;cursor:pointer;font-family:inherit}
.vz-x{top:14px;right:14px;border-radius:999px;padding:8px 14px;font-size:.85rem}
.vz-nav{top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;font-size:1.4rem;line-height:1}
.vz-prev{left:12px}.vz-next{right:12px}
.vz-count{font-family:var(--f-mono,monospace);font-size:.68rem;color:var(--muted,#A39DB0)}
@media (max-width:760px){.vz-nav{top:auto;bottom:14px;transform:none}.vz-media img,.vz-media video{max-height:56vh}.vz{padding:56px 12px 70px}}
</style>
<div class="vz" id="vz" hidden role="dialog" aria-modal="true" aria-label="Modelo ampliado">
  <button type="button" class="vz-x" data-vz="close">Fechar ✕</button>
  <button type="button" class="vz-nav vz-prev" data-vz="prev" aria-label="Anterior">‹</button>
  <button type="button" class="vz-nav vz-next" data-vz="next" aria-label="Próximo">›</button>
  <figure class="vz-fig">
    <div class="vz-media" id="vzMedia"></div>
    <figcaption class="vz-cap"><span class="vz-tag" id="vzTag"></span><strong class="vz-name" id="vzName"></strong><span class="vz-code" id="vzCode"></span></figcaption>
    <div class="vz-actions">
      <a class="vz-wa" id="vzWa" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>Quero este modelo</a>
      <button type="button" class="vz-share" id="vzShare" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v5h14v-5"/></svg>Enviar a imagem</button>
    </div>
    <span class="vz-count" id="vzCount"></span>
  </figure>
</div>
<script>
(function(){
  const PAGE = ${JSON.stringify(page)}, SEG = ${JSON.stringify(seg)}, SITE = "https://mac3dos.github.io/", WA = "5521985101880";
  const box = document.getElementById("vz"); if (!box) return;
  const $v = id => document.getElementById(id);
  const SKIP = ".printer,.lab-stage,.pp,.hero,.vz,#lightbox";
  const pathOf = el => { const raw = el.tagName === "VIDEO" ? (el.dataset.src || el.getAttribute("src") || "") : (el.getAttribute("src") || ""); const i = raw.indexOf("media/"); return i < 0 ? "" : raw.slice(i); };
  const posterOf = el => { if (el.tagName !== "VIDEO") return pathOf(el); const p = el.getAttribute("poster") || ""; const i = p.indexOf("media/"); return i < 0 ? "" : p.slice(i); };
  const codeOf = p => { const rest = p.replace(/^media\\//, "").replace(/\\.[a-z0-9]+$/i, ""); return (rest.includes("/") ? rest : "esportes/" + rest).replace(/\\//g, "-").toUpperCase(); };
  const txt = n => (n && n.textContent || "").replace(/\\s+/g, " ").trim();
  function info(el){
    const fig = el.closest("figure"), slot = el.closest(".slot"), use = el.closest(".use");
    let name = txt(fig && fig.querySelector("figcaption strong")) || (slot ? (slot.getAttribute("aria-label") || "").replace(/^Ampliar:\\s*/, "") : "") || txt(use && use.querySelector("h3"));
    let tag = txt(fig && fig.querySelector("figcaption span")) || txt(use && use.querySelector(".use-tag"));
    const desc = el.getAttribute("alt") || el.getAttribute("aria-label") || "";
    if (!name) { name = desc; }
    return {name, tag, desc};
  }
  let list = [], cur = 0;
  function collect(){
    const seen = new Set();
    list = [...document.querySelectorAll("main img, main video")].filter(el => !el.closest(SKIP) && pathOf(el)).filter(el => { const p = pathOf(el); if (seen.has(p)) return false; seen.add(p); return true; });
    list.forEach(el => { el.classList.add("vz-click"); const s = el.closest(".slot"); if (s) s.classList.add("vz-click"); });
  }
  function message(it){ return "Olá, MAC3DOS! Vi no catálogo de " + SEG + " e quero este modelo:\\n*" + it.name + "*\\nCódigo: " + it.code + "\\n" + SITE + PAGE + "#ref=" + it.code; }
  function open(i){
    cur = (i + list.length) % list.length;
    const el = list[cur], p = pathOf(el), inf = info(el), code = codeOf(p);
    const m = $v("vzMedia"); m.innerHTML = "";
    if (el.tagName === "VIDEO") { const v = document.createElement("video"); v.src = p; v.poster = posterOf(el); v.autoplay = v.muted = v.loop = v.playsInline = true; v.controls = true; v.setAttribute("aria-label", inf.desc); m.appendChild(v); v.play().catch(() => {}); }
    else { const im = document.createElement("img"); im.src = p; im.alt = inf.desc; m.appendChild(im); }
    $v("vzTag").textContent = inf.tag; $v("vzName").textContent = inf.name; $v("vzCode").textContent = "Código " + code;
    $v("vzCount").textContent = (cur + 1) + " de " + list.length;
    const it = {name: inf.name, code, img: posterOf(el)};
    $v("vzWa").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(message(it));
    $v("vzShare").onclick = () => shareImg(it);
    if (box.hidden) { box.hidden = false; document.documentElement.style.overflow = "hidden"; $v("vzWa").focus({preventScroll:true}); }
    try { history.replaceState(null, "", "#ref=" + code); } catch(_) {}
  }
  function close(){ box.hidden = true; $v("vzMedia").innerHTML = ""; document.documentElement.style.overflow = ""; try { history.replaceState(null, "", location.pathname + location.search); } catch(_) {} }
  async function shareImg(it){
    try {
      const r = await fetch(it.img); const b = await r.blob();
      const f = new File([b], it.code.toLowerCase() + ".jpg", {type: b.type || "image/jpeg"});
      if (navigator.canShare && navigator.canShare({files:[f]})) { await navigator.share({files:[f], text: message(it)}); return; }
    } catch(_) { return; }
    window.open($v("vzWa").href, "_blank");
  }
  if (navigator.canShare) { try { if (navigator.canShare({files:[new File([""], "a.jpg", {type:"image/jpeg"})]})) $v("vzShare").hidden = false; } catch(_) {} }
  document.addEventListener("click", e => {
    if (!box.hidden) return;
    let el = e.target.closest("img,video");
    if (!el) { const s = e.target.closest(".slot,.show-media,.rec-ph"); if (s) el = s.querySelector("img.on,video.on") || s.querySelector("img,video"); }
    if (!el || el.closest(SKIP)) return;
    const i = list.indexOf(el); if (i < 0) return;
    e.preventDefault(); e.stopImmediatePropagation(); open(i);
  }, true);
  box.addEventListener("click", e => { const a = e.target.closest("[data-vz]"); if (a) { const k = a.dataset.vz; if (k === "close") close(); else open(cur + (k === "next" ? 1 : -1)); return; } if (e.target === box) close(); });
  document.addEventListener("keydown", e => { if (box.hidden) return; if (e.key === "Escape") close(); if (e.key === "ArrowRight") open(cur + 1); if (e.key === "ArrowLeft") open(cur - 1); });
  let sx = null; box.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, {passive:true});
  box.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 60) open(cur + (dx < 0 ? 1 : -1)); }, {passive:true});
  collect();
  // link recebido pelo WhatsApp abre direto no modelo
  const m = /#ref=([A-Z0-9-]+)/.exec(location.hash);
  if (m) { const i = list.findIndex(el => codeOf(pathOf(el)) === m[1]); if (i >= 0) setTimeout(() => { list[i].scrollIntoView({block:"center"}); open(i); }, 400); }
})();
</script>
<!-- visualizador:fim -->`;

function injetar(file, page, seg){
  let s = fs.readFileSync(file, 'utf8');
  s = s.replace(/\n?<!-- visualizador:inicio -->[\s\S]*?<!-- visualizador:fim -->\n?/, '\n');
  s = s.replace(/\s*$/, '\n') + BLOCO(page, seg) + '\n';
  fs.writeFileSync(file, s);
}
module.exports = { injetar };
