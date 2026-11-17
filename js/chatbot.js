(() => {
  const WPP = 'https://wa.me/5571999999999';
  const QA = [
    [['ticker', 'acao', 'acoes', 'bolsa', 'tsxv', 'otc', 'investir', 'stock'], 'Somos listados na <b>TSXV (STS)</b> e na <b>OTCQB (STSBF)</b>. No Brasil, você compra as ações por corretoras com acesso internacional.'],
    [['preco', 'cotacao', 'grafico', 'price'], 'A cotação ao vivo está na <a href="index.html#investidores">Central do Investidor</a>.'],
    [['grafite', 'produto', 'mesh', 'pureza', 'floco', 'especificacao'], 'Vendemos concentrado em flocos com até 99% de Cg, nas granulometrias +80, -80/+100 e -100 mesh. Veja as <a href="index.html#produto">especificações</a>.'],
    [['comprar grafite', 'amostra', 'cotacao comercial', 'orcamento', 'pedido', 'quote'], 'Peça uma cotação ou uma amostra pelo <a href="index.html#comercial">formulário comercial</a>.'],
    [['vaga', 'emprego', 'curriculo', 'trabalhar', 'carreira'], 'Veja as vagas abertas e envie seu currículo em <a href="carreiras.html">Carreiras</a>.'],
    [['imprensa', 'jornalista', 'entrevista', 'logo', 'kit'], 'Os materiais e o contato da assessoria estão em <a href="imprensa.html">Imprensa</a>.'],
    [['tour', 'visita', '360', 'video', 'drone'], 'Faça o <a href="tour.html">Tour 360°</a> pela mina Santa Cruz.'],
    [['esg', 'ambiente', 'sustentabilidade', 'comunidade', 'seguranca'], 'Veja nossos indicadores no <a href="index.html#painel-esg">Painel ESG</a>.'],
    [['relatorio', 'resultado', 'mda', 'sedar', 'documento'], 'Os relatórios estão na seção <a href="index.html#investidores">Documentos</a> e no SEDAR+.'],
    [['contato', 'email', 'telefone', 'endereco', 'falar'], 'Escreva para <b>info@southstarbatterymetals.com</b> ou use o <a href="index.html#contato">formulário de contato</a>.'],
    [['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite'], 'Olá! Como posso ajudar? Pergunte sobre ações, produto, vagas, imprensa ou ESG.']
  ];
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const answer = q => {
    const n = norm(q);
    let best = null, score = 0;
    QA.forEach(([keys, a]) => {
      const s = keys.filter(k => n.includes(k)).length;
      if (s > score) { score = s; best = a; }
    });
    return best || `Não entendi bem. Fale com nossa equipe pelo <a href="${WPP}" target="_blank" rel="noopener">WhatsApp</a>.`;
  };

  document.body.insertAdjacentHTML('beforeend', `
   <button id="chatBtn" aria-label="Abrir assistente" aria-expanded="false"><i data-lucide="message-square"></i></button>
   <div id="chat" role="dialog" aria-label="Assistente virtual">
    <div class="chat-head"><b>Assistente South Star</b><button id="chatClose" aria-label="Fechar">×</button></div>
    <div class="chat-body" id="chatBody" aria-live="polite"></div>
    <div class="chat-quick">
     <button>Como comprar ações?</button><button>Especificações do grafite</button><button>Vagas</button>
    </div>
    <form id="chatForm"><input id="chatIn" placeholder="Digite sua pergunta..." autocomplete="off" aria-label="Pergunta"><button aria-label="Enviar">➤</button></form>
   </div>`);
  if (window.lucide) lucide.createIcons();

  const box = document.getElementById('chat'), body = document.getElementById('chatBody'), btn = document.getElementById('chatBtn');
  const add = (html, who) => {
    body.insertAdjacentHTML('beforeend', `<div class="msg ${who}">${html}</div>`);
    body.scrollTop = body.scrollHeight;
  };
  const ask = q => {
    if (!q.trim()) return;
    add(q.replace(/</g, '&lt;'), 'me');
    setTimeout(() => add(answer(q), 'bot'), 350);
  };
  const toggle = open => { box.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); if (open) document.getElementById('chatIn').focus(); };

  add('Olá! Sou o assistente da South Star. Como posso ajudar?', 'bot');
  btn.onclick = () => toggle(!box.classList.contains('open'));
  document.getElementById('chatClose').onclick = () => toggle(false);
  box.querySelectorAll('.chat-quick button').forEach(b => b.onclick = () => ask(b.textContent));
  document.getElementById('chatForm').onsubmit = e => {
    e.preventDefault();
    const i = document.getElementById('chatIn');
    ask(i.value); i.value = '';
  };
})();
