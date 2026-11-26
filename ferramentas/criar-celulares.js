// Monta mac3dos-celulares.html a partir do catálogo de estética (mesmo visual), com conteúdo de lojas de celular.
// As fotos e vídeos entram na seção "em-uso" quando chegarem (lista FOTOS abaixo).
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const src = fs.readFileSync(path.join(dir, 'mac3dos-estetica.html'), 'utf8');
const sec = id => { const a = src.indexOf(`  <section id="${id}"`), b = src.indexOf('  </section>', a) + '  </section>'.length; if (a < 0) throw new Error(id); return src.slice(a, b); };
const rep = (s, pairs) => pairs.reduce((acc, [a, b]) => { if (!acc.includes(a)) throw new Error('não achei: ' + a.slice(0, 60)); return acc.split(a).join(b); }, s);

let head = src.slice(0, src.indexOf('<main id="inicio">'));
head = rep(head, [
  ['<title>MAC3DOS para Estética e Beleza</title>', '<title>MAC3DOS Celulares e tecnologia</title>'],
  ['href="media/estetica/thumb.jpg"', 'href="media/celulares/thumb.jpg"'],
  ['<span>Estética e beleza</span>', '<span>Celulares e tecnologia</span>'],
  ['</style>', `/* celulares e tecnologia */
#pecas .uses{grid-template-columns:repeat(3,minmax(0,1fr))}
.use-ph{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px}
#pecas .use svg{aspect-ratio:4/3;max-width:none}
#pecas .use svg{width:100%;max-width:220px;height:auto;justify-self:center;filter:drop-shadow(0 16px 22px rgba(0,0,0,.5))}
@media (max-width:900px){#pecas .uses{grid-template-columns:1fr}}
.rec-ill{display:grid;place-items:center;border-radius:16px;border:1px solid rgba(255,255,255,.07);background:radial-gradient(ellipse at 50% 80%,rgba(142,59,245,.25),transparent 70%),var(--surface)}
.rec-ill svg{width:100%;max-width:380px;height:auto}
#nfc [data-s=ln] .ln-row b{min-width:auto}
</style>`]
]);
let foot = src.slice(src.indexOf('<footer>'), src.indexOf('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'))
  .replace(/\n<div class="lightbox"[\s\S]*?<\/div>\n/, '\n');

const LOGO = (x, y, k, c = ["#E9DBFF","#8E3BF5","#3A1C61"]) => `<g transform="translate(${x} ${y}) scale(${k})"><polygon points="0,2 27,31 0,58" fill="${c[0]}"/><polygon points="56,0 56,58 6,58" fill="${c[1]}"/><polygon points="0,58 56,58 28,84" fill="${c[2]}"/></g>`;
// iPhone visto de costas (chaveiro), para ilustrações
const PHONE = (x, y, w, body, cam, txt) => { const h = w * 1.95, r = w * .17; return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${body}"/><rect x="${x + 3}" y="${y + 3}" width="${w * .22}" height="${h - 6}" rx="${r * .8}" fill="#fff" opacity=".12"/><rect x="${x + w * .1}" y="${y + w * .1}" width="${w * .42}" height="${w * .42}" rx="${w * .1}" fill="${cam}"/><circle cx="${x + w * .2}" cy="${y + w * .2}" r="${w * .075}" fill="#07060a"/><circle cx="${x + w * .2}" cy="${y + w * .42}" r="${w * .075}" fill="#07060a"/><circle cx="${x + w * .42}" cy="${y + w * .31}" r="${w * .075}" fill="#07060a"/><circle cx="${x + w * .83}" cy="${y + w * .17}" r="${w * .06}" fill="none" stroke="#15131B" stroke-width="2"/><text x="${x + w / 2}" y="${y + h * .66}" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="700" font-size="${w * .2}" fill="#fff">${txt}</text></g>`; };
const CABLE = (x, y, k, sleeve, txt) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M30 120C30 150 60 160 100 160" fill="none" stroke="#EDEBF0" stroke-width="9" stroke-linecap="round"/><rect x="22" y="10" width="16" height="10" rx="2" fill="#C9C6D2"/><rect x="16" y="20" width="28" height="34" rx="5" fill="#EDEBF0"/><rect x="14" y="54" width="32" height="44" rx="10" fill="${sleeve}"/><text x="30" y="80" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="700" font-size="8" fill="#fff" transform="rotate(-90 30 78)">${txt}</text><path d="M18 102c8 4 16 4 24 0M18 110c8 4 16 4 24 0M18 118c8 4 16 4 24 0" stroke="${sleeve}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;

// peça impressa na abertura: chaveiro de iPhone de costas, com a logo da MAC3DOS
const PRINTED = `<svg class="piece" viewBox="0 0 900 900" aria-hidden="true"><defs>
<linearGradient id="pzP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9A6FF"/><stop offset=".5" stop-color="#8E3BF5"/><stop offset="1" stop-color="#3A1C61"/></linearGradient>
<linearGradient id="pzG" x1="0" x2="1"><stop offset="0" stop-color="#fff2c9"/><stop offset=".5" stop-color="#d4a64a"/><stop offset="1" stop-color="#7a5418"/></linearGradient></defs>
<ellipse cx="466" cy="590" rx="58" ry="6" fill="#000" opacity=".5"/>
<rect x="420" y="404" width="96" height="184" rx="18" fill="#2a1150"/>
<rect x="414" y="400" width="96" height="186" rx="18" fill="url(#pzP)"/>
<rect x="418" y="404" width="20" height="178" rx="10" fill="#fff" opacity=".18"/>
<rect x="424" y="410" width="42" height="42" rx="10" fill="#1C1B21"/>
<circle cx="434" cy="420" r="7" fill="#07060a" stroke="#4a4858" stroke-width="2"/><circle cx="434" cy="442" r="7" fill="#07060a" stroke="#4a4858" stroke-width="2"/><circle cx="455" cy="431" r="7" fill="#07060a" stroke="#4a4858" stroke-width="2"/>
<circle cx="494" cy="418" r="6" fill="none" stroke="#2a1150" stroke-width="3"/>
<circle cx="494" cy="398" r="13" fill="none" stroke="url(#pzG)" stroke-width="4"/>
${LOGO(453.6, 480.4, .3, ["#ffffff","#E9DBFF","#3A1C61"])}
</svg>`;

const main = `<main id="inicio">
  <section class="hero">
    <div class="wrap">
      <div class="hero-copy">
        <p class="eyebrow">Brindes impressos em 3D para lojas de celular e assistências</p>
        <h1>O seu cliente sai da loja com a sua marca. <em>E lembra de você toda vez que pega a chave.</em></h1>
        <p class="lead">Chaveiros abridores em formato de iPhone com a logo da loja e protetores de cabo de carregador personalizados. Brindes úteis que o cliente usa todo dia.</p>
        <div class="taglines"><span>Quem usa lembra</span><span>Brindes úteis. Marcas inesquecíveis.</span></div>
      </div>
      <div class="printer" role="img" aria-label="Impressora 3D MAC3DOS imprimindo um chaveiro em formato de iPhone">
        <img src="media/impressora-vazia.jpg" alt="">
        ${PRINTED}
        <div class="glow"></div>
        <div class="layer"></div>
      </div>
    </div>
  </section>

  <section id="em-uso" class="band">
    <div class="wrap">
      <div class="sec-head showcase-head">
        <p class="eyebrow">No chaveiro do cliente</p>
        <h2>Quem usa lembra.</h2>
        <p class="lead">Um brinde que o cliente usa de verdade: abre a lata, segura a chave e vai para todo lugar. Toda vez que usa, ele lembra da sua loja e mostra a sua marca para os amigos.</p>
      </div>
      <div class="showcase">
        <figure class="show">
          <div class="show-media"><video preload="none" data-src="media/celulares/video-05.mp4" poster="media/celulares/video-05.jpg" autoplay muted loop playsinline aria-label="Chaveiro de iPhone roxo abrindo uma lata de refrigerante"></video></div>
          <figcaption><span>Abridor de lata</span><strong>iPhone roxo</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><video preload="none" data-src="media/celulares/video-04.mp4" poster="media/celulares/video-04.jpg" autoplay muted loop playsinline aria-label="Chaveiro de iPhone prata abrindo uma lata"></video></div>
          <figcaption><span>Abridor de lata</span><strong>iPhone prata</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><video preload="none" data-src="media/celulares/video-03.mp4" poster="media/celulares/video-03.jpg" autoplay muted loop playsinline aria-label="Chaveiros de iPhone brancos com a etiqueta da loja abrindo uma lata"></video></div>
          <figcaption><span>Com a etiqueta da loja</span><strong>iPhone branco</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><video preload="none" data-src="media/celulares/video-06.mp4" poster="media/celulares/video-06.jpg" autoplay muted loop playsinline aria-label="Chaveiro de iPhone azul claro abrindo uma lata"></video></div>
          <figcaption><span>Lote para a loja</span><strong>iPhone azul</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><video preload="none" data-src="media/celulares/video-01.mp4" poster="media/celulares/video-01.jpg" autoplay muted loop playsinline aria-label="Chaveiro de iPhone laranja nas mãos, com a câmera em detalhe"></video></div>
          <figcaption><span>Na cor que você quiser</span><strong>iPhone laranja</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><video preload="none" data-src="media/estetica/video-13.mp4" poster="media/estetica/video-13.jpg" autoplay muted loop playsinline aria-label="Chaveiro verde em forma de coração com logo que abre e vira suporte de celular"></video></div>
          <figcaption><span>Vira suporte de celular</span><strong>Chaveiro porta-celular</strong></figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section id="pecas">
    <div class="wrap">
      <div class="sec-head showcase-head">
        <p class="eyebrow">Os brindes</p>
        <h2>Brindes que combinam com a sua loja</h2>
        <p class="lead">Peças ligadas ao que a loja vende: celular, cabo e carregador. Todas saem nas cores e com a logo da sua loja.</p>
      </div>
      <div class="uses">
        <article class="use"><img class="use-ph" src="media/celulares/video-04.jpg" alt="Chaveiro de iPhone prata abrindo uma lata" loading="lazy"><span class="use-tag">Chaveiro abridor</span><h3>Chaveiro de iPhone com a logo da loja</h3><p>Miniatura de iPhone que também abre lata. A logo da loja vai nas costas, no lugar da maçã.</p></article>
        <article class="use"><img class="use-ph" src="media/estetica/video-13.jpg" alt="Chaveiro de coração verde que vira suporte de celular" loading="lazy"><span class="use-tag">Vira suporte</span><h3>Chaveiro porta-celular</h3><p>Abre e vira um suporte para apoiar o celular na mesa. Pode ter o formato da logo da sua loja.</p></article>
        <article class="use"><svg viewBox="0 0 240 200" aria-hidden="true">${CABLE(30, 10, 1.05, '#8E3BF5', 'SUA LOJA')}${CABLE(120, 18, 1, '#F48FB1', 'LOJA')}</svg><span class="use-tag">Protetor de cabo</span><h3>Protetor de cabo personalizado</h3><p>Protege a ponta do cabo do carregador, que é onde ele quebra, e leva o nome ou a marca da sua loja.</p></article>
      </div>
    </div>
  </section>

  <section id="comparacao">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">Por que brinde útil</p>
        <h2>Um brinde útil vale mais que mil panfletos.</h2>
      </div>
      <div class="contrast">
        <div class="no">
          <h3>O brinde comum</h3>
          <ul>
            <li>Panfleto e cartão de visita que vão para a gaveta</li>
            <li>Brinde genérico, que ninguém associa à sua loja</li>
            <li>Ninguém usa, ninguém comenta</li>
            <li>A marca some em uma semana</li>
          </ul>
        </div>
        <div class="yes">
          <h3>O brinde MAC3DOS</h3>
          <ul>
            <li>Combina com o que a loja vende: celular, cabo e carregador</li>
            <li>Feito nas cores e com a logo da sua loja</li>
            <li>Tem função: abre lata, segura a chave e protege o cabo</li>
            <li>Pode ter NFC: um toque e o celular abre o WhatsApp da loja</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section id="experimente" class="band">
    <div class="wrap lab">
      <div class="lab-stage" id="stage">
        <canvas id="kb3d" aria-label="Brinde em 3D personalizável. Arraste para girar."></canvas>
        <div id="kbFallback" class="rec-ill" hidden><svg viewBox="0 0 240 200" aria-hidden="true">${PHONE(85, 20, 72, '#8E3BF5', '#1C1B21', 'SUA LOJA')}</svg></div>
        <span class="lab-hint" id="kbHint">Arraste para girar</span>
      </div>
      <div class="lab-panel">
        <div class="sec-head" style="margin-bottom:0">
          <p class="eyebrow">Experimente</p>
          <h2>Veja o brinde com a sua marca</h2>
          <p class="lead">Escolha a peça, as cores e escreva o nome da sua loja. O brinde muda na hora, do jeito que sairia da nossa impressora.</p>
        </div>
        <div class="field"><span>Peça</span><div class="seg-ctl" id="kbPiece" role="group" aria-label="Peça"><button type="button" data-p="ip" aria-pressed="true">Chaveiro iPhone</button><button type="button" data-p="cb" aria-pressed="false">Protetor de cabo</button></div></div>
        <div class="field"><span id="lblMain">Cor do chaveiro</span><div class="swatches" id="swMain" role="group" aria-label="Cor principal"></div></div>
        <div class="field"><span id="lblBase">Cor da câmera</span><div class="swatches" id="swBase" role="group" aria-label="Segunda cor"></div></div>
        <label class="field" for="kbName"><span>Nome da sua loja</span><input id="kbName" maxlength="14" value="SUA LOJA" autocomplete="off"></label>
        <p class="spec">Simulação ilustrativa. A peça real é modelada com a logo da sua loja.</p>
      </div>
    </div>
  </section>

  <section id="ideias">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">Como a sua loja pode usar</p>
        <h2>Um brinde para cada momento do cliente</h2>
      </div>
      <div class="uses">
        <article class="use"><span class="use-tag">Compra do aparelho</span><h3>Celular novo, chaveiro novo</h3><p>Quem compra um celular sai com o chaveiro de iPhone da loja. É a primeira coisa que ele mostra para os amigos.</p></article>
        <article class="use"><span class="use-tag">Conserto e troca de tela</span><h3>Devolva o celular com um mimo</h3><p>Na entrega do conserto, o protetor de cabo vai junto. O cliente lembra da assistência quando o próximo celular quebrar.</p></article>
        <article class="use"><span class="use-tag">Capinha e película</span><h3>Brinde na compra de acessório</h3><p>Acima de um valor, o cliente ganha o protetor de cabo. Ajuda a vender mais acessórios no balcão.</p></article>
        <article class="use"><span class="use-tag">Indicação</span><h3>Indique um amigo</h3><p>Quem indica ganha um chaveiro. O amigo chega pelo boca a boca e já conhece a sua loja.</p></article>
      </div>
      <div class="dates dates-in">
        <div class="dates-vids">
        <figure class="show dates-media">
        <div class="show-media"><video preload="none" data-src="media/video-8.mp4" poster="media/video-8.jpg" autoplay muted loop playsinline aria-label="Roleta de prêmios personalizada girando"></video></div>
        <figcaption><span>Ação promocional</span><strong>Roleta de prêmios</strong></figcaption>
      </figure>
        </div>
      <div class="sec-head" style="margin-bottom:0">
        <p class="eyebrow">Datas comemorativas e ações promocionais</p>
        <h3 class="dates-title">Um brinde para cada data do ano</h3>
        <p class="lead">Criamos peças temáticas com a identidade da sua loja. Cada data vira um motivo para presentear o cliente e ser lembrado por ele.</p>
        <p class="lead">Roletas de prêmios para Black Friday, lançamento de celular ou aniversário da loja: o cliente gira, ganha um desconto ou um brinde e comenta com todo mundo.</p>
        <ul class="occasions dates-list" aria-label="Datas">
          <li>Lançamento de celular</li><li>Dia dos Pais</li><li>Dia das Mães</li><li>Black Friday</li><li>Natal</li><li>Aniversário da loja</li>
        </ul>
      </div>
    </div>
    </div>
  </section>

${rep(sec('nfc'), [
  ['<h2>Um toque e a cliente agenda o próximo horário</h2>', '<h2>Um toque e o cliente chama a loja no WhatsApp</h2>'],
  ['no chaveiro, no porta-creme ou numa placa de balcão. A cliente aproxima o celular e a página que você escolheu abre na hora.', 'no chaveiro de iPhone ou numa placa de balcão. O cliente aproxima o celular e a página que você escolheu abre na hora.'],
  ['agenda, WhatsApp, Instagram ou Google', 'WhatsApp, Instagram, Google ou catálogo'],
  ['<strong>A cliente agenda, segue ou avalia</strong>', '<strong>O cliente chama, segue ou avalia</strong>'],
  ['Chaveiros com NFC: um toque no celular e o Instagram da clínica abre na hora.', 'Chaveiro de iPhone com NFC: um toque no celular e a página da loja abre na hora.'],
  ['aria-label="Chaveiro com NFC encostado no celular abrindo o perfil do Instagram da cliente"', 'aria-label="Chaveiro de iPhone com NFC encostado no celular abrindo a página da loja"'],
  ['data-src="media/estetica/video-11.mp4" poster="media/estetica/video-11.jpg"', 'data-src="media/celulares/video-02.mp4" poster="media/celulares/video-02.jpg"'],
  ['>Agenda</button>', '>Catálogo</button>'],
  ['<div class="ig-name">@seuespaco</div>', '<div class="ig-name">@sualoja</div>'],
  ['<span class="wa-av">SS</span>Seu Espaço', '<span class="wa-av">SL</span>Sua Loja'],
  ['Oi! Quero agendar manicure para sábado.', 'Oi! Quanto fica a troca de tela do meu iPhone?'],
  ['<div class="gg-title">Seu Espaço</div>', '<div class="gg-title">Sua Loja</div>'],
  ['Atendimento impecável, amei!', 'Trocaram a tela na hora. Recomendo!'],
  ['<div class="ln-title">Agende seu horário</div>', '<div class="ln-title">Catálogo da loja</div>'],
  ['<div class="ln-row"><b>09:00</b>Manicure</div>', '<div class="ln-row"><b>R$</b>iPhones seminovos</div>'],
  ['<div class="ln-row"><b>10:30</b>Escova</div>', '<div class="ln-row"><b>R$</b>Capinhas e películas</div>'],
  ['<div class="ln-row"><b>14:00</b>Design de sobrancelha</div>', '<div class="ln-row"><b>R$</b>Carregadores e cabos</div>'],
  ['<div class="ln-row"><b>16:00</b>Limpeza de pele</div>', '<div class="ln-row"><b>R$</b>Troca de tela e bateria</div>'],
  ['<div class="ln-btn">Confirmar horário</div>', '<div class="ln-btn">Pedir no WhatsApp</div>'],
  ['<div class="ig-av">SS</div>', '<div class="ig-av">SL</div>'],
  [/<div class="nf-tag" aria-hidden="true">\s*<svg[\s\S]*?<\/svg>/.source ? '' : '', '']
].filter(p => p[0]))}

  <section id="receita">
    <div class="wrap rec">
      <div class="rec-media" style="grid-template-columns:1fr">
        <figure class="rec-ph rec-ill" style="margin:0;aspect-ratio:4/3"><svg viewBox="0 0 300 220" aria-hidden="true">
          <rect x="40" y="150" width="220" height="40" rx="6" fill="#3A1C61"/><rect x="40" y="150" width="220" height="8" rx="4" fill="#8E3BF5"/>
          <rect x="60" y="40" width="180" height="112" rx="8" fill="#15131B" stroke="#8E3BF5" stroke-width="2"/>
          <text x="150" y="178" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="700" font-size="14" fill="#E9DBFF">SUA LOJA</text>
          ${[0,1,2,3].map(i => `<line x1="${82 + i * 45}" y1="48" x2="${82 + i * 45}" y2="60" stroke="#C9C6D2" stroke-width="2"/>`).join('')}
          ${PHONE(72, 60, 22, '#8E3BF5', '#1C1B21', '')}${PHONE(117, 60, 22, '#F48FB1', '#1C1B21', '')}${PHONE(162, 60, 22, '#1E7BE0', '#1C1B21', '')}${PHONE(207, 60, 22, '#D4A64A', '#1C1B21', '')}
          ${CABLE(76, 106, .28, '#8E3BF5', '')}${CABLE(121, 106, .28, '#F48FB1', '')}${CABLE(166, 106, .28, '#1E7BE0', '')}${CABLE(211, 106, .28, '#D4A64A', '')}
        </svg></figure>
      </div>
      <div class="rec-copy">
        <div class="sec-head" style="margin-bottom:0">
          <p class="eyebrow">Nova fonte de receita</p>
          <h2>Aumente o faturamento da sua loja</h2>
          <p class="lead">Com um expositor no balcão, os brindes também viram produto. O cliente compra por impulso enquanto espera o conserto, leva a sua marca e a loja ganha uma receita a mais todo mês.</p>
        </div>
        <ul class="rec-list">
          <li>Expositor nas cores da sua loja, pronto para o balcão</li>
          <li>Chaveiros de iPhone e protetores de cabo em várias cores</li>
          <li>Você escolhe os modelos e as quantidades de cada um</li>
        </ul>
        <div class="calc" id="calc">
          <p class="calc-title">Simule o seu ganho</p>
          <div class="calc-in">
            <label for="cQtd">Vendas por mês<input id="cQtd" type="number" min="0" step="1" value="60" inputmode="numeric"></label>
            <label for="cPreco">Preço de venda (R$)<input id="cPreco" type="number" min="0" step="1" value="25" inputmode="decimal"></label>
            <label for="cCusto">Custo por peça (R$)<input id="cCusto" type="number" min="0" step="1" value="10" inputmode="decimal"></label>
          </div>
          <div class="calc-out">
            <div><span>Lucro por mês</span><b id="cMes">R$ 900</b></div>
            <div><span>Lucro em 12 meses</span><b id="cAno">R$ 10.800</b></div>
          </div>
          <p class="calc-note">Valores de exemplo. O custo real depende do modelo e da quantidade do pedido.</p>
        </div>
      </div>
    </div>
  </section>

${rep(sec('processo'), [
  ['<h2>Da ideia ao brinde na mão da cliente</h2>', '<h2>Da ideia ao brinde na mão do cliente</h2>'],
  ['<p class="pv-in">Oi! Quero um brinde para as clientes no Dia da Mulher.</p>', '<p class="pv-in">Oi! Quero um brinde para quem compra celular na loja.</p>'],
  ['<p class="pv-out">Perfeito! Quantas clientes e quais as cores da marca?</p>', '<p class="pv-out">Perfeito! Quantos por mês e quais as cores da loja?</p>'],
  ['<p class="pv-in">Umas 150. Rosa e dourado.</p>', '<p class="pv-in">Uns 200. Roxo e preto.</p>'],
  ['<p class="pv-out">Já tenho uma ideia: porta-creme com a sua logo.</p>', '<p class="pv-out">Já tenho uma ideia: chaveiro de iPhone com a sua logo.</p>'],
  ['modelo_porta_creme.stl', 'chaveiro_iphone.stl'],
  ['<p id="ppDesc">Entendemos o público, os serviços e as ações do seu espaço para sugerir o brinde certo.</p>', '<p id="ppDesc">Entendemos o público, os serviços e as ações da sua loja para sugerir o brinde certo.</p>'],
  ['aria-label="Animação da impressora 3D imprimindo um chaveiro de esmalte"', 'aria-label="Animação da impressora 3D imprimindo um chaveiro de iPhone"']
]).replace(/<g class="pv-obj" clip-path="url\(#pvClip\)">[\s\S]*?<\/g>/, `<g class="pv-obj" clip-path="url(#pvClip)"><rect x="104" y="76" width="32" height="62" rx="7" fill="#8E3BF5"/><rect x="108" y="80" width="14" height="14" rx="3" fill="#1C1B21"/></g>`)
 .replace(/<span class="pv-prev" aria-hidden="true"><svg viewBox="0 0 160 110">[\s\S]*?<\/svg><\/span>/, `<span class="pv-prev" aria-hidden="true"><svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#f1ecfa"/>${PHONE(62, 10, 46, '#8E3BF5', '#1C1B21', 'SUA LOJA')}</svg></span>`)}

  <section id="contato">
    <div class="wrap cta">
      <p class="eyebrow">Vamos conversar</p>
      <h2>Vamos criar o brinde da sua loja?</h2>
      <p class="lead">Conte o que você imagina e a gente transforma em um brinde que os seus clientes vão querer usar.</p>
      <div class="cta-btns">
        <a class="btn btn-primary" href="https://wa.me/5521985101880?text=Ol%C3%A1%2C%20MAC3DOS!%20Vi%20o%20cat%C3%A1logo%20de%20celulares%20e%20tecnologia%20e%20quero%20conversar." target="_blank" rel="noopener">Chamar no WhatsApp</a>
        <a class="btn btn-ghost" href="https://www.instagram.com/mac3dos/" target="_blank" rel="noopener">Ver o Instagram</a>
      </div>
      <p class="cta-contact">WhatsApp (21) 98510-1880 · @mac3dos</p>
    </div>
  </section>
</main>

`;

const sStart = src.indexOf('<script>', src.indexOf('three.min.js')) + '<script>'.length;
const js = src.slice(sStart, src.lastIndexOf('</script>'));
const cut = (a, b) => { const i = js.indexOf(a), j = js.indexOf(b, i); if (i < 0 || j < 0) throw new Error('bloco: ' + a); return js.slice(i, j); };
const nfc = cut('// ---------- NFC:', '// Vídeos tocam sozinhos');
const play = cut('// Vídeos tocam sozinhos', 'renderGallery(); startRotation();');
const reveal = cut('// ---------- Revelação em camadas', '// ---------- Como trabalhamos');
const proc = cut('// ---------- Como trabalhamos', '// ---------- simulador de ganho').replace(
  '["Conversa", "Entendemos o público, os serviços e as ações do seu espaço para sugerir o brinde certo."]',
  '["Conversa", "Entendemos o público, os serviços e as ações da sua loja para sugerir o brinde certo."]');
const rest = js.slice(js.indexOf('// ---------- simulador de ganho'));
const sim = fs.readFileSync(path.join(__dirname, 'celular3d.js'), 'utf8');
const html = head + main + foot + '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<script>\nconst $ = id => document.getElementById(id);\n\n' + nfc + play + '\n' + sim + '\n' + reveal + proc + rest + '</script>\n';
const html2 = html.replace(/<div class="nf-tag" aria-hidden="true">\s*<svg[\s\S]*?<\/svg>/, `<div class="nf-tag" aria-hidden="true"><svg viewBox="0 0 100 110"><circle cx="66" cy="10" r="6" fill="none" stroke="#D4A64A" stroke-width="2.4"/><rect x="28" y="14" width="44" height="88" rx="10" fill="#8E3BF5"/><rect x="33" y="19" width="18" height="18" rx="4" fill="#1C1B21"/><path d="M42.5 66a10.5 10.5 0 0 1 15 0M45.6 70.4a5.5 5.5 0 0 1 8.8 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="50" cy="75" r="2" fill="#fff"/></svg>`).replace(/<g class="pv-item pv-i1">[\s\S]*?<g class="pv-item pv-i3">[\s\S]*?<\/g>/, `<g class="pv-item pv-i1"><rect x="88" y="52" width="14" height="26" rx="3" fill="#8E3BF5"/><rect x="90" y="54" width="6" height="6" rx="1" fill="#1C1B21"/></g><g class="pv-item pv-i2"><rect x="126" y="52" width="14" height="26" rx="3" fill="#1C1B21"/><rect x="128" y="54" width="6" height="6" rx="1" fill="#4A4858"/></g><g class="pv-item pv-i3"><rect x="108" y="50" width="8" height="22" rx="3" fill="#F48FB1"/><rect x="109" y="44" width="6" height="7" rx="1" fill="#EDEBF0"/></g>`).replace("Pronto para a recepção", "Pronto para o balcão");
fs.writeFileSync(path.join(dir, 'mac3dos-celulares.html'), html2);
console.log('ok', html.length);
