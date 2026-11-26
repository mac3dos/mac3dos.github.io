// Monta as páginas do link da bio a partir dos modelos em ferramentas/:
//   ferramentas/whatsapp-base.html -> mac3dos-whatsapp.html        (página de verdade)
//   ferramentas/previa-base.html   -> mac3dos-whatsapp-previa.html (prévia de variações)
// Cola nelas as cenas em pixel art da página inicial (mais as cenas de ferramentas/cenas-extra.js)
// e a trilha do personagem (ferramentas/trilha.js).
// Uso: node ferramentas/criar-previa.js .   (edite os modelos, nunca os .html gerados)
const fs = require('fs'), path = require('path');

// devolve o código de pixelScene com as cenas extras "inicio" e "eventos"
function montarCenas(dir){
  const inicio = fs.readFileSync(path.join(dir, 'mac3dos-inicio.html'), 'utf8');
  const a = inicio.indexOf('function pixelScene(cv, kind){');
  const b = inicio.indexOf('</script>', a);
  if (a < 0 || b < 0) throw new Error('pixelScene não encontrada em mac3dos-inicio.html');
  let code = inicio.slice(a, b).trim();
  const troca = (de, para) => { if (!code.includes(de)) throw new Error('trecho não encontrado: ' + de.slice(0, 60)); code = code.replace(de, para); };

  troca('celulares:["#eaffd6","#a8f07f","#4fc46b","#1f7a55"]}[kind]',
        'celulares:["#eaffd6","#a8f07f","#4fc46b","#1f7a55"], inicio:["#fff6d6","#f3d88f","#e8c26a","#8e3bf5"], eventos:["#e6f0ff","#9fc3ff","#5f7fe0","#33288a"]}[kind]');
  troca('celulares:43}[kind]', 'celulares:43, inicio:53, eventos:61}[kind]');
  const extra = fs.readFileSync(path.join(dir, 'ferramentas', 'cenas-extra.js'), 'utf8').replace(/\s+$/, '');
  troca('  let U = 110;', () => extra + '\n\n  let U = 110;');
  troca('({academia, estetica, criadores, celulares})[kind]', '({academia, estetica, criadores, celulares, inicio, eventos})[kind]');
  return code;
}
module.exports = {montarCenas};

if (require.main === module) {
  const dir = process.argv[2] || '.';
  const code = montarCenas(dir);
  const trilha = fs.readFileSync(path.join(dir, 'ferramentas', 'trilha.js'), 'utf8').trim();
  [['whatsapp-base.html', 'mac3dos-whatsapp.html'], ['previa-base.html', 'mac3dos-whatsapp-previa.html']].forEach(([src, dst]) => {
    const base = fs.readFileSync(path.join(dir, 'ferramentas', src), 'utf8');
    if (!base.includes('/*PIXEL*/') || !base.includes('/*TRILHA*/')) throw new Error(src + ' sem as marcas /*PIXEL*/ e /*TRILHA*/');
    const out = base.replace('/*PIXEL*/', () => code).replace('/*TRILHA*/', () => trilha);
    fs.writeFileSync(path.join(dir, dst), out);
    console.log('ok', dst, out.length, 'bytes');
  });
}
