// conectWM Academy · TikTok Shop: passo a passo, estratégia e crescimento

const TIKTOK_WIZARD_KEY = 'conectwm_tiktok_shop_v2';
const TIKTOK_MIN_SEGUIDORES_AFILIADO = 2000;

const tiktokWizardSteps = [
  {
    field: 'tipo_negocio',
    title: 'Objetivo',
    question: 'O que você quer fazer no TikTok Shop?',
    tip: 'Para divulgar produtos de outras lojas como afiliado, você precisa de conta real no TikTok + mínimo de 2.000 seguidores.',
    options: [
      { value: 'afiliado', label: 'Afiliado TikTok Shop · conta real + divulgar produtos de lojas' },
      { value: 'proprio', label: 'Vendedor próprio · abrir minha loja e vender meus produtos' },
      { value: 'dropship', label: 'Dropshipping · loja própria com fornecedor enviando' }
    ]
  },
  {
    field: 'conta_tiktok',
    title: 'Conta TikTok',
    question: 'Você já tem uma conta TikTok ativa?',
    tip: 'Afiliado também precisa de perfil real e verificado no app · não basta só criar conta no site.',
    options: [
      { value: 'sim', label: 'Sim, já tenho conta TikTok' },
      { value: 'nao', label: 'Não, ainda não tenho conta' },
      { value: 'comercial', label: 'Sim, já tenho Conta Comercial ou Creator' }
    ]
  },
  {
    field: 'seguidores',
    title: 'Seguidores (requisito afiliado)',
    question: 'Quantos seguidores você tem hoje no TikTok?',
    tip: `Para divulgar produtos como afiliado no TikTok Shop são necessários no mínimo ${TIKTOK_MIN_SEGUIDORES_AFILIADO.toLocaleString('pt-BR')} seguidores. Se tiver menos, use a WinxSMM abaixo.`,
    options: [
      { value: 'abaixo_2k', label: 'Menos de 2.000 · preciso comprar seguidores (WinxSMM)' },
      { value: 'acima_2k', label: '2.000 ou mais · já posso divulgar produtos' },
      { value: 'zero', label: 'Conta nova / quase zero seguidores' }
    ]
  },
  {
    field: 'documento',
    title: 'Documentação',
    question: 'Qual documento você vai usar no cadastro?',
    tip: 'Afiliados usam CPF na maioria dos casos. Vendedores próprios costumam usar CNPJ ou MEI.',
    options: [
      { value: 'cpf', label: 'CPF · pessoa física (comum para afiliado)' },
      { value: 'cnpj', label: 'CNPJ / MEI · empresa formalizada' },
      { value: 'pendente', label: 'Ainda não tenho documento definido' }
    ]
  },
  {
    field: 'crescimento',
    title: 'Como chegar nos 2k',
    question: 'Como você quer atingir (ou manter) os 2.000 seguidores?',
    tip: 'Se faltar seguidor, a WinxSMM acelera. Combine com conteúdo orgânico para não depender só de números comprados.',
    options: [
      { value: 'winxsmm', label: 'Comprar na WinxSMM até bater 2.000 seguidores' },
      { value: 'mix', label: 'Mix · WinxSMM + conteúdo orgânico' },
      { value: 'organico', label: 'Só orgânico · vou postar até chegar em 2k' }
    ]
  }
];

const tiktokLabels = {
  tipo_negocio: { afiliado: 'Afiliado TikTok Shop', proprio: 'Vendedor próprio', dropship: 'Dropshipping' },
  conta_tiktok: { sim: 'Conta TikTok ativa', nao: 'Sem conta ainda', comercial: 'Conta Comercial/Creator' },
  seguidores: { abaixo_2k: 'Menos de 2k', acima_2k: '2k+ (pode divulgar)', zero: 'Conta nova' },
  documento: { cnpj: 'CNPJ/MEI', cpf: 'CPF', pendente: 'Documento pendente' },
  crescimento: { winxsmm: 'WinxSMM até 2k', mix: 'Mix WinxSMM + orgânico', organico: '100% orgânico até 2k' }
};

const tiktokLabelTitles = {
  tipo_negocio: 'Objetivo',
  conta_tiktok: 'Conta',
  seguidores: 'Seguidores',
  documento: 'Documento',
  crescimento: 'Plano 2k'
};

let tiktokWizardState = { step: 0, answers: {} };

function loadTikTokAnswers() {
  try {
    const raw = localStorage.getItem(TIKTOK_WIZARD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTikTokAnswers(answers) {
  localStorage.setItem(TIKTOK_WIZARD_KEY, JSON.stringify(answers));
}

function initTikTokShop() {
  const saved = loadTikTokAnswers();
  if (saved && saved.conta_tiktok && saved.tipo_negocio && saved.seguidores) {
    tiktokWizardState.answers = saved;
    showTikTokContent(saved);
    return;
  }
  renderTikTokWizardStep();
}

function renderTikTokWizardStep() {
  const wrapper = document.getElementById('tiktok-wizard-wrapper');
  if (!wrapper) return;

  const step = tiktokWizardSteps[tiktokWizardState.step];
  if (!step) return;

  const saved = tiktokWizardState.answers[step.field];
  const total = tiktokWizardSteps.length;
  const pct = Math.round(((tiktokWizardState.step + 1) / total) * 100);

  const optionsHtml = step.options.map(opt => `
    <button type="button" class="tiktok-choice-btn text-left p-4 rounded-xl border transition-all w-full ${
      saved === opt.value
        ? 'bg-pink-500/15 border-pink-500/40 text-white ring-1 ring-pink-500/30'
        : 'bg-slate-900/60 border-gray-800 hover:border-pink-500/30 text-gray-300 hover:text-white'
    }" data-value="${opt.value}">
      <span class="text-sm font-semibold">${opt.label}</span>
    </button>
  `).join('');

  wrapper.innerHTML = `
    <div class="space-y-5 fade-in">
      <div class="flex items-center justify-between gap-4">
        <span class="inline-flex items-center gap-2 rounded-full bg-pink-500/10 border border-pink-500/30 px-3 py-1 text-xs font-bold text-pink-400 uppercase tracking-wider">
          🛒 ${step.title}
        </span>
        <span class="text-xs text-gray-500 font-mono">${tiktokWizardState.step + 1}/${total}</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-pink-500 to-sky-400 transition-all duration-300" style="width:${pct}%"></div>
      </div>
      <h3 class="text-xl font-bold font-outfit text-white">${step.question}</h3>
      ${step.tip ? `<p class="text-gray-500 text-sm">💡 ${step.tip}</p>` : ''}
      <div class="grid grid-cols-1 gap-3">${optionsHtml}</div>
      <div class="flex justify-between pt-4 border-t border-gray-900">
        <button id="tiktok-wiz-prev" class="px-5 py-3 rounded-xl bg-slate-900 border border-gray-800 text-sm font-bold text-gray-400 hover:text-white transition-all ${tiktokWizardState.step === 0 ? 'opacity-40 cursor-not-allowed' : ''}" ${tiktokWizardState.step === 0 ? 'disabled' : ''}>← Anterior</button>
        <button id="tiktok-wiz-next" class="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 text-sm font-bold transition-all">
          ${tiktokWizardState.step === total - 1 ? 'Ver Plano Completo →' : 'Próxima →'}
        </button>
      </div>
    </div>
  `;

  wrapper.querySelectorAll('.tiktok-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrapper.querySelectorAll('.tiktok-choice-btn').forEach(b => {
        b.className = 'tiktok-choice-btn text-left p-4 rounded-xl border transition-all w-full bg-slate-900/60 border-gray-800 hover:border-pink-500/30 text-gray-300 hover:text-white';
      });
      btn.className = 'tiktok-choice-btn text-left p-4 rounded-xl border transition-all w-full bg-pink-500/15 border-pink-500/40 text-white ring-1 ring-pink-500/30';
      tiktokWizardState.answers[step.field] = btn.dataset.value;
    });
  });

  document.getElementById('tiktok-wiz-prev')?.addEventListener('click', () => {
    if (tiktokWizardState.step > 0) {
      tiktokWizardState.step--;
      renderTikTokWizardStep();
    }
  });

  document.getElementById('tiktok-wiz-next')?.addEventListener('click', () => {
    if (!tiktokWizardState.answers[step.field]) {
      alert('Selecione uma opção para continuar.');
      return;
    }
    if (tiktokWizardState.step < total - 1) {
      tiktokWizardState.step++;
      renderTikTokWizardStep();
    } else {
      saveTikTokAnswers(tiktokWizardState.answers);
      showTikTokContent(tiktokWizardState.answers);
    }
  });
}

function guideBox(steps) {
  return `
    <div class="wizard-guide-box rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2 text-sm text-gray-300">
      <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">📍 Onde clicar · passo a passo</span>
      <ol class="list-decimal list-inside space-y-1.5 text-xs leading-relaxed">
        ${steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
    </div>
  `;
}

function getContaTikTokSteps(answers) {
  if (answers.conta_tiktok === 'comercial') {
    return [
      'Abra o app <strong>TikTok</strong> → ícone <strong>Perfil</strong> (canto inferior direito)',
      'Toque <strong>☰ Menu</strong> → <strong>Configurações e privacidade</strong>',
      'Confirme que está em <strong>Conta Comercial</strong> ou <strong>Creator</strong>',
      'Acesse <strong>seller-br.tiktok.com</strong> ou <strong>TikTok Shop Seller Center</strong> no navegador',
      'Faça login com a mesma conta → clique <strong>Registrar-se como vendedor</strong>'
    ];
  }
  if (answers.conta_tiktok === 'sim') {
    return [
      'App TikTok → <strong>Perfil</strong> → <strong>☰</strong> → <strong>Configurações</strong>',
      'Toque <strong>Gerenciar conta</strong> → <strong>Mudar para Conta Comercial</strong>',
      'Escolha categoria do negócio (ex: Varejo, Beleza) → Confirmar',
      'No navegador: acesse <strong>seller-br.tiktok.com</strong> → Login com TikTok',
      'Clique <strong>Cadastrar loja</strong> → preencha dados da empresa/MEI'
    ];
  }
  return [
    'Baixe <strong>TikTok</strong> na App Store ou Google Play',
    'Abra → <strong>Perfil</strong> → <strong>Cadastrar</strong> (e-mail ou telefone)',
    'Complete perfil: foto, @username memorável, bio com nicho (ex: "Moda feminina + ofertas")',
    'Publique 3–5 vídeos antes de vender (unboxing, dicas, tendências do nicho)',
    'Perfil → Menu → <strong>Mudar para Conta Comercial</strong> → escolha categoria',
    'Acesse <strong>seller-br.tiktok.com</strong> → Registrar loja com CPF/CNPJ'
  ];
}

function getAfiliadoTikTokShopSteps(answers) {
  const steps = [];
  if (answers.conta_tiktok === 'nao') {
    steps.push(
      'Baixe o app <strong>TikTok</strong> → <strong>Cadastrar</strong> com e-mail ou telefone',
      'Complete foto, @username e bio do nicho (ex: "Achadinhos TikTok Shop")',
      'Publique 3–5 vídeos curtos antes de ativar afiliado (reviews, unboxing, dicas)'
    );
  } else {
    steps.push(
      'Abra o app TikTok → <strong>Perfil</strong> → confirme que a conta está ativa e sem restrições'
    );
  }
  steps.push(
    'Perfil → <strong>☰ Menu</strong> → <strong>Configurações</strong> → <strong>Gerenciar conta</strong>',
    'Toque <strong>Mudar para Conta de Criador</strong> ou <strong>Conta Comercial</strong> → escolha categoria (ex: Compras/Varejo)',
    'No app: <strong>Perfil</strong> → ícone <strong>TikTok Shop</strong> (ou <strong>Ferramentas do criador</strong>)',
    'Toque <strong>Programa de Afiliados</strong> / <strong>Afilie-se ao TikTok Shop</strong> → leia os termos → <strong>Inscrever-se</strong>',
    'Preencha dados com <strong>CPF</strong> (ou CNPJ se tiver) + conta bancária para receber comissões',
    `Aguarde aprovação. Confirme que tem <strong>mínimo ${TIKTOK_MIN_SEGUIDORES_AFILIADO.toLocaleString('pt-BR')} seguidores</strong> · sem isso o botão de adicionar produtos fica bloqueado`,
    'Após aprovado + 2k seguidores: <strong>Produtos</strong> → escolha itens do marketplace → <strong>Adicionar à vitrine</strong>',
    'Grave vídeo mostrando o produto → ao postar, toque <strong>Adicionar link</strong> → selecione o produto da vitrine',
    'Use hashtags (#tiktokshopbr #achadinho) + CTA "link na loja" · cada venda gera comissão automática'
  );
  if (answers.seguidores === 'abaixo_2k' || answers.seguidores === 'zero') {
    steps.push(
      `<strong>Ainda não tem 2k?</strong> Use a <a href="https://www.winxsmm.com/" target="_blank" rel="noopener noreferrer" class="text-pink-400 underline">WinxSMM</a> (passo a passo na seção abaixo) para completar os seguidores que faltam`
    );
  }
  return steps;
}

function getWinxSMMSteps(answers) {
  const needBoost = answers.seguidores === 'abaixo_2k' || answers.seguidores === 'zero';
  const steps = [
    'Acesse <a href="https://www.winxsmm.com/" target="_blank" rel="noopener noreferrer" class="text-pink-400 underline font-semibold">winxsmm.com</a> no navegador',
    'Clique em <strong>Register</strong> / <strong>Cadastrar</strong> → e-mail + senha → confirmar conta',
    'Faça login → <strong>Add Funds</strong> / <strong>Adicionar Saldo</strong> (PIX, cartão ou crypto)',
    'Busque serviço <strong>TikTok → Followers</strong> (seguidores brasileiros se disponível)',
    'Copie o link do perfil: TikTok → <strong>Perfil</strong> → <strong>⋯</strong> → <strong>Copiar link</strong>',
    'Cole no campo <strong>Link</strong> do pedido na WinxSMM'
  ];
  if (needBoost) {
    steps.push(
      `Calcule quantos faltam: meta <strong>${TIKTOK_MIN_SEGUIDORES_AFILIADO.toLocaleString('pt-BR')} seguidores</strong> − seus seguidores atuais = quantidade a comprar`,
      'Exemplo: se tem 300 seguidores, compre ~1.700 (faça em 2–3 pedidos de 500–700, não tudo de uma vez)',
      'Após entrega, confira no TikTok se passou de 2.000 → volte ao app e ative <strong>Adicionar produtos</strong> no programa de afiliado'
    );
  }
  steps.push(
    'Aguarde entrega (minutos a horas). Espaçe pedidos para reduzir risco de ban',
    'Opcional: compre também <strong>Views</strong> nos primeiros vídeos de produto para dar alcance inicial'
  );
  return steps;
}

function getEstrategiaCards(answers) {
  const tipo = answers.tipo_negocio;
  const cresc = answers.crescimento;

  const base = [
    {
      icon: 'video',
      title: 'Conteúdo que vende (3–5 posts/dia)',
      desc: 'Hook nos 3 primeiros segundos + demonstração do produto + CTA "link na bio/shop". Use trending sounds e hashtags do nicho (#tiktokshopbr, #achadinho).'
    },
    {
      icon: 'radio',
      title: 'Lives diárias (30–60 min)',
      desc: 'TikTok Shop prioriza lives com engajamento. Mostre produto ao vivo, responda comentários, use cupons exclusivos da live.'
    },
    {
      icon: 'package',
      title: 'Catálogo enxuto e testável',
      desc: 'Comece com 5–10 SKUs campeões. Teste preço, thumbnail e vídeo. Escale só o que converter acima de 2% CTR.'
    },
    {
      icon: 'bar-chart-2',
      title: 'Métricas que importam',
      desc: 'GMV (faturamento), taxa de conversão da live, ROI por vídeo e custo por aquisição · não apenas seguidores.'
    }
  ];

  if (tipo === 'afiliado') {
    base.unshift({
      icon: 'link',
      title: 'Afiliado com conta real',
      desc: `Conta TikTok verificada + programa de afiliados ativo + ${TIKTOK_MIN_SEGUIDORES_AFILIADO.toLocaleString('pt-BR')} seguidores. Adicione produtos à vitrine e grave vídeos com link · comissão cai na conta bancária cadastrada.`
    });
    base.unshift({
      icon: 'target',
      title: 'Meta: 2.000 seguidores',
      desc: 'Sem 2k seguidores o TikTok bloqueia divulgação de produtos afiliados. Falta número? Use WinxSMM para completar, depois volte ao app e adicione produtos.'
    });
  }
  if (tipo === 'dropship') {
    base.unshift({
      icon: 'truck',
      title: 'Dropshipping no TikTok BR',
      desc: 'Integre fornecedor nacional (prazo < 7 dias). TikTok penaliza atraso. Use ferramentas como ERP ou planilha para rastrear pedidos.'
    });
  }
  if (cresc === 'organico') {
    base.push({
      icon: 'trending-up',
      title: 'Orgânico até 2k',
      desc: '3–5 vídeos/dia, duets, trends do nicho. Demora mais, mas seguidores tendem a engajar de verdade nos produtos.'
    });
  }
  if (cresc === 'mix' || cresc === 'winxsmm') {
    base.push({
      icon: 'zap',
      title: 'WinxSMM → 2.000 seguidores',
      desc: 'Compre só o que falta para 2k em pedidos fracionados. Depois foque em vídeos de produto com views orgânicas + SMM leve.'
    });
  }

  return base;
}

function buildTikTokMasterPrompt(answers) {
  const a = answers;
  const isAfiliado = a.tipo_negocio === 'afiliado';
  return `Aja como consultor de TikTok Shop Brasil. Meu perfil:
- Objetivo: ${tiktokLabels.tipo_negocio[a.tipo_negocio]}
- Conta TikTok: ${tiktokLabels.conta_tiktok[a.conta_tiktok]}
- Seguidores hoje: ${tiktokLabels.seguidores[a.seguidores]}
- Documento: ${tiktokLabels.documento[a.documento]}
- Plano para 2k seguidores: ${tiktokLabels.crescimento[a.crescimento]}
- Requisito afiliado: mínimo ${TIKTOK_MIN_SEGUIDORES_AFILIADO} seguidores para divulgar produtos

Me entregue:
${isAfiliado ? `1) Passo a passo COMPLETO para ser afiliado TikTok Shop no Brasil (conta real, inscrição no programa, vitrine de produtos, vídeos com link)
2) O que fazer se tiver menos de 2k seguidores (incluindo uso de painel SMM WinxSMM com cautela)` : '1) Checklist para abrir loja no Seller Center BR'}
3) Calendário de conteúdo 30 dias focado em ${isAfiliado ? 'vídeos afiliados que convertem' : 'vendas na loja'}
4) 10 roteiros de vídeo curtos com produto TikTok Shop
5) Hashtags, horários BR e estratégia de comissão
6) KPIs semanais (GMV, CTR, comissão por vídeo)`;
}

function showTikTokContent(answers) {
  const wizardWrap = document.getElementById('tiktok-wizard-wrapper');
  const contentWrap = document.getElementById('tiktok-content-wrapper');
  const summary = document.getElementById('tiktok-summary-bar');

  if (wizardWrap) wizardWrap.classList.add('hidden');
  if (contentWrap) contentWrap.classList.remove('hidden');

  if (summary) {
    summary.innerHTML = `
      <div class="flex flex-wrap gap-2 text-xs">
        ${Object.keys(tiktokLabels).map(key => {
          const val = answers[key];
          if (!val) return '';
          const labelMap = tiktokLabels[key];
          return `<span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-gray-800 text-gray-300"><strong class="text-pink-400">${tiktokLabelTitles[key] || key}:</strong> ${labelMap[val] || val}</span>`;
        }).join('')}
      </div>
      <button id="tiktok-wiz-reconfig" class="text-xs font-bold text-pink-400 hover:text-pink-300 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20">Refazer Questionário</button>
    `;
    document.getElementById('tiktok-wiz-reconfig')?.addEventListener('click', () => {
      tiktokWizardState = { step: 0, answers: {} };
      localStorage.removeItem(TIKTOK_WIZARD_KEY);
      if (wizardWrap) wizardWrap.classList.remove('hidden');
      if (contentWrap) contentWrap.classList.add('hidden');
      renderTikTokWizardStep();
    });
  }

  const reqBanner = document.getElementById('tiktok-2k-banner');
  if (reqBanner) {
    if (answers.tipo_negocio === 'afiliado') {
      reqBanner.classList.remove('hidden');
      const falta2k = answers.seguidores === 'abaixo_2k' || answers.seguidores === 'zero';
      reqBanner.innerHTML = falta2k
        ? `<strong class="text-pink-300">⚠️ Você precisa de 2.000 seguidores</strong> para divulgar produtos como afiliado. Use a <a href="https://www.winxsmm.com/" target="_blank" rel="noopener noreferrer" class="underline font-bold">WinxSMM</a> abaixo para completar o que falta, depois ative os produtos na vitrine.`
        : `<strong class="text-green-400">✓ Com 2.000+ seguidores</strong> você já pode inscrever-se no programa de afiliados e adicionar produtos à vitrine. Siga o passo a passo de afiliado abaixo.`;
    } else {
      reqBanner.classList.add('hidden');
    }
  }

  const afiliadoBlock = document.getElementById('tiktok-afiliado-block');
  const afiliadoSteps = document.getElementById('tiktok-afiliado-steps');
  if (afiliadoBlock) {
    const showAfiliado = answers.tipo_negocio === 'afiliado';
    afiliadoBlock.classList.toggle('hidden', !showAfiliado);
    if (showAfiliado && afiliadoSteps) {
      afiliadoSteps.innerHTML = guideBox(getAfiliadoTikTokShopSteps(answers));
    }
  }

  const contaBlock = document.getElementById('tiktok-conta-block');
  if (contaBlock) {
    contaBlock.classList.toggle('hidden', answers.tipo_negocio === 'afiliado');
  }

  const contaSteps = document.getElementById('tiktok-conta-steps');
  if (contaSteps) {
    contaSteps.innerHTML = guideBox(getContaTikTokSteps(answers));
  }

  const winxSteps = document.getElementById('tiktok-winx-steps');
  const winxBlock = document.getElementById('tiktok-winx-block');
  if (winxSteps) {
    winxSteps.innerHTML = guideBox(getWinxSMMSteps(answers));
  }
  if (winxBlock) {
    const existingNote = winxBlock.querySelector('#tiktok-winx-organic-note');
    if (existingNote) existingNote.remove();
    const falta2k = answers.seguidores === 'abaixo_2k' || answers.seguidores === 'zero';
    if (falta2k || answers.crescimento === 'winxsmm') {
      const p = document.createElement('p');
      p.id = 'tiktok-winx-organic-note';
      p.className = 'text-xs text-pink-300 border border-pink-500/30 rounded-lg p-3 bg-pink-500/10';
      p.innerHTML = `<strong>Objetivo:</strong> chegar a <strong>${TIKTOK_MIN_SEGUIDORES_AFILIADO.toLocaleString('pt-BR')} seguidores</strong> para liberar divulgação de produtos afiliados no TikTok Shop. Compre apenas a diferença (ex: tem 400 → compre ~1.600).`;
      const stepsEl = winxBlock.querySelector('#tiktok-winx-steps');
      if (stepsEl) winxBlock.insertBefore(p, stepsEl);
    } else if (answers.crescimento === 'organico') {
      const p = document.createElement('p');
      p.id = 'tiktok-winx-organic-note';
      p.className = 'text-xs text-amber-400/90 border border-amber-500/20 rounded-lg p-3 bg-amber-500/5';
      p.textContent = 'Você escolheu crescimento 100% orgânico. Se estagnar antes dos 2k, use a WinxSMM como plano B.';
      const stepsEl = winxBlock.querySelector('#tiktok-winx-steps');
      if (stepsEl) winxBlock.insertBefore(p, stepsEl);
    }
  }

  const strategyGrid = document.getElementById('tiktok-strategy-grid');
  if (strategyGrid) {
    strategyGrid.innerHTML = '';
    getEstrategiaCards(answers).forEach(card => {
      const el = document.createElement('div');
      el.className = 'glass-card rounded-2xl p-5 border border-pink-500/10 hover:border-pink-500/20 space-y-3';
      el.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
            <i data-lucide="${card.icon}" class="h-5 w-5"></i>
          </div>
          <h4 class="font-bold font-outfit text-white text-sm">${card.title}</h4>
        </div>
        <p class="text-gray-400 text-xs leading-relaxed">${card.desc}</p>
      `;
      strategyGrid.appendChild(el);
    });
  }

  const masterText = document.getElementById('tiktok-master-prompt');
  if (masterText) masterText.value = buildTikTokMasterPrompt(answers);

  if (window.lucide?.createIcons) window.lucide.createIcons();

  const copyBtn = document.getElementById('tiktok-copy-prompt');
  if (copyBtn && !copyBtn.dataset.bound) {
    copyBtn.dataset.bound = '1';
    copyBtn.addEventListener('click', () => {
      const ta = document.getElementById('tiktok-master-prompt');
      if (!ta) return;
      ta.select();
      navigator.clipboard.writeText(ta.value);
      const orig = copyBtn.innerText;
      copyBtn.innerText = 'Copiado!';
      setTimeout(() => { copyBtn.innerText = orig; }, 1500);
    });
  }
}
