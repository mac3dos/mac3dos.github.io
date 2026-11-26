  // ---- cenas extras do link da bio (coladas dentro de pixelScene por ferramentas/criar-previa.js) ----

  // tela de entrada: logo da MAC3DOS flutuando entre blocos de "?"
  function inicio(t, hz, fy){
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

  // eventos e comemorações: bolo de dois andares com velas, balões e presente, confete caindo
  function eventos(t, hz, fy){
    const bob = Math.round(Math.sin(t * 2.4) * 1.5);
    const CREAM = ["#c9a86a","#f3e3c0","#fffaf0"].map(col);
    const CAKE = [PINK[0], PINK[1], PINK[2]];
    const BPURP = ["#2a1150","#5a24a8","#8e3bf5","#c9a6ff","#ffffff"].map(col);
    const BROSE = ["#7a1f4a","#c2457e","#f07cb0","#ffc2dc","#ffffff"].map(col);
    const STRING = col("#d6d5dc");

    // balões, à esquerda, com fio até o chão
    const bx = Math.round(W * .17), br = Math.round(U * .085);
    [[bx + br + 1, fy - Math.round(U * .33) + Math.round(Math.sin(t * 2 + 1) * 1.5), BROSE], [bx, fy - Math.round(U * .42) + bob, BPURP]].forEach(([x, y, pal]) => {
      for (let yy = y + br + 2; yy < fy; yy++) put(x + Math.round(Math.sin(yy * .5 + t * 3) * .8), yy, STRING);
      ball(x, y, br, pal);
      put(x, y + br + 1, pal[1]); put(x - 1, y + br + 1, pal[1]); put(x + 1, y + br + 1, pal[1]);
    });
    shadow(bx + 2, fy + 1, br + 2, 2);

    // presente, à direita: caixa dourada com fita roxa e laço
    const gx = Math.round(W * .82), gs = Math.round(U * .1), gh = Math.round(gs * 1.5), gTop = fy - gh;
    shadow(gx, fy + 1, gs + 3, 2);
    box(gx - gs, gTop, gx + gs, fy, [GOLD[1], GOLD[2], GOLD[3]]);
    box(gx - gs - 1, gTop - 3, gx + gs + 1, gTop - 1, [GOLD[1], GOLD[3], GOLD[4]]);
    for (let y = gTop - 3; y <= fy; y++) { put(gx, y, PURP); put(gx + 1, y, PURPD); }
    for (let x = gx - gs - 1; x <= gx + gs + 1; x++) put(x, gTop - 2, x <= gx ? PURP : PURPD);
    [[-3,-5],[-2,-5],[-4,-4],[-1,-4],[-3,-3],[-2,-3],[3,-5],[4,-5],[2,-4],[5,-4],[3,-3],[4,-3],[0,-4],[1,-4]].forEach(([dx, dy]) => put(gx + dx, gTop + dy, dx < 1 ? PURP : col("#c9a6ff")));

    // bolo no centro: andar de baixo rosa com a logo, andar de cima de creme, cobertura escorrendo
    const cx = Math.round(W / 2), bw = Math.round(U * .25), bh = Math.round(U * .17), tw = Math.round(bw * .64), th = Math.round(U * .13);
    const yb = fy - bh, yt = yb - th;
    shadow(cx, fy + 1, bw + 3, 3);
    box(cx - bw, yb, cx + bw, fy, CAKE);
    for (let x = cx - bw; x <= cx + bw; x++) { const n = (x * 7 + 3) % 5 < 2 ? 3 : 1; for (let k = 0; k < n; k++) put(x, yb + k, CREAM[k ? 1 : 2]); }
    const lw = Math.max(4, Math.round(bh * .5));
    logo(cx, yb + Math.round((bh - lw * 84 / 56) / 2) + 2, lw, PINK[0]);
    box(cx - tw, yt, cx + tw, yb - 1, CREAM);
    for (let x = cx - tw; x <= cx + tw; x++) { const n = (x * 5 + 1) % 4 < 2 ? 2 : 1; for (let k = 0; k < n; k++) put(x, yt + k, PINK[k ? 1 : 2]); }
    // velas com chama piscando
    [-1, 0, 1].forEach(k => {
      const x = cx + k * Math.round(tw * .55);
      for (let y = yt - 5; y < yt; y++) put(x, y, (y & 1) ? PURP : col("#c9a6ff"));
      put(x - 1, yt - 5, C.out); put(x + 1, yt - 5, C.out);
      const f = Math.sin(t * 9 + k * 2) > 0;
      put(x, yt - 6, f ? GOLD[4] : GOLD[3]); put(x, yt - 7, f ? GOLD[3] : WHITE);
      if (f) put(x, yt - 8, GOLD[2]);
    });
    // brilho no bolo
    if (Math.sin(t * 3) > .3) { const sx = cx - bw + 2, sy = yb + Math.round(bh * .55); put(sx, sy, WHITE); put(sx, sy - 1, PINK[2]); put(sx, sy + 1, PINK[2]); }

    // confete caindo
    const CONF = [col("#e8c26a"), col("#f07cb0"), col("#b88bff"), col("#7fe9dc"), WHITE];
    for (let i = 0; i < 22; i++) {
      const x = (i * 37 + 5) % W + Math.round(Math.sin(t * 2 + i) * 2), y = Math.round((t * (8 + i % 4 * 2) + i * 13) % fy);
      const c = CONF[i % CONF.length]; put(x, y, c); if (i % 3 === 0) put(x + 1, y, c);
    }
  }

