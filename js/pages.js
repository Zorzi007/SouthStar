const ROOT = new URL('../', document.currentScript.src).href;
const LOGO = ROOT + 'img/Logo SouthStar - White.png';
const HOME = ROOT + 'view/index.html';
const BLOG = ROOT + 'view/blog.html';

const HEADER = `
<header id="header">
 <nav class="container" aria-label="Menu principal">
  <a href="${HOME}" class="logo" aria-label="South Star Battery Metals – início">
   <img src="${LOGO}" alt="South Star Battery Metals" width="180" height="46">
  </a>
  <ul class="menu" id="menu">
   <li><a href="${HOME}#sobre" data-en="About">Sobre</a></li>
   <li><a href="${HOME}#produto" data-en="Product">Produto</a></li>
   <li><a href="${HOME}#comercial" data-en="Sales">Comercial</a></li>
   <li><a href="${HOME}#investidores" data-en="Investors">Investidores</a></li>
   <li><a href="${HOME}#ferramentas" data-en="Tools">Ferramentas</a></li>
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
    <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
     <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
    </a>
    <a href="https://linkedin.com/company/" target="_blank" rel="noopener" aria-label="LinkedIn">
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
    </a>
   </div>
  </div>
  <nav class="ft-grid" aria-label="Rodapé">
   <div><h4 data-en="Company">Empresa</h4>
    <a href="${HOME}#sobre" data-en="About">Sobre</a>
    <a href="${HOME}#produto" data-en="Product">Produto</a>
    <a href="${HOME}#comercial" data-en="Sales">Comercial</a></div>
   <div><h4 data-en="Investors">Investidores</h4>
    <a href="${HOME}#investidores" data-en="Overview">Visão geral</a>
    <a href="${HOME}#ferramentas" data-en="Tools">Ferramentas</a>
    <a href="${BLOG}">Blog</a></div>
   <div><h4 data-en="Contact">Contato</h4>
    <a href="mailto:info@southstarbatterymetals.com">info@southstarbatterymetals.com</a>
    <a href="${HOME}#contato" data-en="Send a message">Enviar mensagem</a></div>
   <div><h4 data-en="Social">Redes sociais</h4>
    <a href="https://instagram.com/" target="_blank" rel="noopener">Instagram</a>
    <a href="https://linkedin.com/company/" target="_blank" rel="noopener">LinkedIn</a></div>
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
})();