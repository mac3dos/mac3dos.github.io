// ---------- Chaveiro de iPhone e protetor de cabo em 3D ----------
const KB_COLORS = [
  ["Preto","#1C1B21"],["Branco","#EDEBF0"],["Grafite","#4A4858"],["Prata","#C9C6D2"],["Dourado","#D4A64A"],["Roxo","#8E3BF5"],
  ["Lilás","#B9A3E8"],["Rosa","#F48FB1"],["Vermelho","#D7263D"],["Azul","#1E7BE0"],["Verde","#3EC17B"],["Laranja","#F28C28"]
];
const PIECES = {
  ip: {main:"#8E3BF5", base:"#1C1B21", lblMain:"Cor do chaveiro", lblBase:"Cor da câmera"},
  cb: {main:"#8E3BF5", base:"#EDEBF0", lblMain:"Cor do protetor", lblBase:"Cor do cabo"}
};
const kb = {piece:"ip", name:"SUA LOJA"};
let kbUpdate = () => {}, kbSetPiece = () => {};
function renderSwatches(id, key){
  const P = PIECES[kb.piece];
  $(id).innerHTML = KB_COLORS.map(([n,c]) => `<button type="button" class="sw" style="--c:${c}" data-c="${c}" aria-label="${n}" title="${n}" aria-pressed="${P[key]===c}"></button>`).join("");
  $(id).onclick = e => { const b = e.target.closest(".sw"); if(!b) return; PIECES[kb.piece][key] = b.dataset.c; renderSwatches(id, key); kbUpdate(); };
}
function choosePiece(p){
  kb.piece = p;
  document.querySelectorAll("#kbPiece button").forEach(b => b.setAttribute("aria-pressed", b.dataset.p === p));
  $("lblMain").textContent = PIECES[p].lblMain; $("lblBase").textContent = PIECES[p].lblBase;
  renderSwatches("swMain","main"); renderSwatches("swBase","base");
  kbSetPiece(p); kbUpdate();
}
function kbFallback(){ $("kb3d").hidden = true; $("kbHint").hidden = true; $("kbFallback").hidden = false; }
let rx = .12;
function initKB(){
  $("kbPiece").addEventListener("click", e => { const b = e.target.closest("button"); if (b) choosePiece(b.dataset.p); });
  $("kbName").addEventListener("input", e => { kb.name = e.target.value.toUpperCase(); kbUpdate(); });
  if (!window.THREE) return kbFallback();
  const canvas = $("kb3d"); let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true}); } catch(_) { return kbFallback(); }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.3, 7); camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x2a1645, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xb88bff, 1.0); rim.position.set(-4, 1.5, -3); scene.add(rim);
  const fill = new THREE.DirectionalLight(0x8e3bf5, 0.45); fill.position.set(0, -3, 2); scene.add(fill);

  const lc = document.createElement("canvas"); lc.width = 8; lc.height = 512;
  const lx = lc.getContext("2d"); lx.fillStyle = "#fff"; lx.fillRect(0,0,8,512); lx.fillStyle = "#9a9a9a";
  for (let y = 0; y < 512; y += 8) lx.fillRect(0, y, 8, 3);
  const layers = new THREE.CanvasTexture(lc); layers.wrapS = layers.wrapT = THREE.RepeatWrapping;
  const lin = c => new THREE.Color(c).convertSRGBToLinear();
  const mat = c => new THREE.MeshStandardMaterial({color:lin(c), roughness:.5, metalness:.05, bumpMap:layers, bumpScale:.005});
  const mMain = mat("#8E3BF5"), mBase = mat("#1C1B21");
  const glass = new THREE.MeshStandardMaterial({color:0x0d0b12, roughness:.15, metalness:.3});
  const lens = new THREE.MeshStandardMaterial({color:0x07060a, roughness:.05, metalness:.6});
  const gold = new THREE.MeshStandardMaterial({color:0xd4a64a, metalness:.9, roughness:.28});
  const g = new THREE.Group(); scene.add(g);
  const ipG = new THREE.Group(); g.add(ipG);
  const cbG = new THREE.Group(); cbG.visible = false; g.add(cbG);
  const lum = hex => { const c = new THREE.Color(hex); return .2126*c.r + .7152*c.g + .0722*c.b; };
  function fitFont(ctx, txt, size, max){ ctx.font = `700 ${size}px Oxanium, Rajdhani, "Arial Narrow", sans-serif`; while (ctx.measureText(txt).width > max && size > 40) { size -= 4; ctx.font = `700 ${size}px Oxanium, Rajdhani, "Arial Narrow", sans-serif`; } }
  function twoLines(t){ const w = ((t || "").trim() || " ").split(/\s+/); if (w.length < 2) return [w.join(" ")]; let best = 1, bl = Infinity; for (let i = 1; i < w.length; i++) { const m = Math.max(w.slice(0,i).join(" ").length, w.slice(i).join(" ").length); if (m < bl) { bl = m; best = i; } } return [w.slice(0,best).join(" "), w.slice(best).join(" ")]; }
  const rrect = (w, h, r) => { const s = new THREE.Shape(); s.moveTo(-w/2 + r, -h/2); s.lineTo(w/2 - r, -h/2); s.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r); s.lineTo(w/2, h/2 - r); s.quadraticCurveTo(w/2, h/2, w/2 - r, h/2); s.lineTo(-w/2 + r, h/2); s.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r); s.lineTo(-w/2, -h/2 + r); s.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2); return s; };

  // ---------- chaveiro de iPhone: corpo com furo da argola, tela na frente, câmera e nome atrás ----------
  const PW = 1.2, PH = 2.3, PT = .16;
  const body = rrect(PW, PH, .2);
  const hole = new THREE.Path(); hole.absarc(PW/2 - .2, PH/2 - .2, .07, 0, Math.PI * 2, true); body.holes.push(hole);
  const phone = new THREE.Mesh(new THREE.ExtrudeGeometry(body, {depth:PT, bevelEnabled:true, bevelThickness:.04, bevelSize:.04, bevelSegments:4, curveSegments:24}), mMain);
  phone.position.z = -PT/2; ipG.add(phone);
  const screen = new THREE.Mesh(new THREE.ShapeGeometry(rrect(PW - .14, PH - .14, .15), 16), glass); screen.position.z = PT/2 + .045; ipG.add(screen);
  const island = new THREE.Mesh(new THREE.ShapeGeometry(rrect(.32, .09, .045), 12), new THREE.MeshBasicMaterial({color:0x000000})); island.position.set(0, PH/2 - .2, PT/2 + .05); ipG.add(island);
  // câmera atrás
  const camB = new THREE.Mesh(new THREE.ExtrudeGeometry(rrect(.5, .5, .12), {depth:.05, bevelEnabled:true, bevelThickness:.02, bevelSize:.02, bevelSegments:3}), mBase);
  camB.position.set(-PW/2 + .36, PH/2 - .36, -PT/2 - .1); ipG.add(camB);
  [[-.1, .1], [-.1, -.1], [.1, 0]].forEach(([x, y]) => {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(.075, .075, .05, 24), lens); l.rotation.x = Math.PI / 2;
    l.position.set(-PW/2 + .36 + x, PH/2 - .36 + y, -PT/2 - .14); ipG.add(l);
  });
  // argola
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.17, .025, 12, 40), gold); ring.position.set(PW/2 - .2, PH/2 + .02, 0); ring.rotation.y = Math.PI / 2; ipG.add(ring);
  // nome da loja no verso
  const nc = document.createElement("canvas"); nc.width = 1024; nc.height = 1024;
  const nx = nc.getContext("2d"); const ntex = new THREE.CanvasTexture(nc); ntex.encoding = THREE.sRGBEncoding; ntex.anisotropy = 4;
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.05), new THREE.MeshStandardMaterial({map:ntex, transparent:true, roughness:.5, polygonOffset:true, polygonOffsetFactor:-2}));
  plate.rotation.y = Math.PI; plate.position.set(0, -.2, -PT/2 - .041); ipG.add(plate);
  function drawBack(){
    const P = PIECES.ip;
    nx.clearRect(0,0,1024,1024);
    const c = new THREE.Color(P.main), hsl = {}; c.getHSL(hsl);
    const deep = lum(P.main) > .55 ? "#1C1B21" : "#FFFFFF";
    nx.textAlign = "center"; nx.textBaseline = "middle";
    // logo da MAC3DOS? não: espaço para a logo da loja, aqui um círculo com a inicial
    const ini = ((kb.name || "").trim()[0] || "S").toUpperCase();
    nx.lineWidth = 18; nx.strokeStyle = deep; nx.globalAlpha = .9; nx.beginPath(); nx.arc(512, 380, 150, 0, 7); nx.stroke();
    nx.fillStyle = deep; nx.font = `700 190px Oxanium, sans-serif`; nx.fillText(ini, 512, 392);
    nx.globalAlpha = 1;
    const L = twoLines(kb.name);
    if (L.length === 1) { fitFont(nx, L[0], 150, 900); nx.fillText(L[0], 512, 700); }
    else { fitFont(nx, L[0], 130, 900); nx.fillText(L[0], 512, 660); fitFont(nx, L[1], 130, 900); nx.fillText(L[1], 512, 800); }
    ntex.needsUpdate = true;
  }
  ipG.scale.setScalar(.95);

  // ---------- protetor de cabo: cabo, conector e capa espiral com o nome ----------
  const mCable = mat("#EDEBF0");
  const path = new THREE.CatmullRomCurve3([new THREE.Vector3(0, -.3, 0), new THREE.Vector3(0, -1.0, 0), new THREE.Vector3(.2, -1.5, .1), new THREE.Vector3(.8, -1.7, .2), new THREE.Vector3(1.5, -1.6, .1)]);
  const cable = new THREE.Mesh(new THREE.TubeGeometry(path, 60, .09, 16, false), mCable); cbG.add(cable);
  const plug = new THREE.Mesh(new THREE.BoxGeometry(.42, .8, .26), mCable); plug.position.y = .95; cbG.add(plug);
  const tip = new THREE.Mesh(new THREE.BoxGeometry(.26, .32, .09), new THREE.MeshStandardMaterial({color:0xc9c6d2, metalness:.85, roughness:.25})); tip.position.y = 1.5; cbG.add(tip);
  // capa do protetor: cilindro com o nome em volta
  const sc = document.createElement("canvas"); sc.width = 1024; sc.height = 256;
  const sx = sc.getContext("2d"); const stex = new THREE.CanvasTexture(sc); stex.encoding = THREE.sRGBEncoding; stex.anisotropy = 4;
  const mSleeve = new THREE.MeshStandardMaterial({map:stex, roughness:.5, bumpMap:layers, bumpScale:.004});
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(.24, .2, 1.1, 48, 1, true), mSleeve); sleeve.position.y = .05; cbG.add(sleeve);
  const capTop = new THREE.Mesh(new THREE.TorusGeometry(.22, .05, 12, 40), mMain); capTop.rotation.x = Math.PI / 2; capTop.position.y = .6; cbG.add(capTop);
  const capBot = new THREE.Mesh(new THREE.TorusGeometry(.19, .05, 12, 40), mMain); capBot.rotation.x = Math.PI / 2; capBot.position.y = -.5; cbG.add(capBot);
  // espiral que segura o cabo
  const spiral = []; for (let i = 0; i <= 120; i++) { const t = i / 120, a = t * Math.PI * 2 * 5; spiral.push(new THREE.Vector3(Math.cos(a) * .15, -.55 - t * .7, Math.sin(a) * .15)); }
  const spring = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spiral), 300, .035, 8, false), mMain); cbG.add(spring);
  function drawSleeve(){
    const P = PIECES.cb;
    sx.fillStyle = P.main; sx.fillRect(0, 0, 1024, 256);
    sx.globalAlpha = .08; sx.fillStyle = "#000"; for (let y = 0; y < 256; y += 8) sx.fillRect(0, y, 1024, 3); sx.globalAlpha = 1;
    sx.textAlign = "center"; sx.textBaseline = "middle"; sx.fillStyle = lum(P.main) > .55 ? "#1C1B21" : "#FFFFFF";
    const t = (kb.name || "").trim() || " ";
    fitFont(sx, t, 120, 440); sx.fillText(t, 256, 132); sx.fillText(t, 768, 132);
    stex.needsUpdate = true;
  }
  cbG.position.set(-.3, .1, 0); cbG.scale.setScalar(1.05);

  kbSetPiece = p => { ipG.visible = p === "ip"; cbG.visible = p === "cb"; $("kbHint").textContent = p === "ip" ? "Arraste para ver o nome atrás" : "Arraste para girar"; };
  kbUpdate = () => {
    const P = PIECES[kb.piece];
    mMain.color.copy(lin(P.main)); mBase.color.copy(lin(P.base));
    if (kb.piece === "ip") drawBack(); else { mCable.color.copy(lin(P.base)); drawSleeve(); }
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => kbUpdate());

  let ry = 2.6, drag = null, idleAt = 0;
  canvas.addEventListener("pointerdown", e => { drag = {x:e.clientX, y:e.clientY}; try { canvas.setPointerCapture(e.pointerId); } catch(_) {} });
  canvas.addEventListener("pointermove", e => {
    if (!drag) return;
    ry += (e.clientX - drag.x) * .012; rx = Math.max(-.5, Math.min(.6, rx + (e.clientY - drag.y) * .006));
    drag = {x:e.clientX, y:e.clientY}; idleAt = performance.now();
  });
  const end = () => { drag = null; idleAt = performance.now(); };
  canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
  function resize(){ const r = $("stage").getBoundingClientRect(); if (!r.width) return; renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); }
  resize(); if ("ResizeObserver" in window) new ResizeObserver(resize).observe($("stage")); else addEventListener("resize", resize);
  let visible = true;
  if ("IntersectionObserver" in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe($("stage"));
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  (function loop(t){
    requestAnimationFrame(loop);
    if (!visible) return;
    if (!drag && t - idleAt > 1800 && !still) ry += .006;
    g.rotation.set(rx, ry, 0);
    renderer.render(scene, camera);
  })(0);
}
initKB();
choosePiece("ip");
