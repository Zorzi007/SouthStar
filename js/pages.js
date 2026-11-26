const ROOT = new URL('../', document.currentScript.src).href;
const LOGO = ROOT + 'img/Logo%20SouthStar%20-%20White.png';
const HOME = ROOT + 'view/index.html';
const VIEW = ROOT + 'view/';

const IG = 'https://www.instagram.com/southstar_projetosantacruz/';
const LI = 'https://www.linkedin.com/company/southstarbatterymetals/';

const HEADER = `
<header id="header">
 <nav class="container" aria-label="Menu principal">
  <a href="${HOME}" class="logo" aria-label="South Star Battery Metals – início">
   <img src="${LOGO}" alt="South Star Battery Metals" width="180" height="46">
  </a>
  <ul class="menu" id="menu">
   <li class="has-sub">
    <button type="button" class="sub-btn" aria-expanded="false" aria-controls="sub-empresa"><span data-en="Company">Empresa</span> <i data-lucide="chevron-down"></i></button>
    <ul class="submenu" id="sub-empresa">
     <li><a href="${HOME}#sobre" data-en="About">Sobre</a></li>
     <li><a href="${HOME}#equipe" data-en="Management">Liderança</a></li>
     <li><a href="${HOME}#historia" data-en="History">Trajetória</a></li>
     <li><a href="${VIEW}carreiras.html" data-en="Careers">Carreiras</a></li>
    </ul>
   </li>
   <li class="has-sub">
    <button type="button" class="sub-btn" aria-expanded="false" aria-controls="sub-projetos"><span data-en="Projects">Projetos</span> <i data-lucide="chevron-down"></i></button>
    <ul class="submenu" id="sub-projetos">
     <li><a href="${HOME}#projetos">Santa Cruz</a></li>
     <li><a href="${HOME}#grafite" data-en="Why graphite?">Por que grafite?</a></li>
     <li><a href="${HOME}#cadeia" data-en="From mine to battery">Da mina à bateria</a></li>
     <li><a href="${HOME}#galeria" data-en="Gallery">Galeria</a></li>
     <li><a href="${VIEW}tour.html" data-en="360° virtual tour">Tour virtual 360°</a></li>
    </ul>
   </li>
   <li class="has-sub">
    <button type="button" class="sub-btn" aria-expanded="false" aria-controls="sub-produtos"><span data-en="Products">Produtos</span> <i data-lucide="chevron-down"></i></button>
    <ul class="submenu" id="sub-produtos">
     <li><a href="${HOME}#produto" data-en="Specifications">Especificações</a></li>
     <li><a href="${HOME}#comercial" data-en="Buy graphite">Comprar grafite</a></li>
    </ul>
   </li>
   <li class="has-sub">
    <button type="button" class="sub-btn" aria-expanded="false" aria-controls="sub-esg"><span data-en="Sustainability">Sustentabilidade</span> <i data-lucide="chevron-down"></i></button>
    <ul class="submenu" id="sub-esg">
     <li><a href="${HOME}#esg" data-en="ESG &amp; Safety">ESG e Segurança</a></li>
     <li><a href="${HOME}#painel-esg" data-en="ESG Dashboard">Painel ESG</a></li>
    </ul>
   </li>
   <li class="has-sub">
    <button type="button" class="sub-btn" aria-expanded="false" aria-controls="sub-inv"><span data-en="Investors">Investidores</span> <i data-lucide="chevron-down"></i></button>
    <ul class="submenu" id="sub-inv">
     <li><a href="${HOME}#investidores" data-en="Overview">Visão geral</a></li>
     <li><a href="${HOME}#recursos" data-en="Mineral Resources">Recursos Minerais</a></li>
     <li><a href="${HOME}#ferramentas" data-en="Investor Tools">Ferramentas</a></li>
    </ul>
   </li>
   <li class="has-sub">
    <button type="button" class="sub-btn" aria-expanded="false" aria-controls="sub-news"><span data-en="News">Notícias</span> <i data-lucide="chevron-down"></i></button>
    <ul class="submenu" id="sub-news">
     <li><a href="${HOME}#noticias" data-en="Latest Updates">Últimas atualizações</a></li>
     <li><a href="${VIEW}blog.html">Blog</a></li>
    </ul>
   </li>
   <li><a href="${HOME}#contato" data-en="Contact">Contato</a></li>
  </ul>
  <div class="nav-tools">
   <button id="langBtn" class="tool" type="button" aria-label="Mudar idioma">EN</button>
   <button class="burger tool" id="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><i data-lucide="menu"></i></button>
  </div>
 </nav>
</header>`;

const FOOTER = `
<footer class="footer">
 <div class="container">
  <div class="ft-top">
   <a href="${HOME}" class="ft-logo" aria-label="South Star Battery Metals – início">
    <img src="${LOGO}" alt="South Star Battery Metals" width="200" height="50" loading="lazy">
   </a>
   <div class="ft-social">
    <a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram">
     <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
    </a>
    <a href="${LI}" target="_blank" rel="noopener" aria-label="LinkedIn">
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
    </a>
   </div>
  </div>
  <nav class="ft-grid" aria-label="Rodapé">
   <div><h4 data-en="Company">Empresa</h4>
    <a href="${HOME}#sobre" data-en="About">Sobre</a>
    <a href="${HOME}#equipe" data-en="Management">Liderança</a>
    <a href="${HOME}#projetos" data-en="Projects">Projetos</a>
    <a href="${HOME}#produto" data-en="Products">Produtos</a>
    <a href="${HOME}#esg" data-en="Sustainability">Sustentabilidade</a>
    <a href="${VIEW}carreiras.html" data-en="Careers">Carreiras</a></div>
   <div><h4 data-en="Investors">Investidores</h4>
    <a href="${HOME}#investidores" data-en="Overview">Visão geral</a>
    <a href="${HOME}#recursos" data-en="Mineral Resources">Recursos Minerais</a>
    <a href="${HOME}#ferramentas" data-en="Tools">Ferramentas</a>
    <a href="${HOME}#noticias" data-en="News">Notícias</a>
    <a href="${VIEW}blog.html">Blog</a></div>
   <div><h4 data-en="Contact">Contato</h4>
    <a href="mailto:info@southstarbatterymetals.com">info@southstarbatterymetals.com</a>
    <a href="${HOME}#comercial" data-en="Buy graphite">Comprar grafite</a>
    <a href="${HOME}#contato" data-en="Send a message">Enviar mensagem</a>
    <a href="${VIEW}privacidade.html" data-en="Privacy Policy">Política de Privacidade</a></div>
   <div><h4 data-en="Social">Redes sociais</h4>
    <a href="${IG}" target="_blank" rel="noopener">Instagram</a>
    <a href="${LI}" target="_blank" rel="noopener">LinkedIn</a></div>
  </nav>
  <div class="ft-bottom">
   <small>© ${new Date().getFullYear()} South Star Battery Metals. <span data-en="All rights reserved.">Todos os direitos reservados.</span></small>
  </div>
 </div>
</footer>`;

(() => {
    const hdr = document.getElementById('hdr');
    const ftr = document.getElementById('ftr');

    if (hdr) hdr.outerHTML = HEADER;
    if (ftr) ftr.outerHTML = FOOTER;

    /* Marca a página atual no menu */
    const here = location.pathname.replace(/\/$/, '/index.html');
    document.querySelectorAll('#menu a').forEach(a => {
        const url = new URL(a.href);
        if (!url.hash && url.pathname === here) {
            a.setAttribute('aria-current', 'page');
            a.closest('.has-sub')?.querySelector('.sub-btn')?.classList.add('active');
        }
    });
})();