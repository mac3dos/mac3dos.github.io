// Gera a pasta "docs" (o site publicado no GitHub Pages) a partir das páginas do catálogo.
// Uso: node gerar-site.js https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO
const fs = require('fs'), path = require('path');
const root = __dirname, out = path.join(root, 'docs');
const site = (process.argv[2] || '').replace(/\/$/, '');

const pages = [
  {src: 'mac3dos-inicio.html',    dst: 'index.html',     img: 'media/hub/thumb.jpg', desc: 'Escolha o seu segmento e veja os brindes 3D da MAC3DOS.'},
  {src: 'mac3dos-academias.html', dst: 'esportes.html',  img: 'media/foto-09.jpg',   desc: 'Brindes úteis impressos em 3D para academias, estúdios e esportes.'},
  {src: 'mac3dos-estetica.html',  dst: 'estetica.html',  img: 'media/estetica/thumb.jpg', desc: 'Brindes úteis impressos em 3D para estética e beleza.'},
];
// links do claude.ai viram links entre as páginas do site
const links = {
  'https://claude.ai/artifact/XnEXM3vhxydhPJvgYAtfzZ': 'index.html',
  'https://claude.ai/artifact/4U7TmaHNAs8AMwY5WEkDiG': 'esportes.html',
  'https://claude.ai/artifact/ETYvWHitponzAwtcAbSjir': 'estetica.html',
};

fs.rmSync(out, {recursive: true, force: true});
fs.mkdirSync(out, {recursive: true});
const media = new Set();

for (const p of pages) {
  let s = fs.readFileSync(path.join(root, p.src), 'utf8');
  for (const [from, to] of Object.entries(links)) {
    s = s.split(`href="${from}" target="_blank" rel="noopener"`).join(`href="${to}"`).split(from).join(to);
  }
  // título e metas do topo vão para o <head>
  const head = [];
  s = s.replace(/^\s*(<title>[\s\S]*?<\/title>|<meta[^>]*>|<link[^>]*>)\s*/, m => { head.push(m.trim()); return ''; });
  while (true) { const m = s.match(/^\s*(<meta[^>]*>|<link[^>]*>)\s*/); if (!m) break; head.push(m[1]); s = s.slice(m[0].length); }
  const headHtml = head.filter(h => !/artifact-thumbnail|claude:/.test(h)).join('\n');
  const title = (headHtml.match(/<title>([\s\S]*?)<\/title>/) || [, 'MAC3DOS'])[1];
  const og = site ? `
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:image" content="${site}/${p.img}">
<meta property="og:url" content="${site}/${p.dst === 'index.html' ? '' : p.dst}">
<meta name="twitter:card" content="summary_large_image">` : '';
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${p.desc}">
${headHtml}${og}
<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${s}
</body>
</html>
`;
  fs.writeFileSync(path.join(out, p.dst), html);
  for (const m of s.matchAll(/media\/[A-Za-z0-9_\/.-]+\.(?:jpg|jpeg|png|mp4|webp)/g)) media.add(m[0]);
  media.add(p.img);
}

let bytes = 0;
for (const m of media) {
  const from = path.join(root, m);
  if (!fs.existsSync(from)) { console.warn('faltando:', m); continue; }
  const to = path.join(out, m);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.copyFileSync(from, to);
  bytes += fs.statSync(from).size;
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`site gerado em docs/: ${pages.length} páginas, ${media.size} arquivos de mídia, ${(bytes / 1048576).toFixed(1)} MB`);
