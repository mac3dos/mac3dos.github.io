// Uma vez só: põe as fotos e vídeos do protetor de cabo no gerador do catálogo de celulares
// e troca o protetor 3D pelo modelo real (coração com nome + organizador em zigue-zague + etiqueta).
const fs = require('fs'), path = require('path');
const gen = path.join(__dirname, 'criar-celulares.js'), sim = path.join(__dirname, 'celular3d.js');
let s = fs.readFileSync(gen, 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('gerador: não achei ' + a.slice(0, 70)); s = s.replace(a, b); };
const show = (src, label, tag, name) => `        <figure class="show">
          <div class="show-media"><video preload="none" data-src="${src}.mp4" poster="${src}.jpg" autoplay muted loop playsinline aria-label="${label}"></video></div>
          <figcaption><span>${tag}</span><strong>${name}</strong></figcaption>
        </figure>
`;
{
  const k = s.indexOf('data-src="media/estetica/video-13.mp4"');
  const fig = s.lastIndexOf('        <figure class="show">', k);
  if (k < 0 || fig < 0) throw new Error('gerador: vídeo do porta-celular não encontrado');
  s = s.slice(0, fig) + show('media/celulares/video-07', 'Protetor de cabo marrom com coração escrito Raquel sendo colocado no cabo do carregador', 'Com o nome do cliente', 'Protetor de cabo')
    + show('media/celulares/video-08', 'Protetor de cabo pink em forma de coração escrito Gabi sendo encaixado no cabo', 'Coração e zigue-zague', 'Protetor pink') + s.slice(fig);
}
r(`        <article class="use"><svg viewBox="0 0 240 200" aria-hidden="true">\${CABLE(30, 10, 1.05, '#8E3BF5', 'SUA LOJA')}\${CABLE(120, 18, 1, '#F48FB1', 'LOJA')}</svg><span class="use-tag">Protetor de cabo</span><h3>Protetor de cabo personalizado</h3><p>Protege a ponta do cabo do carregador, que é onde ele quebra, e leva o nome ou a marca da sua loja.</p></article>`,
  `        <article class="use"><img class="use-ph" src="media/celulares/foto-01.jpg" alt="Protetores de cabo em coração com organizador em zigue-zague, em cinco cores, com nomes e embalados em cartela da loja" loading="lazy"><span class="use-tag">Protetor de cabo</span><h3>Protetor de cabo personalizado</h3><p>Coração com o nome que protege a ponta do cabo e organizador em zigue-zague que segura o fio. Vai numa cartela com a logo da sua loja.</p></article>`);
fs.writeFileSync(gen, s);

let m = fs.readFileSync(sim, 'utf8');
const a = m.indexOf('  // ---------- protetor de cabo:'), b = m.indexOf('  kbSetPiece = p =>', a);
if (a < 0 || b < 0) throw new Error('3D: bloco do protetor não encontrado');
const NOVO = `  // ---------- protetor de cabo: coração com o nome na ponta do cabo, organizador em zigue-zague e etiqueta ----------
  const mCable = mat("#EDEBF0");
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 3.4, 16), mCable); cable.position.y = -.35; cbG.add(cable);
  const plug = new THREE.Mesh(new THREE.BoxGeometry(.3, .55, .2), mCable); plug.position.y = 1.55; cbG.add(plug);
  const tip = new THREE.Mesh(new THREE.BoxGeometry(.2, .26, .07), new THREE.MeshStandardMaterial({color:0xc9c6d2, metalness:.85, roughness:.25})); tip.position.y = 1.95; cbG.add(tip);
  // coração
  const hs = new THREE.Shape(); hs.moveTo(0, -.55); hs.bezierCurveTo(-.15, -.4, -.62, -.12, -.6, .2); hs.bezierCurveTo(-.58, .5, -.18, .58, 0, .32); hs.bezierCurveTo(.18, .58, .58, .5, .6, .2); hs.bezierCurveTo(.62, -.12, .15, -.4, 0, -.55);
  const heart = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, {depth:.14, bevelEnabled:true, bevelThickness:.05, bevelSize:.04, bevelSegments:4, curveSegments:32}), mMain);
  heart.position.set(0, .95, -.07); cbG.add(heart);
  const hc = document.createElement("canvas"); hc.width = 1024; hc.height = 512;
  const hx = hc.getContext("2d"); const htex = new THREE.CanvasTexture(hc); htex.encoding = THREE.sRGBEncoding; htex.anisotropy = 4;
  const hLabel = new THREE.Mesh(new THREE.PlaneGeometry(1.0, .5), new THREE.MeshStandardMaterial({map:htex, transparent:true, roughness:.5, polygonOffset:true, polygonOffsetFactor:-2}));
  hLabel.position.set(0, 1.0, .125); hLabel.rotation.z = .35; cbG.add(hLabel);
  // organizador em zigue-zague, achatado, em volta do cabo
  const zz = []; for (let i = 0; i <= 8; i++) { const y = .3 - i * .17; zz.push(new THREE.Vector3(i % 2 ? .3 : -.3, y, 0)); }
  const zpath = new THREE.CurvePath(); for (let i = 0; i < zz.length - 1; i++) { const p0 = zz[i], p1 = zz[i + 1]; zpath.add(new THREE.CubicBezierCurve3(p0, new THREE.Vector3(p0.x, p0.y - .09, 0), new THREE.Vector3(p1.x, p1.y + .09, 0), p1)); }
  const zig = new THREE.Mesh(new THREE.TubeGeometry(zpath, 240, .055, 10, false), mMain); zig.scale.z = 1.6; cbG.add(zig);
  // etiqueta com o nome embaixo
  const tc2 = document.createElement("canvas"); tc2.width = 512; tc2.height = 256;
  const tx2 = tc2.getContext("2d"); const ttex2 = new THREE.CanvasTexture(tc2); ttex2.encoding = THREE.sRGBEncoding; ttex2.anisotropy = 4;
  const mTag = new THREE.MeshStandardMaterial({map:ttex2, roughness:.5});
  const tag = new THREE.Mesh(new THREE.BoxGeometry(.62, .32, .16), [mMain, mMain, mMain, mMain, mTag, mTag]); tag.position.y = -1.3; cbG.add(tag);
  function drawSleeve(){
    const P = PIECES.cb, ink = lum(P.main) > .55 ? "#1C1B21" : "#FFFFFF";
    const t = (kb.name || "").trim() || " ";
    hx.clearRect(0, 0, 1024, 512); hx.textAlign = "center"; hx.textBaseline = "middle"; hx.fillStyle = ink;
    hx.font = \`italic 700 150px Georgia, "Times New Roman", serif\`; let sz = 150; while (hx.measureText(t).width > 760 && sz > 50) { sz -= 6; hx.font = \`italic 700 \${sz}px Georgia, "Times New Roman", serif\`; }
    hx.fillText(t, 512, 256); htex.needsUpdate = true;
    tx2.fillStyle = P.main; tx2.fillRect(0, 0, 512, 256); tx2.textAlign = "center"; tx2.textBaseline = "middle"; tx2.fillStyle = ink;
    sz = 110; tx2.font = \`italic 700 \${sz}px Georgia, "Times New Roman", serif\`; while (tx2.measureText(t).width > 440 && sz > 30) { sz -= 6; tx2.font = \`italic 700 \${sz}px Georgia, "Times New Roman", serif\`; }
    tx2.fillText(t, 256, 132); ttex2.needsUpdate = true;
  }
  cbG.position.set(0, -.05, 0); cbG.scale.setScalar(.9);

`;
m = m.slice(0, a) + NOVO + m.slice(b);
m = m.replace('cb: {main:"#8E3BF5", base:"#EDEBF0", lblMain:"Cor do protetor", lblBase:"Cor do cabo"}', 'cb: {main:"#E4567B", base:"#EDEBF0", lblMain:"Cor do protetor", lblBase:"Cor do cabo"}');
m = m.replace('["Laranja","#F28C28"]', '["Laranja","#F28C28"],["Pink","#E4567B"]');
fs.writeFileSync(sim, m);
console.log('ok');
