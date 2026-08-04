// conectWM Academy — Programa de Afiliados

const AFILIADO_WIZARD_KEY = 'conectwm_afiliado';
const WHATSAPP_AFILIADO = '5511952025568';
const SITE_ACADEMY = '/index.html';
const HOTMART_CHECKOUT_URL = 'https://pay.hotmart.com/O107022826R';
const CHECKOUT_URL = HOTMART_CHECKOUT_URL;

const afiliadoWizardSteps = [
  {
    field: 'tipo',
    title: 'Tipo de Indicação',
    question: 'O que você quer indicar?',
    tip: 'Academy = assinatura R$39,99/mês. Empresa = projetos sob medida (automação, SaaS, IA) — comissão maior.',
    options: [
      { value: 'academy', label: 'Indicar a conectWM Academy (assinatura do curso)' },
      { value: 'empresa', label: 'Indicar empresa para a conectWM desenvolver projeto' },
      { value: 'ambos', label: 'Quero indicar Academy E empresas' }
    ]
  },
  {
    field: 'canal',
    title: 'Canal de Divulgação',
    question: 'Por onde você vai divulgar?',
    options: [
      { value: 'whatsapp', label: 'WhatsApp — grupos, contatos, status' },
      { value: 'instagram', label: 'Instagram — Reels, stories, DM' },
      { value: 'linkedin', label: 'LinkedIn — posts B2B e conexões' },
      { value: 'tiktok', label: 'TikTok / YouTube — vídeos curtos' },
      { value: 'multi', label: 'Multicanal — todos os acima' }
    ]
  },
  {
    field: 'perfil',
    title: 'Seu Perfil',
    question: 'Como você se define como afiliado?',
    options: [
      { value: 'aluno', label: 'Aluno da Academy — indico o que uso' },
      { value: 'dev', label: 'Desenvolvedor / freelancer — indico para clientes' },
      { value: 'agencia', label: 'Agência ou consultor — indico empresas B2B' },
      { value: 'influencer', label: 'Criador de conteúdo tech' }
    ]
  },
  {
    field: 'meta',
    title: 'Meta Mensal',
    question: 'Quantas indicações você quer fazer por mês?',
    options: [
      { value: '5', label: '5 indicações — renda extra' },
      { value: '15', label: '15 indicações — foco secundário' },
      { value: '30', label: '30+ indicações — afiliado profissional' }
    ]
  }
];

const afiliadoLabels = {
  tipo: { academy: 'Academy', empresa: 'Empresa B2B', ambos: 'Academy + Empresa' },
  canal: { whatsapp: 'WhatsApp', instagram: 'Instagram', linkedin: 'LinkedIn', tiktok: 'TikTok/YouTube', multi: 'Multicanal' },
  perfil: { aluno: 'Aluno', dev: 'Dev/Freelancer', agencia: 'Agência', influencer: 'Creator' },
  meta: { '5': '5/mês', '15': '15/mês', '30': '30+/mês' }
};

let afiliadoWizardState = { step: 0, answers: {} };

function loadAfiliadoAnswers() {
  try {
    const raw = localStorage.getItem(AFILIADO_WIZARD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAfiliadoAnswers(answers) {
  localStorage.setItem(AFILIADO_WIZARD_KEY, JSON.stringify(answers));
}

function buildReferralLink(type) {
  const base = window.location.origin || '';
  if (type === 'academy') return `${base}${CHECKOUT_URL}?ref=afiliado`;
  return `${base}${SITE_ACADEMY}?ref=afiliado-b2b`;
}

function getWhatsAppIndicacaoAcademy() {
  return encodeURIComponent(
    `Olá! Indico a *conectWM Academy* — plataforma completa para criar SaaS, automações e monetizar com IA.\n\n` +
    `✅ Módulos passo a passo com prompts prontos\n` +
    `✅ Dashboard com ferramentas secretas de produtividade\n` +
    `✅ TikTok Shop, Frontend, Backend e mais\n\n` +
    `Assinatura por R$ 39,99/mês (preço de lançamento — vagas limitadas):\n${buildReferralLink('academy')}\n\n` +
    `_(Indicação de afiliado conectWM)_`
  );
}

function getWhatsAppIndicacaoEmpresa() {
  return encodeURIComponent(
    `Olá! Conheço a *conectWM* — estúdio especializado em automação, SaaS e integração com IA para empresas.\n\n` +
    `Eles desenvolvem:\n` +
    `• MicroSaaS e sistemas web sob medida\n` +
    `• Automação WhatsApp + n8n + CRM\n` +
    `• Chatbots e dashboards com IA\n\n` +
    `Quer uma conversa sem compromisso? A conectWM atende empresas de todo o Brasil.\n\n` +
    `Site: ${window.location.origin || 'conectwm'}${SITE_ACADEMY}\n\n` +
    `_(Indicação de parceiro afiliado)_`
  );
}

function getWhatsAppRegistrarIndicacao(nomeIndicado, tipo) {
  const user = localStorage.getItem('conectwm_logged_in_user') || 'afiliado';
  return encodeURIComponent(
    `Quero registrar uma indicação de afiliado conectWM.\n\n` +
    `Meu e-mail cadastrado: ${user}\n` +
    `Tipo: ${tipo === 'empresa' ? 'Empresa B2B' : 'Academy'}\n` +
    `Indicado: ${nomeIndicado || '(preencher)'}\n\n` +
    `Aguardo retorno sobre comissão.`
  );
}

function buildAfiliadoMasterPrompt(answers) {
  return `Aja como estrategista de programa de afiliados da conectWM Academy.

Perfil do afiliado:
- Tipo: ${afiliadoLabels.tipo[answers.tipo]}
- Canal: ${afiliadoLabels.canal[answers.canal]}
- Perfil: ${afiliadoLabels.perfil[answers.perfil]}
- Meta: ${afiliadoLabels.meta[answers.meta]} indicações/mês

Produtos para indicar:
1) Academy R$39,99/mês — curso SaaS + automação + IA
2) Serviços B2B conectWM — desenvolvimento sob medida para empresas

Me entregue:
1) Plano 30 dias de divulgação no canal escolhido
2) 10 copies prontas (WhatsApp, Instagram, LinkedIn)
3) Script de abordagem para indicar EMPRESA que precisa de automação/SaaS
4) Script para indicar PESSOA que quer aprender a criar SaaS
5) Objeções comuns e respostas
6) Checklist pós-indicação (como registrar e receber comissão)`;
}

function initAfiliados() {
  const saved = loadAfiliadoAnswers();
  if (saved && saved.tipo && saved.canal) {
    afiliadoWizardState.answers = saved;
    showAfiliadoContent(saved);
    return;
  }
  renderAfiliadoWizardStep();
}

function renderAfiliadoWizardStep() {
  const wrapper = document.getElementById('afiliado-wizard-wrapper');
  if (!wrapper) return;

  const step = afiliadoWizardSteps[afiliadoWizardState.step];
  if (!step) return;

  const saved = afiliadoWizardState.answers[step.field];
  const total = afiliadoWizardSteps.length;
  const pct = Math.round(((afiliadoWizardState.step + 1) / total) * 100);

  wrapper.innerHTML = `
    <div class="space-y-5 fade-in">
      <div class="flex items-center justify-between gap-4">
        <span class="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs font-bold text-green-400 uppercase tracking-wider">
          💰 ${step.title}
        </span>
        <span class="text-xs text-gray-500 font-mono">${afiliadoWizardState.step + 1}/${total}</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
        <div class="h-full bg-green-400 transition-all duration-300" style="width:${pct}%"></div>
      </div>
      <h3 class="text-xl font-bold font-outfit text-white">${step.question}</h3>
      ${step.tip ? `<p class="text-gray-500 text-sm">💡 ${step.tip}</p>` : ''}
      <div class="grid grid-cols-1 gap-3">
        ${step.options.map(opt => `
          <button type="button" class="afiliado-choice-btn text-left p-4 rounded-xl border transition-all w-full ${
            saved === opt.value
              ? 'bg-green-500/15 border-green-500/40 text-white ring-1 ring-green-500/30'
              : 'bg-slate-900/60 border-gray-800 hover:border-green-500/30 text-gray-300 hover:text-white'
          }" data-value="${opt.value}">
            <span class="text-sm font-semibold">${opt.label}</span>
          </button>
        `).join('')}
      </div>
      <div class="flex justify-between pt-4 border-t border-gray-900">
        <button id="af-wiz-prev" class="px-5 py-3 rounded-xl bg-slate-900 border border-gray-800 text-sm font-bold text-gray-400 hover:text-white transition-all ${afiliadoWizardState.step === 0 ? 'opacity-40 cursor-not-allowed' : ''}" ${afiliadoWizardState.step === 0 ? 'disabled' : ''}>← Anterior</button>
        <button id="af-wiz-next" class="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 text-sm font-bold transition-all">
          ${afiliadoWizardState.step === total - 1 ? 'Ver Kit de Afiliado →' : 'Próxima →'}
        </button>
      </div>
    </div>
  `;

  wrapper.querySelectorAll('.afiliado-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrapper.querySelectorAll('.afiliado-choice-btn').forEach(b => {
        b.className = 'afiliado-choice-btn text-left p-4 rounded-xl border transition-all w-full bg-slate-900/60 border-gray-800 hover:border-green-500/30 text-gray-300 hover:text-white';
      });
      btn.className = 'afiliado-choice-btn text-left p-4 rounded-xl border transition-all w-full bg-green-500/15 border-green-500/40 text-white ring-1 ring-green-500/30';
      afiliadoWizardState.answers[step.field] = btn.dataset.value;
    });
  });

  document.getElementById('af-wiz-prev')?.addEventListener('click', () => {
    if (afiliadoWizardState.step > 0) {
      afiliadoWizardState.step--;
      renderAfiliadoWizardStep();
    }
  });

  document.getElementById('af-wiz-next')?.addEventListener('click', () => {
    if (!afiliadoWizardState.answers[step.field]) {
      alert('Selecione uma opção para continuar.');
      return;
    }
    if (afiliadoWizardState.step < total - 1) {
      afiliadoWizardState.step++;
      renderAfiliadoWizardStep();
    } else {
      saveAfiliadoAnswers(afiliadoWizardState.answers);
      showAfiliadoContent(afiliadoWizardState.answers);
    }
  });
}

function showAfiliadoContent(answers) {
  const wizardWrap = document.getElementById('afiliado-wizard-wrapper');
  const contentWrap = document.getElementById('afiliado-content-wrapper');
  if (wizardWrap) wizardWrap.classList.add('hidden');
  if (contentWrap) contentWrap.classList.remove('hidden');

  const summary = document.getElementById('afiliado-summary-bar');
  if (summary) {
    summary.innerHTML = `
      <div class="flex flex-wrap gap-2 text-xs">
        ${Object.entries(afiliadoLabels).map(([key, map]) => {
          const val = answers[key];
          if (!val) return '';
          return `<span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-gray-800 text-gray-300"><strong class="text-green-400">${key}:</strong> ${map[val]}</span>`;
        }).join('')}
      </div>
      <button id="af-wiz-reconfig" class="text-xs font-bold text-green-400 hover:text-green-300 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">Refazer</button>
    `;
    document.getElementById('af-wiz-reconfig')?.addEventListener('click', () => {
      afiliadoWizardState = { step: 0, answers: {} };
      localStorage.removeItem(AFILIADO_WIZARD_KEY);
      wizardWrap?.classList.remove('hidden');
      contentWrap?.classList.add('hidden');
      renderAfiliadoWizardStep();
    });
  }

  const showAcademy = answers.tipo === 'academy' || answers.tipo === 'ambos';
  const showEmpresa = answers.tipo === 'empresa' || answers.tipo === 'ambos';

  document.getElementById('afiliado-academy-block')?.classList.toggle('hidden', !showAcademy);
  document.getElementById('afiliado-empresa-block')?.classList.toggle('hidden', !showEmpresa);

  const master = document.getElementById('afiliado-master-prompt');
  if (master) master.value = buildAfiliadoMasterPrompt(answers);

  const linkAcademy = document.getElementById('afiliado-link-academy');
  if (linkAcademy) linkAcademy.href = buildReferralLink('academy');

  const waAcademy = document.getElementById('afiliado-wa-academy');
  if (waAcademy) waAcademy.href = `https://api.whatsapp.com/send?text=${getWhatsAppIndicacaoAcademy()}`;

  const waEmpresa = document.getElementById('afiliado-wa-empresa');
  if (waEmpresa) waEmpresa.href = `https://api.whatsapp.com/send?text=${getWhatsAppIndicacaoEmpresa()}`;

  const waRegistrar = document.getElementById('afiliado-wa-registrar');
  if (waRegistrar) {
    waRegistrar.href = `https://api.whatsapp.com/send?phone=${WHATSAPP_AFILIADO}&text=${getWhatsAppRegistrarIndicacao('', answers.tipo === 'empresa' ? 'empresa' : 'academy')}`;
  }

  if (window.lucide?.createIcons) window.lucide.createIcons();

  const copyBtn = document.getElementById('afiliado-copy-prompt');
  if (copyBtn && !copyBtn.dataset.bound) {
    copyBtn.dataset.bound = '1';
    copyBtn.addEventListener('click', () => {
      const ta = document.getElementById('afiliado-master-prompt');
      if (!ta) return;
      ta.select();
      navigator.clipboard.writeText(ta.value);
      copyBtn.innerText = 'Copiado!';
      setTimeout(() => { copyBtn.innerText = 'Copiar Prompt'; }, 1500);
    });
  }
}
