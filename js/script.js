const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('lang') || 'pt';

/* Cores da marca */
const C = { star: '#4da3ff', royal: '#1f4fd1', navy: '#0a1a4a', ice: '#9cc9ff' };

/* Preloader */
window.addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('hide'), 400));

/* Ícones */
lucide.createIcons();

/* Tema */
const setTheme = t => {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('theme', t);
  $('#themeBtn').innerHTML = `<i data-lucide="${t === 'dark' ? 'sun' : 'moon'}"></i>`;
  lucide.createIcons();
  if (window.Chart) renderCharts();
};
$('#themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');

/* Idiomas */
{
  $$('[data-en]').forEach(el => {
    if (el.dataset.pt === undefined) el.dataset.pt = el.innerHTML;
    el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.pt;
  });
  $$('[data-en-ph]').forEach(el => {
    if (!el.dataset.ptPh) el.dataset.ptPh = el.placeholder;
    el.placeholder = lang === 'en' ? el.dataset.enPh : el.dataset.ptPh;
  });
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  $('#langBtn').textContent = lang === 'en' ? 'PT' : 'EN';
  localStorage.setItem('lang', lang);
  renderNews();
  lucide.createIcons();
  if (window.Chart) renderCharts();
}
/* Idiomas: PT → EN → ES */
const LANGS = ['pt', 'en', 'es'];
if (!LANGS.includes(lang)) lang = 'pt';
const tr = (pt, en) => lang === 'pt' ? pt : lang === 'en' ? en : ((window.ES || {})[en] || en);
function applyLang() {
  $$('[data-en]').forEach(el => {
    if (el.dataset.pt === undefined) el.dataset.pt = el.innerHTML;
    el.innerHTML = tr(el.dataset.pt, el.dataset.en);
  });
  $$('[data-en-ph]').forEach(el => {
    if (!el.dataset.ptPh) el.dataset.ptPh = el.placeholder;
    el.placeholder = tr(el.dataset.ptPh, el.dataset.enPh);
  });
  document.documentElement.lang = { pt: 'pt-BR', en: 'en', es: 'es' }[lang];
  $('#langBtn').textContent = LANGS[(LANGS.indexOf(lang) + 1) % 3].toUpperCase();
  localStorage.setItem('lang', lang);
  renderNews();
  lucide.createIcons();
  if (window.Chart) renderCharts();
}
$('#langBtn').onclick = () => { lang = LANGS[(LANGS.indexOf(lang) + 1) % 3]; applyLang(); };

/* Header, menu e topo */
const header = $('#header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 50);
  $('#toTop').classList.toggle('show', scrollY > 600);
});
$('#toTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
const menu = $('#menu'), burger = $('#burger');
burger.onclick = () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
};
menu.querySelectorAll('a').forEach(a => a.onclick = () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
});

/* Revelar ao rolar */
const revealObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); revealObs.unobserve(e.target); }
}), { threshold: .15 });
$$('.reveal').forEach(el => revealObs.observe(el));

/* Contadores */
const countObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, target = +el.dataset.target, suf = el.dataset.suffix || '';
  let cur = 0;
  const step = target / 60;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur).toLocaleString(lang === 'en' ? 'en-US' : 'pt-BR') + suf;
  }, 25);
  countObs.unobserve(el);
}), { threshold: .5 });
$$('.count').forEach(el => countObs.observe(el));

/* GSAP */
if (!reduced && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-content > *', { y: 50, opacity: 0, duration: 1, stagger: .15, delay: .6, ease: 'power3.out' });
  gsap.to('.hero-video', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.parallax', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.parallax-wrap', scrub: true } });
}

/* Cursor */
const cursor = $('.cursor');
if (matchMedia('(pointer:fine)').matches && !reduced) {
  window.addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });
  $$('a,button,.gallery img').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
  });
}

/* Gráficos */
let charts = [];
function renderCharts() {
  charts.forEach(c => c.destroy());
  const css = getComputedStyle(document.documentElement);
  const txt = css.getPropertyValue('--text').trim();
  const grid = css.getPropertyValue('--border').trim();
  const cardBg = css.getPropertyValue('--card').trim();
  Chart.defaults.color = txt;
  Chart.defaults.font.family = 'Inter';
  const en = lang === 'en';
  const opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: grid } }, y: { grid: { color: grid }, beginAtZero: true } } };

  const pc = $('#prodChart').getContext('2d');
  const barGrad = pc.createLinearGradient(0, 0, 0, 280);
  barGrad.addColorStop(0, C.star);
  barGrad.addColorStop(1, C.royal);

  const cc = $('#costChart').getContext('2d');
  const areaGrad = cc.createLinearGradient(0, 0, 0, 260);
  areaGrad.addColorStop(0, 'rgba(77,163,255,.45)');
  areaGrad.addColorStop(1, 'rgba(31,79,209,0)');

  charts = [
    new Chart(pc, {
      type: 'bar',
      data: {
        labels: en ? ['Phase 1', '2027 target', 'Permitted'] : ['Fase 1', 'Meta 2027', 'Licença'],
        datasets: [{ data: [5000, 10000, 50000], backgroundColor: [C.star, C.royal, barGrad], borderRadius: 8 }]
      },
      options: { ...opts, plugins: { legend: { display: false }, title: { display: true, text: en ? 'Capacity (t/yr)' : 'Capacidade (t/ano)' } } }
    }),
    new Chart(cc, {
      type: 'line',
      data: {
        labels: en ? ['Before restart', 'After restart'] : ['Antes da retomada', 'Após a retomada'],
        datasets: [{ data: [2000, 800], borderColor: C.star, backgroundColor: areaGrad, fill: true, tension: .4, pointRadius: 6, pointBackgroundColor: C.ice, pointBorderColor: C.royal }]
      },
      options: opts
    }),
    /* Estrutura acionária (ajuste os % reais) */
    new Chart($('#shareChart'), {
      type: 'doughnut',
      data: {
        labels: en ? ['CEO (Tiago Cunha)', 'Institutional', 'Free float'] : ['CEO (Tiago Cunha)', 'Institucionais', 'Free float'],
        datasets: [{ data: [40, 20, 40], backgroundColor: [C.star, C.royal, C.navy], borderColor: cardBg, borderWidth: 3 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
    })
  ];
}

/* Mapas */
const tiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const attr = { attribution: '© OpenStreetMap © CARTO' };
const starIcon = L.divIcon({ className: '', iconSize: [18, 18], html: `<div style="width:18px;height:18px;background:${C.star};border:3px solid #fff;border-radius:50%;box-shadow:0 0 15px ${C.star}"></div>` });
const portIcon = L.divIcon({ className: '', iconSize: [14, 14], html: `<div style="width:14px;height:14px;background:${C.royal};border:2px solid #fff;border-radius:50%"></div>` });

/* Mapa Santa Cruz */
const map = L.map('map', { scrollWheelZoom: false }).setView([-14.9, -39.0], 7);
L.tileLayer(tiles, attr).addTo(map);
L.marker([-16.28, -39.03], { icon: starIcon }).addTo(map).bindPopup('<b>Mina Santa Cruz</b><br>Sul da Bahia').openPopup();
L.marker([-14.78, -39.03], { icon: portIcon }).addTo(map).bindPopup('Porto de Ilhéus');
L.marker([-12.97, -38.51], { icon: portIcon }).addTo(map).bindPopup('Porto de Salvador');
L.polyline([[-16.28, -39.03], [-14.78, -39.03], [-12.97, -38.51]], { color: C.star, dashArray: '6 8' }).addTo(map);

/* Mapa logístico mundial */
const wm = L.map('worldMap', { scrollWheelZoom: false, worldCopyJump: true }).setView([15, -30], 2);
L.tileLayer(tiles, attr).addTo(wm);
const origin = [-14.78, -39.03];
L.marker(origin, { icon: starIcon }).addTo(wm).bindPopup('<b>Porto de Ilhéus</b><br>Origem');
[['Houston, EUA', [29.76, -95.36]], ['Roterdã, Europa', [51.92, 4.48]], ['Busan, Ásia', [35.1, 129.04]]].forEach(([n, p]) => {
  L.marker(p, { icon: portIcon }).addTo(wm).bindPopup(n);
  L.polyline([origin, p], { color: C.star, weight: 2, dashArray: '6 8' }).addTo(wm);
});

/* Calculadora */
const calc = () => {
  const inv = +$('#cInv').value, buy = +$('#cBuy').value, now = +$('#cNow').value;
  if (!buy) { $('#cRes').textContent = 'Informe o preço de compra.'; return; }
  const qty = Math.floor(inv / buy), total = qty * now, pct = (now / buy - 1) * 100;
  const f = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'CAD' });
  $('#cRes').innerHTML = `${qty.toLocaleString('pt-BR')} ações<b>${f(total)}</b>${pct >= 0 ? '▲' : '▼'} ${pct.toFixed(1)}% (${f(total - qty * buy)})`;
};
['#cInv', '#cBuy', '#cNow'].forEach(s => $(s).addEventListener('input', calc));
calc();

/* Notícias */
const news = [
  { d: 'Ago/2026', de: 'Aug 2026', c: 'op', pt: ['Primeiro pedido após a retomada', 'Custo caixa cai 60% e a produção volta três meses antes do previsto.'], en: ['First purchase order after restart', 'Cash cost down 60%, restart three months ahead of schedule.'] },
  { d: 'Ago/2026', de: 'Aug 2026', c: 'fin', pt: ['Resultados do 2º trimestre de 2026', 'Publicado o MD&A do semestre encerrado em 30/06/2026.'], en: ['Q2 2026 results', 'MD&A for the period ended June 30, 2026 published.'] },
  { d: 'Mai/2026', de: 'May 2026', c: 'fin', pt: ['Nova apresentação corporativa', 'Apresentação "Graphite for the Future" disponível.'], en: ['New corporate presentation', '"Graphite for the Future" deck available.'] },
  { d: 'Mar/2026', de: 'Mar 2026', c: 'op', pt: ['Scrubber/trommel instalado', 'Equipamento aumenta a confiabilidade da planta.'], en: ['Scrubber/trommel installed', 'Equipment increases plant reliability.'] },
  { d: 'Mar/2026', de: 'Mar 2026', c: 'corp', pt: ['Novo COO', 'Rogerio Barcellos é promovido a Diretor de Operações.'], en: ['New COO', 'Rogerio Barcellos promoted to Chief Operating Officer.'] },
  { d: 'Set/2025', de: 'Sep 2025', c: 'corp', pt: ['Mudança na liderança', 'Tiago Cunha assume como Presidente e CEO.'], en: ['Leadership change', 'Tiago Cunha appointed President & CEO.'] },
  { d: 'Mai/2025', de: 'May 2025', c: 'op', pt: ['Primeiro embarque', 'Primeira nova produção de grafite das Américas desde 1996.'], en: ['First shipment', 'First new graphite production in the Americas since 1996.'] },
  { d: 'Dez/2024', de: 'Dec 2024', c: 'op', pt: ['Inauguração oficial', 'A mina Santa Cruz é inaugurada na Bahia.'], en: ['Official inauguration', 'Santa Cruz mine inaugurated in Bahia.'] }
];
const catName = { op: ['Operação', 'Operations'], corp: ['Corporativo', 'Corporate'], fin: ['Financeiro', 'Financial'] };
let cat = 'all', page = 1;
const perPage = 3;
function renderNews() {
  const list = news.filter(n => cat === 'all' || n.c === cat);
  const pages = Math.ceil(list.length / perPage);
  if (page > pages) page = 1;
  const i = lang === 'en' ? 1 : 0, k = lang === 'en' ? 'en' : 'pt';
  $('#newsList').innerHTML = list.slice((page - 1) * perPage, page * perPage).map(n => `
    <article class="card"><div class="body">
      <small>${lang === 'en' ? n.de : n.d}</small><span class="cat">${catName[n.c][i]}</span>
      <h3>${n[k][0]}</h3><p>${n[k][1]}</p>
    </div></article>`).join('');
  $('#pagination').innerHTML = Array.from({ length: pages }, (_, x) =>
    `<button class="${x + 1 === page ? 'active' : ''}" aria-label="Página ${x + 1}">${x + 1}</button>`).join('');
  $$('#pagination button').forEach((b, x) => b.onclick = () => { page = x + 1; renderNews(); });
}
$$('.filter').forEach(b => b.onclick = () => {
  $$('.filter').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  cat = b.dataset.cat;
  page = 1;
  renderNews();
});

/* Lightbox */
const lb = $('#lightbox');
$$('.gallery img').forEach(img => {
  img.tabIndex = 0;
  const open = () => { lb.querySelector('img').src = img.src.replace('w=800', 'w=1600'); lb.querySelector('img').alt = img.alt; lb.classList.add('open'); };
  img.onclick = open;
  img.onkeydown = e => e.key === 'Enter' && open();
});
lb.onclick = e => { if (e.target !== lb.querySelector('img')) lb.classList.remove('open'); };
document.addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('open'));

/* Envio genérico via Formspree */
async function sendForm(f, m, okTxt, errTxt) {
  try {
    const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
    if (!r.ok) throw 0;
    m.style.color = C.star; m.textContent = okTxt; f.reset();
    return true;
  } catch {
    m.style.color = '#ef4444'; m.textContent = errTxt;
    return false;
  }
}

/* Formulário de contato */
const form = $('#form'), msg = $('#msg');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const en = lang === 'en';
  if (window.grecaptcha && !grecaptcha.getResponse()) {
    msg.style.color = '#ef4444';
    msg.textContent = en ? 'Please confirm the reCAPTCHA.' : 'Confirme o reCAPTCHA.';
    return;
  }
  const ok = await sendForm(form, msg,
    en ? 'Message sent successfully!' : 'Mensagem enviada com sucesso!',
    en ? 'Error sending. Please try again.' : 'Erro ao enviar. Tente novamente.');
  if (ok && window.grecaptcha) grecaptcha.reset();
});

/* Formulários de alertas e cotação */
$$('#alertForm, #quoteForm').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  const en = lang === 'en';
  sendForm(f, f.querySelector('.form-msg'),
    en ? 'Sent successfully!' : 'Enviado com sucesso!',
    en ? 'Error sending. Please try again.' : 'Erro ao enviar. Tente novamente.');
}));

/* Cookies e Analytics */
function loadAnalytics() {
  const s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = 'southstarbatterymetals.com';
  s.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(s);
}
const consent = localStorage.getItem('cookies');
if (consent === 'yes') loadAnalytics();
else if (!consent) $('#cookie').classList.add('show');
$('#cookieYes').onclick = () => { localStorage.setItem('cookies', 'yes'); $('#cookie').classList.remove('show'); loadAnalytics(); };
$('#cookieNo').onclick = () => { localStorage.setItem('cookies', 'no'); $('#cookie').classList.remove('show'); };

/* Inicialização */
$('#year').textContent = new Date().getFullYear();
setTheme(localStorage.getItem('theme') || 'dark');
applyLang();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');