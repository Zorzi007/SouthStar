/* =========================================================
   South Star Battery Metals – script.js
   ========================================================= */
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const C = {
  accent: '#4da3ff',
  accent2: '#22d3ee',
  blue: '#1f4fd1',
  mine: [-16.08, -39.60],      // Mina Santa Cruz (aprox.)
  port: [-14.79, -39.03]       // Porto de Ilhéus (aprox.)
};

const icons = () => window.lucide && lucide.createIcons();
const safe = (name, fn) => { try { fn(); } catch (e) { console.error(`[${name}]`, e); } };
const isEN = () => document.documentElement.lang === 'en';
const t = (pt, en) => (isEN() ? en : pt);
const cssVar = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

/* ---------- Tela de carregamento entre páginas ---------- */
(() => {
  const html = document.documentElement;
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-label', 'Carregando');
  loader.innerHTML = '<i></i>';
  document.body.appendChild(loader);

  const MINIMO = 600; // tempo mínimo da tela (ms)
  const inicio = performance.now();
  let saiu = false;

  /* Some de uma vez, sem fade: evita ver a bolinha e o conteúdo juntos */
  const esconder = () => {
    loader.style.transition = 'none';
    loader.classList.remove('on');
    html.classList.remove('loading');
    void loader.offsetWidth; // aplica a mudança antes de restaurar a transição
    loader.style.transition = '';
  };

  const sair = () => {
    if (saiu) return;
    saiu = true;
    const espera = Math.max(0, MINIMO - (performance.now() - inicio));
    setTimeout(esconder, espera);
  };

  /* Chegou por clique interno: espera carregar (ou 8 s, por segurança) */
  if (sessionStorage.getItem('nav')) {
    sessionStorage.removeItem('nav');
    loader.classList.add('on');
    document.readyState === 'complete' ? sair() : addEventListener('load', sair);
    setTimeout(sair, 8000);
  } else {
    html.classList.remove('loading');
  }

  /* Clique em link interno para outra página */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;

    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname || !/^https?:$/.test(url.protocol)) return;

    sessionStorage.setItem('nav', '1');
    loader.classList.add('on');
  });

  /* Botão "voltar": página restaurada do cache não fica travada */
  addEventListener('pageshow', e => {
    if (e.persisted) { saiu = false; esconder(); }
  });
})();


/* ---------- Ícones ---------- */
icons();

/* ---------- Tema (somente claro) ---------- */
localStorage.removeItem('theme');

/* ---------- Idioma ---------- */
function applyLang() {
  const en = localStorage.getItem('lang') === 'en' ||
             new URLSearchParams(location.search).get('lang') === 'en';
  document.documentElement.lang = en ? 'en' : 'pt-BR';

  $$('[data-en]').forEach(el => {
    if (el.dataset.pt === undefined) el.dataset.pt = el.innerHTML;
    el.innerHTML = en ? el.dataset.en : el.dataset.pt;
  });
  $$('[data-en-ph]').forEach(el => {
    if (el.dataset.ptPh === undefined) el.dataset.ptPh = el.placeholder;
    el.placeholder = en ? el.dataset.enPh : el.dataset.ptPh;
  });

  const btn = $('#langBtn');
  if (btn) btn.textContent = en ? 'PT' : 'EN';

  icons();
  safe('notícias', renderNews);
  safe('calculadora', calc);
  safe('gráficos', () => window.Chart && renderCharts());
}
$('#langBtn')?.addEventListener('click', () => {
  localStorage.setItem('lang', isEN() ? 'pt' : 'en');
  const url = new URL(location);
  url.searchParams.delete('lang');
  history.replaceState(null, '', url);
  applyLang();
});

/* ---------- Menu mobile ---------- */
const burger = $('#burger'), menu = $('#menu');
burger?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`;
  icons();
});
$$('#menu a').forEach(a => a.addEventListener('click', () => {
  menu?.classList.remove('open');
  burger?.setAttribute('aria-expanded', 'false');
  if (burger) { burger.innerHTML = '<i data-lucide="menu"></i>'; icons(); }
}));

/* ---------- Header / voltar ao topo ---------- */
const header = $('#header'), toTop = $('#toTop');
const onScroll = () => {
  const y = scrollY;
  header?.classList.toggle('scrolled', y > 50);
  toTop?.classList.toggle('show', y > 600);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Reveal + contadores + barras ESG ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const COUNT_SEL = '.count, .counter, [data-target], [data-count]';

function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const target = parseFloat(el.dataset.target ?? el.dataset.count ?? '0') || 0;
  const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  const dec = (String(target).split('.')[1] || '').length;
  const fmt = n => pre + n.toLocaleString(isEN() ? 'en-US' : 'pt-BR',
    { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
  if (reduce) return (el.textContent = fmt(target));
  const start = performance.now(), dur = 1800;
  const step = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target;
  if (el.matches(COUNT_SEL)) countUp(el);
  else el.classList.add(el.classList.contains('bar') ? 'on' : 'show');
  io.unobserve(el);
}), { threshold: 0.1 });

/* Observa elementos novos (usado também pelo blog) */
function observeReveal() {
  $$(`.reveal:not(.show), .bar:not(.on), ${COUNT_SEL}`).forEach(el => {
    if (!el.dataset.done) io.observe(el);
  });
}
window.observeReveal = observeReveal;
observeReveal();

// Garantia: anima tudo que ficou parado depois de 4 s
setTimeout(() => $$(COUNT_SEL).forEach(countUp), 4000);

/* ---------- Parallax ---------- */
safe('parallax', () => {
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  $$('.parallax').forEach(img => gsap.to(img, {
    yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: img.parentElement, scrub: true }
  }));
});

/* ---------- Gráficos ---------- */
const charts = {};
function renderCharts() {
  const text = cssVar('--text') || '#0f1b3d';
  const grid = cssVar('--border') || 'rgba(15,27,61,.1)';
  Chart.defaults.color = text;
  Chart.defaults.font.family = 'Inter, sans-serif';

  const make = (id, cfg) => {
    const el = document.getElementById(id);
    if (!el) return;
    charts[id]?.destroy();
    charts[id] = new Chart(el, cfg);
  };
  const scales = {
    x: { grid: { color: grid } },
    y: { grid: { color: grid }, beginAtZero: true }
  };

  make('prodChart', {
    type: 'bar',
    data: {
      labels: [t('Fase 1', 'Phase 1'), t('Meta 2027', '2027 target'), t('Licenciado', 'Permitted')],
      datasets: [{
        label: t('Capacidade (t/ano)', 'Capacity (t/yr)'),
        data: [5000, 10000, 50000],
        backgroundColor: [C.accent, C.accent2, C.blue],
        borderRadius: 8
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales }
  });

  make('costChart', {
    type: 'line',
    data: {
      labels: ['2025', t('1º tri 2026', 'Q1 2026'), t('2º tri 2026', 'Q2 2026'), t('3º tri 2026', 'Q3 2026')],
      datasets: [{
        label: 'US$/t',
        data: [1950, 1400, 950, 780],          // ilustrativo
        borderColor: C.accent,
        backgroundColor: 'rgba(77,163,255,.2)',
        fill: true, tension: .35, pointRadius: 5
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales }
  });

  make('shareChart', {
    type: 'doughnut',
    data: {
      labels: [t('Administração', 'Management'), t('Institucionais', 'Institutional'), t('Varejo', 'Retail')],
      datasets: [{
        data: [40, 25, 35],                    // ilustrativo
        backgroundColor: [C.accent, C.blue, C.accent2],
        borderWidth: 0
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom' } } }
  });
}

/* ---------- Mapas (sem API key) ---------- */
let map, wm;

const TILES = {
  light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  osm:   'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
};
const ATTR = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap';
const ATTR_OSM = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function addTiles(target) {
  const layer = L.tileLayer(TILES.light, { attribution: ATTR, maxZoom: 16 });
  let fallback = false;
  layer.on('tileerror', () => {
    if (fallback) return;
    fallback = true;
    layer.options.attribution = ATTR_OSM;
    layer.options.maxZoom = 19;
    layer.setUrl(TILES.osm);
  });
  layer.addTo(target);
}

safe('mapas', () => {
  if (!window.L) return;
  const dot = color => L.divIcon({
    className: '',
    html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 0 12px ${color}"></span>`,
    iconSize: [16, 16]
  });

  if ($('#map')) {
    map = L.map('map', { scrollWheelZoom: false }).setView([-15.4, -39.3], 8);
    addTiles(map);
    L.marker(C.mine, { icon: dot(C.accent) }).addTo(map).bindPopup('<b>Mina Santa Cruz</b>').openPopup();
    L.marker(C.port, { icon: dot(C.accent2) }).addTo(map).bindPopup('<b>Porto de Ilhéus</b>');
    L.polyline([C.mine, C.port], { color: C.accent, dashArray: '6 8' }).addTo(map);
  }

  if ($('#worldMap')) {
    wm = L.map('worldMap', { scrollWheelZoom: false, worldCopyJump: true }).setView([10, -20], 2);
    addTiles(wm);
    const dest = [
      { n: 'Houston · EUA / USA', c: [29.76, -95.37] },
      { n: 'Roterdã · Europa / Rotterdam · Europe', c: [51.92, 4.48] },
      { n: 'Busan · Ásia / Asia', c: [35.10, 129.04] }
    ];
    L.marker(C.port, { icon: dot(C.accent) }).addTo(wm).bindPopup('<b>Bahia, Brasil</b>');
    dest.forEach(d => {
      L.marker(d.c, { icon: dot(C.accent2) }).addTo(wm).bindPopup(`<b>${d.n}</b>`);
      L.polyline([C.port, d.c], { color: C.accent, weight: 2, dashArray: '6 8' }).addTo(wm);
    });
  }
});
const fixMaps = () => { map?.invalidateSize(); wm?.invalidateSize(); };
addEventListener('resize', fixMaps);
addEventListener('load', fixMaps);

/* ---------- Galeria / lightbox ---------- */
safe('lightbox', () => {
  const lb = $('#lightbox'); if (!lb) return;
  const lbImg = $('img', lb);
  const close = () => lb.classList.remove('open');
  $$('.gallery img').forEach(img => {
    img.tabIndex = 0;
    const open = () => {
      lbImg.src = img.src.replace(/w=\d+/, 'w=1600');
      lbImg.alt = img.alt;
      lb.classList.add('open');
      $('button', lb).focus();
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => e.key === 'Enter' && open());
  });
  $('button', lb).addEventListener('click', close);
  lb.addEventListener('click', e => e.target === lb && close());
  addEventListener('keydown', e => e.key === 'Escape' && close());
});

/* ---------- Notícias ---------- */
const NEWS = [
  { cat: 'op',   d: '2026-08-12', pt: 'Primeiro pedido de compra após a retomada', en: 'First purchase order after restart' },
  { cat: 'op',   d: '2026-03-10', pt: 'Scrubber/trommel instalado em Santa Cruz', en: 'Scrubber/trommel installed at Santa Cruz' },
  { cat: 'corp', d: '2026-03-10', pt: 'Rogerio Barcellos é nomeado COO', en: 'Rogerio Barcellos appointed COO' },
  { cat: 'fin',  d: '2026-08-28', pt: 'Resultados do 2º trimestre de 2026', en: 'Q2 2026 results' },
  { cat: 'corp', d: '2025-09-15', pt: 'Tiago Cunha assume como CEO', en: 'Tiago Cunha appointed CEO' },
  { cat: 'op',   d: '2025-05-20', pt: 'Primeiro embarque de concentrado para os EUA', en: 'First concentrate shipment to the US' },
  { cat: 'op',   d: '2024-12-05', pt: 'Inauguração oficial da mina Santa Cruz', en: 'Official inauguration of Santa Cruz mine' }
].sort((a, b) => b.d.localeCompare(a.d));

let newsCat = 'all', newsPage = 1;
const PER_PAGE = 3;
const CAT = { op: ['Operação', 'Operations'], corp: ['Corporativo', 'Corporate'], fin: ['Financeiro', 'Financial'] };

function renderNews() {
  const list = $('#newsList'), pag = $('#pagination');
  if (!list) return;
  const items = NEWS.filter(n => newsCat === 'all' || n.cat === newsCat);
  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  newsPage = Math.min(newsPage, pages);
  const loc = isEN() ? 'en-US' : 'pt-BR';

  list.innerHTML = items.slice((newsPage - 1) * PER_PAGE, newsPage * PER_PAGE).map(n => `
    <article class="mk">
      <small class="muted">${new Date(n.d + 'T12:00').toLocaleDateString(loc, { day: '2-digit', month: 'short', year: 'numeric' })} · ${t(...CAT[n.cat])}</small>
      <h3>${isEN() ? n.en : n.pt}</h3>
    </article>`).join('');

  if (pag) {
    pag.innerHTML = pages > 1
      ? Array.from({ length: pages }, (_, i) =>
          `<button type="button" class="filter${i + 1 === newsPage ? ' active' : ''}" data-page="${i + 1}" aria-label="${t('Página', 'Page')} ${i + 1}">${i + 1}</button>`).join('')
      : '';
  }
}

/* Filtros das notícias só onde existe #newsList (não interfere no blog) */
if ($('#newsList')) {
  $$('.filters .filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filters .filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    newsCat = btn.dataset.cat; newsPage = 1;
    renderNews();
  }));
  $('#pagination')?.addEventListener('click', e => {
    const b = e.target.closest('[data-page]'); if (!b) return;
    newsPage = +b.dataset.page;
    renderNews();
  });
}

/* ---------- Calculadora ---------- */
function calc() {
  const res = $('#cRes'); if (!res) return;
  const inv = +$('#cInv').value || 0, buy = +$('#cBuy').value || 0, now = +$('#cNow').value || 0;
  if (!buy) return (res.innerHTML = t('Informe o preço de compra.', 'Enter the purchase price.'));
  const shares = Math.floor(inv / buy), val = shares * now, gain = val - inv, pct = inv ? (gain / inv) * 100 : 0;
  const loc = isEN() ? 'en-CA' : 'pt-BR';
  const money = v => v.toLocaleString(loc, { style: 'currency', currency: 'CAD' });
  res.innerHTML = `
    ${t('Ações', 'Shares')}: ${shares.toLocaleString(loc)}<br>
    ${t('Valor final', 'Final value')}: <b>${money(val)}</b><br>
    ${t('Resultado', 'Result')}: ${gain >= 0 ? '+' : ''}${money(gain)} (${pct.toFixed(1)}%)`;
}
$$('#cInv, #cBuy, #cNow').forEach(i => i.addEventListener('input', calc));

/* ---------- Formulários (Formspree via fetch) ---------- */
$$('#form, #alertForm, #quoteForm').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = $('.form-msg, #msg', form) || { textContent: '' };
    const btn = $('button[type=submit]', form);

    if (form.id === 'form' && window.grecaptcha && !grecaptcha.getResponse()) {
      msg.textContent = t('Confirme o reCAPTCHA.', 'Please complete the reCAPTCHA.');
      return;
    }
    if (btn) btn.disabled = true;
    msg.textContent = t('Enviando...', 'Sending...');
    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(r.status);
      form.reset();
      window.grecaptcha && form.id === 'form' && grecaptcha.reset();
      msg.textContent = t('Enviado com sucesso! Retornaremos em breve.', 'Sent successfully! We will get back to you soon.');
    } catch {
      msg.textContent = t('Erro ao enviar. Tente novamente ou escreva para info@southstarbatterymetals.com.', 'Sending failed. Try again or email info@southstarbatterymetals.com.');
    } finally {
      if (btn) btn.disabled = false;
    }
  });
});

/* ---------- Cookies ---------- */
safe('cookies', () => {
  const box = $('#cookie'); if (!box) return;
  if (!localStorage.getItem('cookies')) box.classList.add('show');
  const set = v => { localStorage.setItem('cookies', v); box.classList.remove('show'); };
  $('#cookieYes')?.addEventListener('click', () => set('yes'));
  $('#cookieNo')?.addEventListener('click', () => set('no'));
});

/* ---------- Inicialização ---------- */
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
safe('idioma', applyLang);
setTimeout(() => safe('mapas', fixMaps), 300);

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register(new URL('../sw.js', document.currentScript?.src || location.href)).catch(() => {});
}