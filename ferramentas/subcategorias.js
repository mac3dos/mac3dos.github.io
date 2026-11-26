// TESTE: cria mac3dos-estetica-teste.html = catálogo de estética + filtro por subcategoria de profissional.
// Uso: node ferramentas/subcategorias.js .   (depois: node gerar-site.js https://mac3dos.github.io)
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || '.';
let s = fs.readFileSync(path.join(dir, 'mac3dos-estetica.html'), 'utf8')
  .replace(/\n?<!-- visualizador:inicio -->[\s\S]*?<!-- visualizador:fim -->\n?/, '\n');

const CATS = [
  {id:'todos', label:'Todos'},
  {id:'nail', label:'Nail designer', h1:'Sua cliente sai do seu estúdio de unhas com a sua marca.', quem:'nail designer',
   ideia:'Chaveiro de esmalte, chaveiro com a logo do seu estúdio e certificado para as alunas do seu curso. Sob medida: chaveiro de lixa ou de alicate.'},
  {id:'lash', label:'Lash e brow designer', h1:'Sua cliente sai do seu estúdio de cílios com a sua marca.', quem:'lash e brow designer',
   ideia:'Chaveiro de cílios, porta-rímel e certificado para as alunas. Sob medida: porta-escovinha de cílios e chaveiro de pinça.'},
  {id:'harm', label:'Harmonização facial', h1:'Sua paciente sai da sua clínica com a sua marca.', quem:'harmonização facial',
   ideia:'Chaveiro de boca, porta-protetor labial, potinho para amostras de creme e porta-bijus de boca. Sob medida: chaveiro de seringa ou de frasco.'},
  {id:'dent', label:'Dentista', h1:'Seu paciente sai do consultório com a sua marca.', quem:'dentista',
   ideia:'Chaveiro de boca e chaveiros com a logo do consultório. Sob medida: chaveiro de dente, porta fio dental e porta-escova com o nome da clínica.'},
  {id:'salao', label:'Salão de beleza', h1:'Sua cliente sai do seu salão com a sua marca.', quem:'salão de beleza',
   ideia:'Pente com a logo, potinho de creme, porta-bijus e placas para a recepção. Sob medida: chaveiro de secador ou de tesoura.'},
  {id:'make', label:'Maquiadora', h1:'Sua cliente sai da maquiagem com a sua marca.', quem:'maquiadora',
   ideia:'Chaveiro de batom, porta-rímel, porta-protetor labial e limpador de pincéis. Sob medida: chaveiro de pincel ou de paleta.'}
];
// quem vê cada peça ("*" = todas as profissionais)
const TAGS = {
  'estetica/video-07':['lash','make'], 'estetica/video-02':['make','harm'], 'estetica/video-09':['harm','salao'],
  'estetica/video-12':['harm','make','dent'], 'estetica/video-19':['make'], 'estetica/video-05':['make','harm'],
  'estetica/video-06':['*'], 'estetica/video-17':['lash'], 'estetica/video-13':['*'], 'estetica/video-14':['*'],
  'estetica/video-15':['*'], 'estetica/video-20':['harm','salao'], 'estetica/video-04':['*'], 'estetica/video-03':['*'],
  'estetica/video-18':['*'], 'estetica/video-23':['*'], 'estetica/video-24':['salao'], 'estetica/video-26':['nail'],
  'estetica/video-10':['*'], 'estetica/video-16':['make'], 'estetica/video-21':['nail','lash','salao'], 'estetica/video-22':['*'], 'estetica/video-25':['*'],
  'Chaveiro de boca':['harm','make','dent'], 'Chaveiro de esmalte':['nail'], 'Porta-bijus com nome':['*'], 'Porta-batom':['make'],
  'Porta-creme':['harm','salao'], 'Borboleta':['*'], 'Espelhinho e porta-rímel':['make','lash'], 'Tags com logo':['*'], 'Kit beleza':['*'],
  'certificados':['nail','lash']
};

const BLOCO = `
  <!-- subcategorias:inicio -->
  <nav class="sub" id="sub" aria-label="Escolha a sua área">
    <div class="wrap">
      <p class="sub-q">Qual é a sua área?</p>
      <div class="sub-chips" role="group">${CATS.map((c, i) => `<button type="button" data-c="${c.id}" aria-pressed="${i === 0}">${c.label}</button>`).join('')}</div>
    </div>
  </nav>
  <!-- subcategorias:fim -->
`;
const CSS = `
/* subcategorias (teste) */
.sub{position:sticky;top:64px;z-index:15;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);padding:12px 0}
.sub .wrap{display:grid;gap:8px}
.sub-q{margin:0;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:var(--purple-soft)}
.sub-chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;-webkit-overflow-scrolling:touch}
.sub-chips::-webkit-scrollbar{display:none}
.sub-chips button{flex:none;font:inherit;font-size:.88rem;font-weight:600;color:var(--fg);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:8px 14px;cursor:pointer;white-space:nowrap}
.sub-chips button[aria-pressed="true"]{background:var(--purple);border-color:var(--purple);color:#fff}
.sub-ideia{margin:14px auto 0;font-size:.95rem;color:var(--muted);max-width:62ch;text-align:center;border:1px dashed rgba(184,139,255,.4);border-radius:12px;padding:12px 16px;background:rgba(21,19,27,.6)}
.sub-ideia b{color:var(--fg)}
.sub-off{display:none!important}
@media (max-width:600px){.sub{top:56px;padding:10px 0}.sub-chips button{font-size:.82rem;padding:7px 12px}}
`;
const JS = `
<script>
// ---------- subcategorias (teste): filtra as peças pela área da profissional ----------
(function(){
  const CATS = ${JSON.stringify(CATS)}, TAGS = ${JSON.stringify(TAGS)};
  const bar = document.getElementById("sub"); if (!bar) return;
  const h1 = document.querySelector(".hero h1"), h1Orig = h1 ? h1.innerHTML : "";
  const wa = document.querySelector("#contato .btn-primary"), waOrig = wa ? wa.href : "";
  const keyOf = el => { const v = el.querySelector("video"), im = el.querySelector("img"); const raw = v ? (v.dataset.src || v.getAttribute("src") || "") : im ? im.getAttribute("src") || "" : ""; const m = raw.match(/media\\/(.+)\\.[a-z0-9]+$/i); return m ? m[1] : ""; };
  const fits = (tags, c) => c === "todos" || !tags || tags.includes("*") || tags.includes(c);
  function apply(c){
    const cat = CATS.find(x => x.id === c) || CATS[0];
    bar.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.c === c));
    const on = bar.querySelector('[data-c="' + c + '"]'), row = bar.querySelector(".sub-chips"); if (on && row) row.scrollTo({left: on.offsetLeft - row.clientWidth / 2 + on.offsetWidth / 2, behavior: "smooth"});
    document.querySelectorAll("#em-uso .show, #espaco .show").forEach(f => f.classList.toggle("sub-off", !fits(TAGS[keyOf(f)], c)));
    if (window.GALLERY) document.querySelectorAll("#gallery .slot").forEach(sl => { const g = GALLERY[+sl.dataset.i]; sl.classList.toggle("sub-off", !fits(g && TAGS[g.name], c)); });
    const cert = document.getElementById("certificados"); if (cert) cert.classList.toggle("sub-off", !fits(TAGS.certificados, c));
    ["espaco"].forEach(id => { const sec = document.getElementById(id); if (sec) sec.classList.toggle("sub-off", !sec.querySelector(".show:not(.sub-off)")); });
    const ideia = document.getElementById("subIdeia");
    if (cat.ideia) { ideia.hidden = false; ideia.innerHTML = "<b>Para " + cat.quem + ":</b> " + cat.ideia; } else ideia.hidden = true;
    if (h1) h1.innerHTML = cat.h1 ? cat.h1 + " <em>E leva para todo lugar.</em>" : h1Orig;
    if (wa) wa.href = cat.quem ? "https://wa.me/5521985101880?text=" + encodeURIComponent("Olá, MAC3DOS! Vi o catálogo de estética e beleza. Sou " + cat.quem + " e quero conversar sobre brindes.") : waOrig;
    try { history.replaceState(null, "", c === "todos" ? location.pathname : "#area=" + c); } catch(_) {}
  }
  bar.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; apply(b.dataset.c); const em = document.getElementById("em-uso"); if (em && em.getBoundingClientRect().top < 0) em.scrollIntoView({behavior:"smooth"}); });
  const m = /#area=(\\w+)/.exec(location.hash); apply(m ? m[1] : "todos");
})();
</script>`;

const r = (a, b) => { if (!s.includes(a)) throw new Error('não achei: ' + a.slice(0, 60)); s = s.replace(a, b); };
r('<title>MAC3DOS para Estética e Beleza</title>', '<title>MAC3DOS para Estética e Beleza</title>');
r('</style>', CSS + '</style>');
r('  <section id="em-uso" class="band">', BLOCO + '  <section id="em-uso" class="band">');
{ const k = s.indexOf('<section id="em-uso"'), lead = s.indexOf('</p>', s.indexOf('<p class="lead">', k)) + 4; s = s.slice(0, lead) + '\n        <p class="sub-ideia" id="subIdeia" hidden></p>' + s.slice(lead); }
s = s.replace(/\s*$/, '\n') + JS + '\n';
// GALLERY precisa estar acessível: ela é declarada com const no script principal, então expomos em window
s = s.replace('const GALLERY = [', 'const GALLERY = window.GALLERY = [');
fs.writeFileSync(path.join(dir, 'mac3dos-estetica-teste.html'), s);
console.log('ok');
