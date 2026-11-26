// Gera media/whatsapp/og.png (1200x630): a imagem que aparece quando alguém compartilha
// https://mac3dos.github.io/whatsapp.html no WhatsApp, Instagram ou Facebook.
// Desenha em pixel art (240x126) com a mesma cena "inicio" da página e amplia 5x.
// Uso: node ferramentas/criar-imagem-og.js .
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const {montarCenas} = require('./criar-previa.js');
const dir = process.argv[2] || '.';
const GW = 240, GH = 126, ESC = 5;

// --- roda pixelScene sem navegador: um canvas de mentira que guarda os pixels ---
let code = montarCenas(dir).replace('W = 160; H = h;', `W = ${GW}; H = ${GH};`);
let pixels = null;
const ctx = {
  createImageData: (w, h) => ({data: new Uint8ClampedArray(w * h * 4), width: w, height: h}),
  putImageData: img => { pixels = img; }
};
const cv = {getContext: () => ctx, getBoundingClientRect: () => ({width: GW, height: GH})};
const env = {window: {}, matchMedia: () => ({matches: true}), addEventListener() {}, requestAnimationFrame() {}};
new Function('window', 'matchMedia', 'addEventListener', 'requestAnimationFrame', code + '\npixelScene(arguments[4], "inicio");')
  (env.window, env.matchMedia, env.addEventListener, env.requestAnimationFrame, cv);
if (!pixels || pixels.width !== GW) throw new Error('a cena não foi desenhada no tamanho esperado');
const buf = pixels.data;

const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
function put(x, y, c){ if (x < 0 || y < 0 || x >= GW || y >= GH) return; const i = (y * GW + x) * 4; buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255; }

// --- letras em pixel 5x7 ---
const F = {
  M:["X...X","XX.XX","X.X.X","X...X","X...X","X...X","X...X"], O:[".XXX.","X...X","X...X","X...X","X...X","X...X",".XXX."],
  N:["X...X","XX..X","X.X.X","X..XX","X...X","X...X","X...X"], T:["XXXXX","..X..","..X..","..X..","..X..","..X..","..X.."],
  E:["XXXXX","X....","X....","XXXX.","X....","X....","XXXXX"], S:[".XXXX","X....","X....",".XXX.","....X","....X","XXXX."],
  U:["X...X","X...X","X...X","X...X","X...X","X...X",".XXX."], R:["XXXX.","X...X","X...X","XXXX.","X.X..","X..X.","X...X"],
  Ç:[".XXXX","X....","X....","X....","X....","X....",".XXXX","..X..",".XX.."], A:[".XXX.","X...X","X...X","XXXXX","X...X","X...X","X...X"],
  3:["XXXX.","....X","....X",".XXX.","....X","....X","XXXX."], Q:[".XXX.","X...X","X...X","X...X","X.X.X","X..X.",".XX.X"], " ":[]
};
const OUT = hex('#07040d');
function texto(str, cy, s, cor){
  const w = str.length * 6 * s - s, x0 = Math.round((GW - w) / 2);
  const on = new Set();
  [...str].forEach((ch, n) => (F[ch] || []).forEach((row, j) => [...row].forEach((v, i) => {
    if (v !== 'X') return;
    for (let a = 0; a < s; a++) for (let b = 0; b < s; b++) on.add((x0 + n * 6 * s + i * s + a) + ',' + (cy + j * s + b));
  })));
  // contorno escuro de 1 pixel e sombra embaixo
  on.forEach(k => { const [x, y] = k.split(',').map(Number); for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[0,2],[1,2]]) if (!on.has((x + dx) + ',' + (y + dy))) put(x + dx, y + dy, OUT); });
  on.forEach(k => { const [x, y] = k.split(',').map(Number); put(x, y, cor); });
}
texto('MONTE O SEU', 5, 2, hex('#f2f0f7'));
texto('ORÇAMENTO', 23, 2, hex('#b88bff'));
texto('EM 3 TOQUES', 104, 2, hex('#e8c26a'));

// --- o gatinho da trilha, em dobro, à esquerda no chão ---
const GATO = ["T.......P...P.","T.......PK.KP.",".T.....SSSSSSS",".T.....SEWSEWS","..T....SSSNSSS","..GGGGGSSSSSS.",".GGGGGGGGLLGG.",".GGGGGGGGGLGG.",".GGGGGGGGGGGG.","..D.D....D.D..","..D.D....D.D.."];
const PG = {T:'#8e3bf5', P:'#8e3bf5', K:'#3a1c61', S:'#d6d5dc', E:'#e8c26a', W:'#120b1f', N:'#f07cb0', G:'#8e3bf5', L:'#d6d5dc', D:'#d6d5dc'};
function gato(x0, y0, s){
  const on = (i, j) => j >= 0 && j < GATO.length && i >= 0 && i < GATO[0].length && PG[GATO[j][i]];
  for (let j = -1; j <= GATO.length; j++) for (let i = -1; i <= GATO[0].length; i++) {
    const c = on(i, j) ? hex(PG[GATO[j][i]]) : (on(i+1,j)||on(i-1,j)||on(i,j+1)||on(i,j-1)) ? OUT : null;
    if (c) for (let a = 0; a < s; a++) for (let b = 0; b < s; b++) put(x0 + i * s + a, y0 + j * s + b, c);
  }
}
gato(8, 96, 2);

// --- amplia 5x e grava o PNG ---
const W = GW * ESC, H = GH * ESC, raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0;
  for (let x = 0; x < W; x++) { const i = ((y / ESC | 0) * GW + (x / ESC | 0)) * 4, o = y * (W * 3 + 1) + 1 + x * 3; raw[o] = buf[i]; raw[o + 1] = buf[i + 1]; raw[o + 2] = buf[i + 2]; }
}
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc = b => { let c = -1; for (const v of b) c = CRC[(c ^ v) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (tipo, dados) => { const t = Buffer.from(tipo), len = Buffer.alloc(4), c = Buffer.alloc(4); len.writeUInt32BE(dados.length); c.writeUInt32BE(crc(Buffer.concat([t, dados]))); return Buffer.concat([len, t, dados, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, {level: 9})), chunk('IEND', Buffer.alloc(0))]);
const dst = path.join(dir, 'media', 'whatsapp', 'og.png');
fs.mkdirSync(path.dirname(dst), {recursive: true});
fs.writeFileSync(dst, png);
console.log('ok', path.relative(dir, dst), W + 'x' + H, (png.length / 1024).toFixed(0) + ' KB');
