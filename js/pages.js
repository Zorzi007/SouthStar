const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* Menu das páginas internas */
const NAV = [
  ['index.html', 'Início'], ['blog.html', 'Blog'], ['imprensa.html', 'Imprensa'],
  ['tour.html', 'Tour 360°'], ['carreiras.html', 'Carreiras'], ['index.html#contato', 'Contato']
];
const here = location.pathname.split('/').pop() || 'index.html';

$('#hdr').outerHTML = `
<header id="header" class="scrolled">
 <nav class="container" aria-label="Menu principal">
  <a href="index.html" class="logo">south<span>star</span></a>
  <ul class="menu" id="menu">
   ${NAV.map(([h, t]) => `<li><a href="${h}"${h === here ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}
  </ul>
  <div class="nav-tools">
   <button id="themeBtn" class="tool" aria-label="Alternar tema"></button>
   <button class="burger tool" id="burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><i data-lucide="menu"></i></button>
  </div>
 </nav>
</header>`;

$('#ftr').outerHTML = `
<footer>
 <div class="container grid">
  <div><a href="index.html" class="logo">south<span>star</span></a><p>Grafite natural em flocos, produzido no Brasil para o mundo.</p></div>
  <div><h4>Links</h4><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}<li><a href="privacidade.html">Política de Privacidade</a></li></ul></div>
  <div><h4>Mercado</h4><ul><li>TSXV: STS</li><li>OTCQB: STSBF</li></ul></div>
 </div>
 <p class="copy">© ${new Date().getFullYear()} South Star Battery Metals Corp. Todos os direitos reservados.</p>
</footer>`;

/* Tema */
const setTheme = t => {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('theme', t);
  $('#themeBtn').innerHTML = `<i data-lucide="${t === 'dark' ? 'sun' : 'moon'}"></i>`;
  lucide.createIcons();
};
$('#themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
setTheme(localStorage.getItem('theme') || 'dark');

/* Menu mobile */
const menu = $('#menu'), burger = $('#burger');
burger.onclick = () => burger.setAttribute('aria-expanded', menu.classList.toggle('open'));

/* Revelar ao rolar */
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
}), { threshold: .15 });
window.observeReveal = () => $$('.reveal:not(.show)').forEach(el => obs.observe(el));
observeReveal();

/* Formulários (Formspree) */
$$('form.ajax').forEach(f => f.addEventListener('submit', async e => {
  e.preventDefault();
  const m = f.querySelector('.form-msg');
  try {
    const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
    if (!r.ok) throw 0;
    m.style.color = '#4da3ff'; m.textContent = 'Enviado com sucesso!'; f.reset();
  } catch { m.style.color = '#ef4444'; m.textContent = 'Erro ao enviar. Tente novamente.'; }
}));
