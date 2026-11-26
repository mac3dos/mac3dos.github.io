// Monta as páginas do link da bio a partir dos modelos em ferramentas/:
//   ferramentas/whatsapp-base.html -> mac3dos-whatsapp.html        (página de verdade)
//   ferramentas/previa-base.html   -> mac3dos-whatsapp-previa.html (prévia das 3 opções)
// Cola nelas as cenas em pixel art da página inicial (com a cena extra "inicio") e a trilha do personagem.
// Uso: node ferramentas/criar-previa.js .   (edite os modelos, nunca os .html gerados)
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || '.';
const inicio = fs.readFileSync(path.join(dir, 'mac3dos-inicio.html'), 'utf8');
const a = inicio.indexOf('function pixelScene(cv, kind){');
const b = inicio.indexOf('</script>', a);
if (a < 0 || b < 0) throw new Error('pixelScene não encontrada em mac3dos-inicio.html');
let code = inicio.slice(a, b).trim();

const troca = (de, para) => { if (!code.includes(de)) throw new Error('trecho não encontrado: ' + de.slice(0, 60)); code = code.replace(de, para); };

troca('celulares:["#eaffd6","#a8f07f","#4fc46b","#1f7a55"]}[kind]',
      'celulares:["#eaffd6","#a8f07f","#4fc46b","#1f7a55"], inicio:["#fff6d6","#f3d88f","#e8c26a","#8e3bf5"]}[kind]');
troca('celulares:43}[kind]', 'celulares:43, inicio:53}[kind]');
troca('  let U = 110;', `  function inicio(t, hz, fy){
    const bob = Math.round(Math.sin(t * 2.4) * 2);
    const lw = Math.max(10, Math.round(U * .26)), lh = Math.round(lw * 84 / 56);
    shadow(Math.round(W / 2), fy + 1, Math.round(lw * .7), 3 - (bob > 0 ? 1 : 0));
    logo(Math.round(W / 2), fy - lh - 4 + bob, lw, C.out);
    // brilhos girando em volta da logo
    for (let i = 0; i < 5; i++) {
      const ang = t * 1.6 + i * 1.256, sx = Math.round(W / 2 + Math.cos(ang) * lw * 1.5), sy = Math.round(fy - lh / 2 - 4 + Math.sin(ang) * lh * .45 + bob);
      if (Math.sin(t * 4 + i) < -.3) continue;
      const c = i % 2 ? col("#e8c26a") : col("#ffffff");
      put(sx, sy, c); put(sx - 1, sy, c); put(sx + 1, sy, c); put(sx, sy - 1, c); put(sx, sy + 1, c);
    }
    // blocos de "?" nos cantos, como num jogo de plataforma
    [[.17, 0], [.83, 1.7]].forEach(([fx, ph]) => {
      const s = Math.round(U * .11), x0 = Math.round(W * fx) - s, y0 = fy - s * 2 - 6 + Math.round(Math.sin(t * 2 + ph) * 1.5);
      box(x0, y0, x0 + s * 2, y0 + s * 2, GOLD);
      const Q = [".XX.","X..X","..X.",".X..","....",".X.."];
      Q.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === "X") put(x0 + s - 1 + i, y0 + s - 3 + j, col("#6e4a14")); }));
    });
  }

  let U = 110;`);
troca('({academia, estetica, criadores, celulares})[kind]', '({academia, estetica, criadores, celulares, inicio})[kind]');

const trilha = fs.readFileSync(path.join(dir, 'ferramentas', 'trilha.js'), 'utf8').trim();

[['whatsapp-base.html', 'mac3dos-whatsapp.html'], ['previa-base.html', 'mac3dos-whatsapp-previa.html']].forEach(([src, dst]) => {
  const base = fs.readFileSync(path.join(dir, 'ferramentas', src), 'utf8');
  if (!base.includes('/*PIXEL*/') || !base.includes('/*TRILHA*/')) throw new Error(src + ' sem as marcas /*PIXEL*/ e /*TRILHA*/');
  const out = base.replace('/*PIXEL*/', () => code).replace('/*TRILHA*/', () => trilha);
  fs.writeFileSync(path.join(dir, dst), out);
  console.log('ok', dst, out.length, 'bytes');
});
