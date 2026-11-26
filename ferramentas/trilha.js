// trilha(canvas, função que diz a fase atual, 'gato' ou 'boneco')
function trilha(cv, getAlvo, quem){
  // desenha numa área de 160x50 mas mostra só a faixa de 14 a 48 (corta o céu vazio)
  var W = 160, H = 50, TOPO = 14; cv.width = W; cv.height = H - TOPO - 2;
  var ctx = cv.getContext('2d');
  var pos = 0, t0 = 0;
  var NODES = [18, 58, 98, 140];
  var HERO = [
    "..PPPPP..",
    ".PPPPPPP.",
    ".KSSSSSK.",
    ".SSWSWSS.",
    ".SSSSSSS.",
    "..SSSSS..",
    ".GGGGGGG.",
    "SGGGLGGGS",
    "SGGGGGGGS",
    ".GGGGGGG.",
    "..BB.BB..",
    "..BB.BB.."
  ];
  var HERO2 = HERO.slice(0, 10).concat(["..BB..BB.", ".BB....BB"]);
  var PAL = {P:'#8e3bf5', K:'#3a1c61', S:'#f3c9a0', W:'#120b1f', G:'#b88bff', L:'#e8c26a', B:'#2a2635'};
  // gatinho nas cores da logo: orelhas em triângulo roxo, cabeça prateada, corpo roxo, peito prateado
  var GATO = [
    "T.......P...P.",
    "T.......PK.KP.",
    ".T.....SSSSSSS",
    ".T.....SEWSEWS",
    "..T....SSSNSSS",
    "..GGGGGSSSSSS.",
    ".GGGGGGGGLLGG.",
    ".GGGGGGGGGLGG.",
    ".GGGGGGGGGGGG.",
    "..D.D....D.D..",
    "..D.D....D.D.."
  ];
  var GATO2 = GATO.slice(0, 9).concat([".D...D..D...D.", "D.....DD.....D"]);
  var PAL_GATO = {T:'#8e3bf5', P:'#8e3bf5', K:'#3a1c61', S:'#d6d5dc', E:'#e8c26a', W:'#120b1f', N:'#f07cb0', G:'#8e3bf5', L:'#d6d5dc', D:'#d6d5dc'};
  if(quem === 'gato'){ HERO = GATO; HERO2 = GATO2; PAL = PAL_GATO; }
  function px(x, y, c){ ctx.fillStyle = c; ctx.fillRect(x|0, y|0, 1, 1); }
  function sprite(rows, x0, y0){
    var on = function(i, j){ return j >= 0 && j < rows.length && i >= 0 && i < rows[j].length && !!PAL[rows[j][i]]; };
    // contorno de 1 pixel, como nas cenas
    for(var j=-1;j<=rows.length;j++) for(var i=-1;i<=rows[0].length;i++) if(!on(i,j) && (on(i+1,j)||on(i-1,j)||on(i,j+1)||on(i,j-1))) px(x0+i, y0+j, '#07040d');
    rows.forEach(function(r, j){ for(var i=0;i<r.length;i++){ var ch = r[i]; if(PAL[ch]) px(x0+i, y0+j, PAL[ch]); } });
  }
  function draw(ms){
    var t = ms / 1000, alvo = Math.min(3, getAlvo());
    ctx.setTransform(1, 0, 0, 1, 0, -TOPO);
    var dest = NODES[alvo]; var cur = NODES[0] + pos;
    var andando = Math.abs(dest - cur) > .5;
    if(andando) pos += Math.sign(dest - cur) * Math.min(1.2, Math.abs(dest - cur));
    cur = NODES[0] + pos;
    // céu e chão
    var g = ['#0d0818','#170d2b','#251448','#3a1c61'];
    for(var y=0;y<32;y++){ ctx.fillStyle = g[Math.min(3, (y/8)|0)]; ctx.fillRect(0,y,W,1); }
    ctx.fillStyle = '#110a1d'; ctx.fillRect(0,32,W,H-32);
    ctx.fillStyle = '#b88bff'; ctx.fillRect(0,32,W,1);
    for(var s=0;s<14;s++){ var sx = (s*37+11)%W, sy = (s*13+3)%26; if(Math.sin(t*2+s) > -.3) px(sx, sy, s%3 ? '#b88bff' : '#ffffff'); }
    // caminho tracejado
    for(var x=NODES[0]; x<NODES[3]; x+=3){ px(x, 41, x <= cur ? '#8e3bf5' : '#3b1f70'); px(x+1, 41, x <= cur ? '#8e3bf5' : '#3b1f70'); }
    // casas
    NODES.forEach(function(nx, i){
      var feito = i <= alvo;
      if(i < 3){
        ctx.fillStyle = '#07040d'; ctx.fillRect(nx-5, 37, 11, 9);
        ctx.fillStyle = feito ? '#e8c26a' : '#2a2635'; ctx.fillRect(nx-4, 38, 9, 7);
        ctx.fillStyle = feito ? '#fff6d6' : '#3b3646'; ctx.fillRect(nx-4, 38, 9, 1);
        // número da fase
        var D = {0:["X","X","X"],1:["XX",".X","XX","X.","XX"],2:["XX",".X","XX",".X","XX"]}[i];
        if(i === 0){ for(var k=0;k<5;k++) px(nx, 39+k, feito ? '#120b1f' : '#8d86a3'); }
        else D.forEach(function(r, j){ for(var q=0;q<r.length;q++) if(r[q]==='X') px(nx-1+q, 39+j, feito ? '#120b1f' : '#8d86a3'); });
      } else {
        // bandeira verde do WhatsApp
        ctx.fillStyle = '#8d86a3'; ctx.fillRect(nx, 18, 1, 26);
        var wave = Math.round(Math.sin(t*5)*1);
        ctx.fillStyle = '#07040d'; ctx.fillRect(nx+1, 17+wave, 15, 11);
        ctx.fillStyle = alvo >= 3 ? '#25d366' : '#1f7a55'; ctx.fillRect(nx+1, 18+wave, 14, 9);
        ctx.fillStyle = '#ffffff';
        [[5,2],[6,2],[7,2],[8,2],[4,3],[9,3],[4,4],[9,4],[4,5],[9,5],[5,6],[6,6],[7,6],[8,6],[4,7]].forEach(function(p){ px(nx+1+p[0]+1, 18+wave+p[1]-1, '#ffffff'); });
        ctx.fillStyle = '#07040d'; ctx.fillRect(nx-3, 44, 7, 2);
      }
    });
    // personagem
    var chegou = alvo >= 3 && !andando;
    // chegou na bandeira: pula de alegria
    var bob = andando ? (Math.floor(t*10)%2) : chegou ? Math.round(Math.abs(Math.sin(t*6))*4) : Math.round(Math.sin(t*3)*.6);
    var frame = andando && Math.floor(t*10)%2 ? HERO2 : HERO;
    ctx.fillStyle = 'rgba(7,4,13,.8)'; ctx.fillRect(cur-4, 45, 9, 1);
    sprite(frame, Math.round(cur) - (frame[0].length >> 1), 45 - frame.length - bob);
    // festa no fim
    if(chegou){
      for(var f=0; f<6; f++){ var a = t*3 + f; px(NODES[3] + 8 + Math.cos(a)*10, 22 + Math.sin(a)*4, f%2 ? '#e8c26a' : '#b88bff'); }
      // confete caindo na trilha toda
      var CONF = ['#e8c26a','#f07cb0','#b88bff','#7fe9dc','#ffffff'];
      for(var c=0; c<18; c++){ var cx = (c*29 + 7) % W + Math.round(Math.sin(t*2 + c)*2), cy = 14 + ((t*(10 + c%3*4) + c*7) % 32); px(cx, cy, CONF[c % CONF.length]); if(c % 2) px(cx+1, cy, CONF[c % CONF.length]); }
    }
  }
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches, last = 0;
  (function loop(ms){ requestAnimationFrame(loop); if(ms - last < 66) return; last = ms; if(still){ pos = NODES[Math.min(3,getAlvo())] - NODES[0]; } draw(ms); })(0);
}
