// Monta mac3dos-criadores.html a partir do catálogo de estética (mesmo visual), com conteúdo novo.
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const src = fs.readFileSync(path.join(dir, 'mac3dos-estetica.html'), 'utf8').replace(/<!-- visualizador:inicio -->[\s\S]*?<!-- visualizador:fim -->/, ''); // o visualizador entra depois, no gerar-site
const iMain = src.indexOf('<main id="inicio">');
const iFoot = src.indexOf('<footer>');
const iThree = src.indexOf('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>');
let head = src.slice(0, iMain);
head = head.replace('<title>MAC3DOS para Estética e Beleza</title>', '<title>MAC3DOS Criadores de conteúdo</title>')
  .replace('href="media/estetica/thumb.jpg"', 'href="media/criadores/thumb.jpg"')
  .replace('<span>Estética e beleza</span>', '<span>Criadores de conteúdo</span>')
  .replace('</style>', `
/* criadores de conteúdo */
#linha .use svg{width:76px;height:76px;filter:drop-shadow(0 10px 16px rgba(0,0,0,.45))}
#em-uso .showcase{max-width:760px}
#linha .uses{grid-template-columns:repeat(3,minmax(0,1fr))}
@media (max-width:900px){#linha .uses{grid-template-columns:1fr}}
.use-ph{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px}
#nfc [data-s=gg] .gg-btn{background:#E52D27;color:#fff}
</style>`);
if (!head.includes('Criadores de conteúdo</span>')) throw new Error('cabeçalho não encontrado');
let foot = src.slice(iFoot, iThree).replace("Transformamos ideias em brindes.", "Transformamos ideias em peças.").replace(/\n<div class="lightbox"[\s\S]*?<\/div>\n/, '\n');

const MIC = (c, cube, txt, tc) => `<rect x="53" y="56" width="14" height="56" rx="6" fill="${c}"/><circle cx="60" cy="30" r="20" fill="${c}"/><path d="M42 26h36M42 34h36M50 12v36M60 10v40M70 12v36" stroke="#000" stroke-opacity=".18" stroke-width="1.4"/><rect x="40" y="46" width="40" height="30" rx="3" fill="${cube}"/><text x="60" y="65" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="700" font-size="9" fill="${tc}">${txt}</text>`;
const CLAP = (txt) => `<g transform="rotate(-10 18 44)"><rect x="18" y="34" width="86" height="14" rx="2" fill="#EDEBF0"/><path d="M28 34l-8 14h10l8-14zM48 34l-8 14h10l8-14zM68 34l-8 14h10l8-14zM88 34l-8 14h10l8-14z" fill="#1C1B21"/></g><rect x="18" y="50" width="86" height="14" rx="2" fill="#EDEBF0"/><path d="M28 50l-8 14h10l8-14zM48 50l-8 14h10l8-14zM68 50l-8 14h10l8-14zM88 50l-8 14h10l8-14z" fill="#1C1B21"/><rect x="18" y="64" width="86" height="46" rx="3" fill="#1C1B21"/><text x="61" y="84" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="700" font-size="11" fill="#fff">${txt}</text><path d="M24 92h74M50 92v14M74 92v14" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>`;

const main = `<main id="inicio">
  <section class="hero">
    <div class="wrap">
      <div class="hero-copy">
        <p class="eyebrow">Acessórios impressos em 3D para criadores de conteúdo</p>
        <h1>Grave com a sua marca. <em>Em todo vídeo.</em></h1>
        <p class="lead">Mini microfones que encaixam o seu microfone de lapela, capas para o case do Hollyland e claquetes com o nome do canal. Peças para você usar nas suas gravações.</p>
        <div class="taglines"><span>A sua marca em cena</span><span>Feito sob medida</span></div>
      </div>
      <div class="printer" role="img" aria-label="Impressora 3D MAC3DOS imprimindo um mini microfone">
        <img src="media/impressora-vazia.jpg" alt="">
        <svg class="piece" viewBox="0 0 900 900" aria-hidden="true"><defs>
<linearGradient id="pzD" x1="0" x2="1"><stop offset="0" stop-color="#8a76b4"/><stop offset=".35" stop-color="#3e3058"/><stop offset="1" stop-color="#17111f"/></linearGradient>
<radialGradient id="pzM" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#e2daf5"/><stop offset=".5" stop-color="#7a6c9c"/><stop offset="1" stop-color="#2a2038"/></radialGradient>
<pattern id="pzDots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="#000" opacity=".55"/></pattern>
<linearGradient id="pzC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC2DA"/><stop offset=".5" stop-color="#F48FB1"/><stop offset="1" stop-color="#C2457E"/></linearGradient>
</defs>
<ellipse cx="466" cy="590" rx="46" ry="6" fill="#000" opacity=".5"/>
<path d="M452 482L474 482L470 582Q463 590 456 582Z" fill="url(#pzD)"/>
<path d="M455 484L459 484L458 580" fill="none" stroke="#B88BFF" stroke-opacity=".45" stroke-width="2"/>
<circle cx="463" cy="380" r="30" fill="url(#pzM)"/>
<circle cx="463" cy="380" r="30" fill="url(#pzDots)"/>
<path d="M440 368a26 26 0 0 1 22-15" fill="none" stroke="#E9DBFF" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="463" cy="391" rx="30" ry="4" fill="none" stroke="#c9c4d8" stroke-width="3"/>
<rect x="448" y="405" width="30" height="13" rx="4" fill="url(#pzD)"/>
<path d="M425 418L441 408L517 408L501 418Z" fill="#FFD6E6"/>
<path d="M501 418L517 408L517 472L501 482Z" fill="#B23A6E"/>
<rect x="425" y="418" width="76" height="64" fill="url(#pzC)"/>
<path d="M425 418h76" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
<g transform="translate(451.5 432) scale(0.44)"><polygon points="0,2 27,31 0,58" fill="#ffffff"/><polygon points="56,0 56,58 6,58" fill="#8E3BF5"/><polygon points="0,58 56,58 28,84" fill="#3A1C61"/></g></svg>
        <div class="glow"></div>
        <div class="layer"></div>
      </div>
    </div>
  </section>

  <section id="em-uso" class="band">
    <div class="wrap">
      <div class="sec-head showcase-head">
        <p class="eyebrow">Nas suas gravações</p>
        <h2>A sua marca aparece em todo vídeo.</h2>
        <p class="lead">O mini microfone encaixa o seu microfone de lapela sem fio. Você segura como um microfone de repórter e o cubo com o seu @ aparece em toda entrevista, vídeo e story.</p>
      </div>
      <div class="showcase">
        <figure class="show">
          <div class="show-media"><video preload="none" data-src="media/criadores/video-01.mp4" poster="media/criadores/video-01.jpg" autoplay muted loop playsinline aria-label="Mão segurando mini microfones com os nomes Erica, Nutri News e Lala News"></video></div>
          <figcaption><span>Com o nome do canal</span><strong>Mini microfones</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><video preload="none" data-src="media/criadores/video-02.mp4" poster="media/criadores/video-02.jpg" autoplay muted loop playsinline aria-label="Mini microfone rosa com a marca Ghiedza Brand e claquete rosa escrita Luz, câmera, conteúdo"></video></div>
          <figcaption><span>Microfone e claquete</span><strong>Kit na cor da marca</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><img src="media/criadores/foto-02.jpg" alt="Três mini microfones pretos com cubos rosa e branco escritos @byfernandaramos, News e G" loading="lazy"></div>
          <figcaption><span>Com o @ do perfil</span><strong>Microfone de repórter</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><img src="media/criadores/foto-01.jpg" alt="Mini microfones coloridos com placas em forma de estrela, cubo, nuvem, flor e coração com nomes de marcas" loading="lazy"></div>
          <figcaption><span>Estrela, nuvem, coração</span><strong>No formato da sua marca</strong></figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section id="comparacao">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">Por que usar</p>
        <h2>O seu microfone de lapela com cara de programa de TV.</h2>
      </div>
      <div class="contrast">
        <div class="no">
          <h3>O lapela sozinho</h3>
          <ul>
            <li>Fica preso na roupa e quase não aparece</li>
            <li>Ninguém sabe de quem é o conteúdo</li>
            <li>Na mão, fica pequeno e sem graça</li>
            <li>Igual ao de todo mundo</li>
          </ul>
        </div>
        <div class="yes">
          <h3>Com o mini microfone MAC3DOS</h3>
          <ul>
            <li>Você segura como um microfone de repórter</li>
            <li>O seu @ ou a sua logo aparece em todo vídeo</li>
            <li>Visual profissional para entrevistas, vox pop e podcasts</li>
            <li>Nas cores e no formato da sua marca</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section id="case" class="band">
    <div class="wrap">
      <div class="sec-head showcase-head">
        <p class="eyebrow">Capa para o case do Hollyland</p>
        <h2>O seu microfone sem fio protegido e com a sua marca</h2>
        <p class="lead">Uma capa resistente que veste o case de carregamento do seu microfone de lapela Hollyland. Protege nas gravações externas, deixa as luzes da bateria à mostra e leva a sua marca em relevo, na cor que você escolher.</p>
      </div>
      <div class="showcase">
        <figure class="show">
          <div class="show-media"><img src="media/criadores/foto-04.jpg" alt="Capa rosa aberta no case de carregamento do microfone Hollyland, com os transmissores e o receptor encaixados" loading="lazy"></div>
          <figcaption><span>Na cor da sua marca</span><strong>Capa rosa</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><img src="media/criadores/foto-05.jpg" alt="Capa verde aberta com os microfones Hollyland dentro e a marca PWR PLNT gravada na lateral" loading="lazy"></div>
          <figcaption><span>Tudo no lugar</span><strong>Capa verde aberta</strong></figcaption>
        </figure>
        <figure class="show">
          <div class="show-media"><img src="media/criadores/foto-06.jpg" alt="Capa verde fechada com a marca PWR PLNT em relevo" loading="lazy"></div>
          <figcaption><span>Marca em relevo</span><strong>Capa verde fechada</strong></figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section id="linha">
    <div class="wrap">
      <div class="sec-head showcase-head">
        <p class="eyebrow">Linha para criadores</p>
        <h2>Mais peças com a sua marca</h2>
        <p class="lead">Além dos mini microfones, modelamos outras peças para quem grava. Todas saem nas cores e com o nome da sua marca.</p>
      </div>
      <div class="uses">
        <article class="use"><img class="use-ph" src="media/criadores/foto-03.jpg" alt="Claquete rosa escrita Luz, câmera, conteúdo, com cena, take e play" loading="lazy"><span class="use-tag">Para gravar</span><h3>Claquete personalizada</h3><p>Com o nome do canal ou do podcast. Funciona de verdade na gravação e fica linda no cenário.</p></article>
        <article class="use"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 14l9 19 21 3-15 14 4 21-19-10-19 10 4-21-15-14 21-3z" fill="#F2D43D"/><path d="M84 62c8-10 22-2 14 8l-14 14-14-14c-8-10 6-18 14-8z" fill="#F28C28"/><circle cx="36" cy="86" r="9" fill="#3EC1B4"/><circle cx="26" cy="80" r="9" fill="#3EC1B4"/><circle cx="46" cy="80" r="9" fill="#3EC1B4"/><circle cx="36" cy="74" r="9" fill="#3EC1B4"/></svg><span class="use-tag">Do seu jeito</span><h3>Formatos especiais</h3><p>No lugar do cubo, a placa pode ser estrela, nuvem, coração ou o formato da sua logo.</p></article>
        <article class="use"><svg viewBox="0 0 120 120" aria-hidden="true"><g transform="translate(-22 0)">${MIC('#1C1B21', '#F48FB1', '@SEU', '#3A1C61')}</g><g transform="translate(22 0)">${MIC('#B9A3E8', '#EDEBF0', 'LOGO', '#8E3BF5')}</g></svg><span class="use-tag">Para equipes</span><h3>Empresas e produtoras</h3><p>Agências, escolas de comunicação, rádios e equipes de social media pedem em quantidade, com a logo da empresa.</p></article>
      </div>
    </div>
  </section>

  <section id="experimente" class="band">
    <div class="wrap lab">
      <div class="lab-stage" id="stage">
        <canvas id="kb3d" aria-label="Peça em 3D personalizável. Arraste para girar."></canvas>
        <img id="kbFallback" src="media/criadores/foto-02.jpg" alt="Mini microfones personalizados com o @ do perfil" hidden>
        <span class="lab-hint" id="kbHint">Arraste para girar</span>
      </div>
      <div class="lab-panel">
        <div class="sec-head" style="margin-bottom:0">
          <p class="eyebrow">Experimente</p>
          <h2>Veja a peça com o seu @</h2>
          <p class="lead">Escolha a peça, as cores e escreva o seu @ ou o nome do canal. A peça muda na hora, do jeito que sairia da nossa impressora.</p>
        </div>
        <div class="field"><span>Peça</span><div class="seg-ctl" id="kbPiece" role="group" aria-label="Peça"><button type="button" data-p="mic" aria-pressed="true">Mini microfone</button><button type="button" data-p="clap" aria-pressed="false">Claquete</button></div></div>
        <div class="field"><span id="lblMain">Cor do microfone</span><div class="swatches" id="swMain" role="group" aria-label="Cor principal"></div></div>
        <div class="field"><span id="lblBase">Cor do cubo</span><div class="swatches" id="swBase" role="group" aria-label="Segunda cor"></div></div>
        <label class="field" for="kbName"><span>Seu @ ou nome do canal</span><input id="kbName" maxlength="16" value="@seuperfil" autocomplete="off"></label>
        <p class="spec">Simulação ilustrativa. A peça real é modelada com a sua logo.</p>
      </div>
    </div>
  </section>

  <section id="ideias">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">Para quem é</p>
        <h2>Para quem grava todo dia</h2>
      </div>
      <div class="uses">
        <article class="use"><span class="use-tag">Influenciadores</span><h3>Vídeos com a sua cara</h3><p>Para quem grava reels, stories e vídeos na rua. O seu @ aparece em todo conteúdo, mesmo quando ele é repostado.</p></article>
        <article class="use"><span class="use-tag">Podcasts e entrevistas</span><h3>Microfone do programa</h3><p>Microfone e claquete com o nome do programa para os cortes, as entrevistas e os bastidores.</p></article>
        <article class="use"><span class="use-tag">Reportagem e vox pop</span><h3>Entrevista na rua</h3><p>O formato de microfone de repórter deixa claro de qual canal é a entrevista, para quem responde e para quem assiste.</p></article>
        <article class="use"><span class="use-tag">Empresas</span><h3>Conteúdo da marca</h3><p>Para equipes de social media, eventos e lançamentos. Toda gravação sai com a logo da empresa à vista.</p></article>
      </div>
      <p class="note" style="margin-top:28px;text-align:center">Conte qual microfone de lapela você usa e a gente confirma o encaixe antes de produzir.</p>
    </div>
  </section>

  <section id="processo" class="band">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">Como trabalhamos</p>
        <h2>Da ideia à peça na sua gravação</h2>
      </div>
      <div class="pp" id="pp">
        <div class="pp-steps" role="tablist" aria-label="Etapas">
          <div class="pp-line"><i id="ppFill"></i></div>
          <button type="button" role="tab" class="pp-step" data-i="0" aria-selected="true"><b>01</b><strong>Conversa</strong></button>
          <button type="button" role="tab" class="pp-step" data-i="1" aria-selected="false"><b>02</b><strong>Modelagem 3D</strong></button>
          <button type="button" role="tab" class="pp-step" data-i="2" aria-selected="false"><b>03</b><strong>Aprovação</strong></button>
          <button type="button" role="tab" class="pp-step" data-i="3" aria-selected="false"><b>04</b><strong>Produção</strong></button>
          <button type="button" role="tab" class="pp-step" data-i="4" aria-selected="false"><b>05</b><strong>Entrega</strong></button>
        </div>
        <div class="pp-panel" role="tabpanel" aria-live="polite">
          <div class="pp-visual">
            <div class="pp-v on" data-v="0">
              <div class="pv-chat">
                <p class="pv-in">Oi! Quero um mini microfone com o @ da minha página.</p>
                <p class="pv-out">Perfeito! Qual microfone de lapela você usa e quais as cores da sua marca?</p>
                <p class="pv-in">Um sem fio pequeno. Preto e rosa.</p>
                <p class="pv-out">Já tenho uma ideia: microfone preto com cubo rosa e o seu @.</p>
              </div>
            </div>
            <div class="pp-v" data-v="1">
              <svg class="pv-wire" viewBox="0 0 200 200" aria-hidden="true">
                <g fill="none" stroke="#B88BFF" stroke-width="1.1">
                  <circle cx="100" cy="62" r="30"/>
                  <ellipse cx="100" cy="62" rx="30" ry="10"/><ellipse cx="100" cy="62" rx="10" ry="30"/><ellipse cx="100" cy="62" rx="21" ry="30" opacity=".6"/>
                  <path d="M72 96h56v40H72zM72 96l10-8h56l-10 8M128 96l10-8v40l-10 8" />
                  <path d="M92 136v44h16v-44" opacity=".8"/><path d="M100 136v44" opacity=".4"/>
                </g>
                <g fill="#B88BFF"><circle cx="72" cy="96" r="2.4"/><circle cx="128" cy="96" r="2.4"/><circle cx="72" cy="136" r="2.4"/><circle cx="128" cy="136" r="2.4"/><circle cx="100" cy="32" r="2.4"/><circle cx="138" cy="88" r="2.4"/></g>
                <text x="100" y="196" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="#A39DB0">mini_microfone.stl</text>
              </svg>
            </div>
            <div class="pp-v" data-v="2">
              <div class="pv-chat">
                <p class="pv-out pv-img"><span class="pv-prev" aria-hidden="true"><svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#f7eef3"/><rect x="73" y="52" width="14" height="52" rx="6" fill="#1C1B21"/><circle cx="80" cy="28" r="18" fill="#1C1B21"/><rect x="56" y="42" width="48" height="32" rx="3" fill="#F48FB1"/><text x="80" y="61" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="700" font-size="7" fill="#3A1C61">@SEUPERFIL</text></svg></span>Segue a prévia da peça com o seu @.</p>
                <p class="pv-in">Ficou incrível! Aprovado.</p>
              </div>
            </div>
            <div class="pp-v" data-v="3">
              <div class="pv-print" aria-label="Animação da impressora 3D imprimindo um mini microfone">
                <svg viewBox="0 0 240 180" aria-hidden="true">
                  <rect x="20" y="14" width="200" height="152" rx="10" fill="#15131B" stroke="#2B2735"/>
                  <rect x="34" y="34" width="172" height="5" rx="2" fill="#2B2735"/>
                  <defs><clipPath id="pvClip"><rect class="pv-cliprect" x="80" y="66" width="80" height="74"/></clipPath></defs>
                  <g class="pv-headY"><g class="pv-head"><rect x="-12" y="28" width="24" height="18" rx="3" fill="#3A1C61" stroke="#B88BFF"/><path d="M-3 46h6l-3 6z" fill="#B88BFF"/><circle cx="0" cy="55" r="2.2" fill="#E9DBFF" class="pv-hot"/></g></g>
                  <rect x="54" y="140" width="132" height="6" rx="2" fill="#3A3445"/>
                  <g class="pv-obj" clip-path="url(#pvClip)">
                    <rect x="114" y="104" width="12" height="36" rx="5" fill="#1C1B21"/>
                    <rect x="102" y="88" width="36" height="22" rx="3" fill="#F48FB1"/>
                    <circle cx="120" cy="80" r="13" fill="#1C1B21"/>
                  </g>
                  <g stroke="#ffffff" stroke-opacity=".07"><path d="M90 136h60"/><path d="M90 131h60"/><path d="M90 126h60"/><path d="M90 121h60"/><path d="M90 116h60"/><path d="M90 111h60"/><path d="M90 106h60"/><path d="M90 101h60"/><path d="M90 96h60"/><path d="M90 91h60"/><path d="M90 86h60"/><path d="M90 81h60"/><path d="M90 76h60"/><path d="M90 71h60"/></g>
                </svg>
                <div class="pv-bar"><i></i></div>
                <span class="pv-pct">Imprimindo o lote</span>
              </div>
            </div>
            <div class="pp-v" data-v="4">
              <div class="pv-ship" aria-label="Animação das peças sendo embaladas">
                <svg viewBox="0 0 240 180" aria-hidden="true">
                  <g class="pv-item pv-i1"><rect x="93" y="62" width="6" height="16" rx="2" fill="#1C1B21"/><circle cx="96" cy="56" r="7" fill="#1C1B21"/><rect x="88" y="60" width="16" height="10" rx="1.5" fill="#F48FB1"/></g>
                  <g class="pv-item pv-i2"><rect x="129" y="62" width="6" height="16" rx="2" fill="#1C1B21"/><circle cx="132" cy="56" r="7" fill="#1C1B21"/><rect x="124" y="60" width="16" height="10" rx="1.5" fill="#EDEBF0"/></g>
                  <g class="pv-item pv-i3"><rect x="104" y="58" width="22" height="14" rx="1.5" fill="#1C1B21"/><rect x="104" y="53" width="22" height="5" fill="#EDEBF0"/></g>
                  <rect x="70" y="92" width="100" height="62" rx="4" fill="#C9A27A"/>
                  <rect x="70" y="92" width="100" height="10" fill="#B48C64"/>
                  <rect x="112" y="92" width="16" height="62" fill="#E2C49F" opacity=".7"/>
                  <g class="pv-flap pv-fl"><rect x="70" y="80" width="50" height="12" rx="2" fill="#B48C64"/></g>
                  <g class="pv-flap pv-fr"><rect x="120" y="80" width="50" height="12" rx="2" fill="#B48C64"/></g>
                  <g transform="translate(112.5 106) scale(.27)"><polygon points="0,2 27,31 0,58" fill="#D6D5DC"/><polygon points="56,0 56,58 6,58" fill="#8E3BF5"/><polygon points="0,58 56,58 28,84" fill="#3A1C61"/></g>
                  <text x="120" y="142" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="700" font-size="9" fill="#5c4027">MAC3DOS</text>
                </svg>
                <span class="pv-ok">Pronto para gravar</span>
              </div>
            </div>
          </div>
          <div class="pp-text">
            <b class="pp-num" id="ppNum">01 / 05</b>
            <h3 id="ppTitle">Conversa</h3>
            <p id="ppDesc">Entendemos como você grava, qual microfone usa e as cores da sua marca.</p>
            <div class="pp-nav">
              <button type="button" id="ppPrev" aria-label="Etapa anterior">←</button>
              <button type="button" id="ppNext" aria-label="Próxima etapa">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="contato">
    <div class="wrap cta">
      <p class="eyebrow">Vamos conversar</p>
      <h2>Vamos criar as peças da sua marca?</h2>
      <p class="lead">Conte como você grava e a gente cria a peça com a cara da sua marca.</p>
      <div class="cta-btns">
        <a class="btn btn-primary" href="https://wa.me/5521985101880?text=Ol%C3%A1%2C%20MAC3DOS!%20Vi%20o%20cat%C3%A1logo%20de%20criadores%20de%20conte%C3%BAdo%20e%20quero%20conversar." target="_blank" rel="noopener">Chamar no WhatsApp</a>
        <a class="btn btn-ghost" href="https://www.instagram.com/mac3dos/" target="_blank" rel="noopener">Ver o Instagram</a>
      </div>
      <p class="cta-contact">WhatsApp (21) 98510-1880 · @mac3dos</p>
    </div>
  </section>
</main>

`;

// script: reaproveita os blocos genéricos do catálogo de estética e troca o 3D
const sStart = src.indexOf('<script>', iThree) + '<script>'.length;
const js = src.slice(sStart, src.lastIndexOf('</script>'));
const cut = (a, b) => { const i = js.indexOf(a), j = js.indexOf(b, i); if (i < 0 || j < 0) throw new Error('bloco não achado: ' + a); return js.slice(i, j); };
const nfc = cut('// ---------- NFC:', '// Vídeos tocam sozinhos');
const play = cut('// Vídeos tocam sozinhos', 'renderGallery(); startRotation();');
const reveal = cut('// ---------- Revelação em camadas', '// ---------- Como trabalhamos');
const proc = cut('// ---------- Como trabalhamos', '// ---------- simulador de ganho').replace(
  '["Conversa", "Entendemos o público, os serviços e as ações do seu espaço para sugerir o brinde certo."]',
  '["Conversa", "Entendemos como você grava, qual microfone usa e as cores da sua marca."]').replace(
  '"Brindes embalados e prontos para o balcão, com sugestão de uso."', '"Peças embaladas e prontas para a próxima gravação."').replace('"Imprimimos o lote no nosso estúdio. Nos brindes com NFC, também gravamos os chips."', '"Imprimimos as peças no nosso estúdio, nas cores da sua marca."');
const rest = js.slice(js.indexOf('// ---------- simulador de ganho'));
const sim = fs.readFileSync(path.join(__dirname, 'mic3d.js'), 'utf8');

const html = head + main + foot + iThree0() + '\n<script>\nconst $ = id => document.getElementById(id);\n\n' + play + '\n' + sim + '\n' + reveal + proc + rest + '</script>\n';
function iThree0(){ return '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'; }
fs.writeFileSync(path.join(dir, 'mac3dos-criadores.html'), html);
console.log('ok', html.length);
