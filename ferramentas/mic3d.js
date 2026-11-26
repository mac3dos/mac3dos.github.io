// ---------- Mini microfone e claquete em 3D ----------
const KB_COLORS = [
  ["Preto","#1C1B21"],["Branco","#EDEBF0"],["Rosa","#F48FB1"],["Rosa chiclete","#E4567B"],["Lilás","#B9A3E8"],["Roxo","#8E3BF5"],
  ["Vermelho","#D7263D"],["Laranja","#F28C28"],["Amarelo","#F2D43D"],["Verde água","#3EC1B4"],["Azul","#1E7BE0"],["Dourado","#D4A64A"]
];
const PIECES = {
  mic:  {main:"#1C1B21", base:"#F48FB1", lblMain:"Cor do microfone", lblBase:"Cor do cubo"},
  clap: {main:"#F48FB1", base:"#E4567B", lblMain:"Cor da claquete", lblBase:"Cor das listras"}
};
const kb = {piece:"mic", name:"@seuperfil"};
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
  $("kbName").addEventListener("input", e => { kb.name = e.target.value; kbUpdate(); });
  if (!window.THREE) return kbFallback();
  const canvas = $("kb3d"); let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true}); } catch(_) { return kbFallback(); }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.4, 7); camera.lookAt(0, 0.1, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x2a1645, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xb88bff, 1.0); rim.position.set(-4, 1.5, -3); scene.add(rim);
  const fill = new THREE.DirectionalLight(0x8e3bf5, 0.45); fill.position.set(0, -3, 2); scene.add(fill);

  // linhas de camada da impressão 3D
  const lc = document.createElement("canvas"); lc.width = 8; lc.height = 512;
  const lx = lc.getContext("2d"); lx.fillStyle = "#fff"; lx.fillRect(0,0,8,512); lx.fillStyle = "#9a9a9a";
  for (let y = 0; y < 512; y += 8) lx.fillRect(0, y, 8, 3);
  const layers = new THREE.CanvasTexture(lc); layers.wrapS = layers.wrapT = THREE.RepeatWrapping;
  // grade do microfone
  const gc = document.createElement("canvas"); gc.width = gc.height = 256;
  const gx = gc.getContext("2d"); gx.fillStyle = "#fff"; gx.fillRect(0,0,256,256); gx.fillStyle = "#5a5a5a";
  for (let y = 4; y < 256; y += 16) for (let x = (y / 16 % 2) * 8 + 4; x < 256; x += 16) { gx.beginPath(); gx.arc(x, y, 4.2, 0, 7); gx.fill(); }
  const grid = new THREE.CanvasTexture(gc); grid.wrapS = grid.wrapT = THREE.RepeatWrapping; grid.repeat.set(10, 5);

  const lin = c => new THREE.Color(c).convertSRGBToLinear();
  const mat = c => new THREE.MeshStandardMaterial({color:lin(c), roughness:.55, metalness:.04, bumpMap:layers, bumpScale:.005});
  const mMain = mat("#1C1B21"), mBase = mat("#F48FB1");
  const mGrid = new THREE.MeshStandardMaterial({color:lin("#1C1B21"), roughness:.6, metalness:.05, bumpMap:grid, bumpScale:.03});
  const g = new THREE.Group(); scene.add(g);
  const micG = new THREE.Group(); g.add(micG);
  const clapG = new THREE.Group(); clapG.visible = false; g.add(clapG);
  const lum = hex => { const c = new THREE.Color(hex); return .2126*c.r + .7152*c.g + .0722*c.b; };
  const ink = (bg) => lum(bg) > .5 ? "#1C1B21" : "#FFFFFF";
  function fitFont(ctx, txt, size, max, min){ ctx.font = `700 ${size}px Oxanium, Rajdhani, "Arial Narrow", sans-serif`; while (ctx.measureText(txt).width > max && size > (min || 30)) { size -= 4; ctx.font = `700 ${size}px Oxanium, Rajdhani, "Arial Narrow", sans-serif`; } }

  // ---------- mini microfone: cabo, grade redonda e cubo com o nome nos 4 lados ----------
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(.16, .12, 1.9, 40), mMain); handle.position.y = -.75; micG.add(handle);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(.12, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mMain); cap.position.y = -1.7; micG.add(cap);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(.21, .17, .2, 40), mMain); collar.position.y = .55; micG.add(collar);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.4, 48, 32), mGrid); head.position.y = 1.0; micG.add(head);
  const band = new THREE.Mesh(new THREE.TorusGeometry(.4, .035, 12, 64), mMain); band.rotation.x = Math.PI / 2; band.position.y = .94; micG.add(band);
  const cc = document.createElement("canvas"); cc.width = 1024; cc.height = 820;
  const cx = cc.getContext("2d"); const ctex = new THREE.CanvasTexture(cc); ctex.encoding = THREE.sRGBEncoding; ctex.anisotropy = 4;
  const mCubeSide = new THREE.MeshStandardMaterial({map:ctex, roughness:.55, metalness:.04});
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1.0, .8, 1.0), [mCubeSide, mCubeSide, mBase, mBase, mCubeSide, mCubeSide]);
  cube.position.y = .05; micG.add(cube);
  function drawCube(){
    const P = PIECES.mic;
    cx.fillStyle = P.base; cx.fillRect(0, 0, 1024, 820);
    cx.globalAlpha = .07; cx.fillStyle = "#000"; for (let y = 0; y < 820; y += 10) cx.fillRect(0, y, 1024, 3); cx.globalAlpha = 1;
    const t = (kb.name || "").trim() || " ";
    cx.textAlign = "center"; cx.textBaseline = "middle";
    fitFont(cx, t, 330, 940, 70);
    const c = new THREE.Color(P.base), hsl = {}; c.getHSL(hsl);
    cx.fillStyle = new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l * .6).getStyle(); cx.fillText(t, 518, 418);
    cx.fillStyle = ink(P.base);
    cx.fillText(t, 512, 410);
    ctex.needsUpdate = true;
  }
  micG.position.y = .1; micG.scale.setScalar(.95);

  // ---------- claquete: prancha com o nome e barras listradas que batem ----------
  const BW = 2.3, BH = 1.5, BT = .1;
  const bc = document.createElement("canvas"); bc.width = 1024; bc.height = 668;
  const bx = bc.getContext("2d"); const btex = new THREE.CanvasTexture(bc); btex.encoding = THREE.sRGBEncoding; btex.anisotropy = 4;
  const mBoard = new THREE.MeshStandardMaterial({map:btex, roughness:.6});
  const board = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, BT), [mMain, mMain, mMain, mMain, mBoard, mBoard]);
  board.position.y = -.35; clapG.add(board);
  const sc = document.createElement("canvas"); sc.width = 1024; sc.height = 112;
  const sx = sc.getContext("2d"); const stex = new THREE.CanvasTexture(sc); stex.encoding = THREE.sRGBEncoding;
  const mStripe = new THREE.MeshStandardMaterial({map:stex, roughness:.55});
  const barGeo = new THREE.BoxGeometry(BW, .26, BT);
  const lower = new THREE.Mesh(barGeo, [mMain, mMain, mMain, mMain, mStripe, mStripe]); lower.position.y = -.35 + BH / 2 + .14; clapG.add(lower);
  const hinge = new THREE.Group(); hinge.position.set(-BW / 2, -.35 + BH / 2 + .28, 0); clapG.add(hinge);
  const upper = new THREE.Mesh(barGeo, [mMain, mMain, mMain, mMain, mStripe, mStripe]); upper.position.set(BW / 2, .13, 0); hinge.add(upper);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, BT + .06, 20), new THREE.MeshStandardMaterial({color:0xb9b6c2, metalness:.8, roughness:.3}));
  pin.rotation.x = Math.PI / 2; pin.position.set(-BW / 2 + .08, -.35 + BH / 2 + .28, 0); clapG.add(pin);
  function drawStripes(){
    const P = PIECES.clap;
    sx.fillStyle = P.main; sx.fillRect(0, 0, 1024, 112);
    sx.fillStyle = P.base;
    for (let x = -120; x < 1100; x += 160) { sx.beginPath(); sx.moveTo(x, 112); sx.lineTo(x + 80, 112); sx.lineTo(x + 150, 0); sx.lineTo(x + 70, 0); sx.closePath(); sx.fill(); }
    stex.needsUpdate = true;
  }
  function drawBoard(){
    const P = PIECES.clap, fg = ink(P.main);
    bx.fillStyle = P.main; bx.fillRect(0, 0, 1024, 668);
    bx.globalAlpha = .06; bx.fillStyle = fg; for (let y = 0; y < 668; y += 10) bx.fillRect(0, y, 1024, 3); bx.globalAlpha = 1;
    bx.textAlign = "center"; bx.textBaseline = "middle"; bx.fillStyle = fg;
    const t = (kb.name || "").trim() || " ";
    fitFont(bx, t, 170, 900, 50); bx.fillText(t, 512, 150);
    bx.strokeStyle = fg; bx.globalAlpha = .55; bx.lineWidth = 6;
    bx.beginPath(); bx.moveTo(40, 290); bx.lineTo(984, 290); bx.moveTo(40, 470); bx.lineTo(984, 470); bx.moveTo(355, 290); bx.lineTo(355, 470); bx.moveTo(670, 290); bx.lineTo(670, 470); bx.stroke();
    bx.globalAlpha = .8; bx.font = `600 44px "IBM Plex Mono", monospace`;
    [["CENA",197],["TAKE",512],["ROLO",827]].forEach(([w, x]) => bx.fillText(w, x, 330));
    bx.globalAlpha = 1; bx.font = `700 96px Oxanium, sans-serif`;
    [["01",197],["03",512],["A",827]].forEach(([w, x]) => bx.fillText(w, x, 412));
    bx.globalAlpha = .8; bx.font = `600 40px "IBM Plex Mono", monospace`; bx.fillText("DIREÇÃO · CÂMERA · DATA", 512, 560);
    bx.globalAlpha = 1;
    btex.needsUpdate = true;
  }
  clapG.scale.setScalar(.92);

  kbSetPiece = p => { micG.visible = p === "mic"; clapG.visible = p === "clap"; $("kbHint").textContent = p === "mic" ? "Arraste para girar" : "Arraste para girar"; };
  kbUpdate = () => {
    const P = PIECES[kb.piece];
    mMain.color.copy(lin(P.main)); mBase.color.copy(lin(P.base));
    if (kb.piece === "mic") { mGrid.color.copy(lin(P.main)); drawCube(); } else { drawStripes(); drawBoard(); }
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => kbUpdate());

  // girar com o dedo ou mouse; gira sozinho quando ninguém mexe
  let ry = .5, drag = null, idleAt = 0;
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
    // claquete abre devagar e fecha rápido, a cada 3 segundos
    const ph = (t % 3000) / 3000;
    hinge.rotation.z = still ? .3 : (ph < .7 ? .42 * Math.sin(ph / .7 * Math.PI / 2) : .42 * (1 - (ph - .7) / .08)) ;
    if (hinge.rotation.z < 0) hinge.rotation.z = 0;
    g.rotation.set(rx, ry, 0);
    renderer.render(scene, camera);
  })(0);
}
initKB();
choosePiece("mic");
