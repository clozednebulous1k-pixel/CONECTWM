// conectWM Academy - Assistente (painel de dicas)
// Injeta o botão flutuante e mostra atalhos/dicas da landing e do sistema

document.addEventListener('DOMContentLoaded', () => {
  injectAssistantMarkup();
  initAssistant();
});

function injectAssistantMarkup() {
  if (document.getElementById('chatbot-toggle')) return;

  const markup = `
    <button id="chatbot-toggle" class="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-sky-400 hover:bg-sky-300 text-slate-950 flex items-center justify-center shadow-lg transition-all hover:scale-110 btn-glow-tech" aria-label="Abrir Assistente conectWM">
      <img src="images/logo.png" alt="conectWM Logo" class="h-8 w-auto object-contain">
    </button>

    <div id="chatbot-window" class="hidden fixed bottom-24 right-6 z-50 w-[90%] sm:w-[380px] max-h-[min(560px,75vh)] glass-card rounded-[2rem] flex flex-col overflow-hidden chat-window-glow border border-sky-500/20">
      <div class="bg-slate-950 p-4 border-b border-gray-800 flex justify-between items-center shrink-0">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 p-1.5 overflow-hidden">
              <img src="images/logo.png" alt="conectWM Logo" class="h-full w-auto object-contain">
            </div>
            <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-slate-950"></span>
          </div>
          <div>
            <h4 class="font-bold text-sm text-white font-outfit leading-none">conectWM Assistente</h4>
            <span class="text-xs text-gray-500 font-medium">Dicas rápidas da plataforma</span>
          </div>
        </div>
        <button id="chatbot-close" class="text-gray-400 hover:text-white p-1" aria-label="Fechar assistente">
          <i data-lucide="x" class="h-5 w-5"></i>
        </button>
      </div>

      <div id="assistant-tips" class="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0d14]">
        <div class="flex items-start gap-2.5 fade-in">
          <img src="images/logo.png" alt="" class="h-7 w-7 rounded-lg bg-sky-500/10 border border-sky-500/20 p-1 flex-shrink-0 object-contain">
          <div class="chat-bubble-bot max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed">
            Olá! Sou o assistente da <strong>conectWM</strong>. Sem chat por aqui — use as dicas abaixo para navegar na página e no sistema.
          </div>
        </div>

        <div class="space-y-2 pt-1">
          <p class="text-[10px] font-bold uppercase tracking-widest text-sky-400/80 px-1">Na landing page</p>

          <a href="https://chat.whatsapp.com/DDMrExZm8PnFRF2pOViB8E" target="_blank" rel="noopener noreferrer" class="assistant-tip-card group">
            <span class="assistant-tip-icon bg-green-500/15 text-green-400 border-green-400/25">
              <i data-lucide="messages-square" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white group-hover:text-green-300 transition-colors">Grupo gratuito no WhatsApp</span>
              <span class="block text-xs text-gray-400 mt-0.5">Entre no CONECT FREE · dicas e networking sem custo.</span>
            </span>
            <i data-lucide="external-link" class="h-3.5 w-3.5 text-gray-600 group-hover:text-green-400 shrink-0"></i>
          </a>

          <a href="#caminhos" class="assistant-tip-card group">
            <span class="assistant-tip-icon bg-sky-500/15 text-sky-400 border-sky-400/25">
              <i data-lucide="route" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">Escolha seu caminho</span>
              <span class="block text-xs text-gray-400 mt-0.5">Criadores (Academy) ou Empresas (automação + diagnóstico).</span>
            </span>
            <i data-lucide="chevron-right" class="h-3.5 w-3.5 text-gray-600 group-hover:text-sky-400 shrink-0"></i>
          </a>

          <a href="#modulos" class="assistant-tip-card group">
            <span class="assistant-tip-icon bg-sky-500/15 text-sky-400 border-sky-400/25">
              <i data-lucide="layers" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">Módulos da Academy</span>
              <span class="block text-xs text-gray-400 mt-0.5">SaaS, tráfego, funil, WhatsApp + IA e mais.</span>
            </span>
            <i data-lucide="chevron-right" class="h-3.5 w-3.5 text-gray-600 group-hover:text-sky-400 shrink-0"></i>
          </a>

          <a href="#precos" class="assistant-tip-card group">
            <span class="assistant-tip-icon bg-amber-500/15 text-amber-400 border-amber-400/25">
              <i data-lucide="tag" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">Preço de lançamento</span>
              <span class="block text-xs text-gray-400 mt-0.5">R$ 39,99/mês · vagas limitadas neste lote.</span>
            </span>
            <i data-lucide="chevron-right" class="h-3.5 w-3.5 text-gray-600 group-hover:text-amber-400 shrink-0"></i>
          </a>

          <a href="#diagnostico" class="assistant-tip-card group">
            <span class="assistant-tip-icon bg-purple-500/15 text-purple-400 border-purple-400/25">
              <i data-lucide="building-2" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">Diagnóstico para empresas</span>
              <span class="block text-xs text-gray-400 mt-0.5">Análise gratuita de gargalos e automações com IA.</span>
            </span>
            <i data-lucide="chevron-right" class="h-3.5 w-3.5 text-gray-600 group-hover:text-purple-400 shrink-0"></i>
          </a>

          <a href="#faq" class="assistant-tip-card group">
            <span class="assistant-tip-icon bg-sky-500/15 text-sky-400 border-sky-400/25">
              <i data-lucide="circle-help" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">FAQ</span>
              <span class="block text-xs text-gray-400 mt-0.5">Precisa saber programar? Como funciona o acesso? Veja aqui.</span>
            </span>
            <i data-lucide="chevron-right" class="h-3.5 w-3.5 text-gray-600 group-hover:text-sky-400 shrink-0"></i>
          </a>
        </div>

        <div class="space-y-2 pt-2">
          <p class="text-[10px] font-bold uppercase tracking-widest text-sky-400/80 px-1">No sistema (área de membros)</p>

          <a href="/login.html" class="assistant-tip-card group">
            <span class="assistant-tip-icon bg-sky-500/15 text-sky-400 border-sky-400/25">
              <i data-lucide="layout-dashboard" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">Dashboard e aulas</span>
              <span class="block text-xs text-gray-400 mt-0.5">Entre na comunidade para ver módulos e progresso.</span>
            </span>
            <i data-lucide="chevron-right" class="h-3.5 w-3.5 text-gray-600 group-hover:text-sky-400 shrink-0"></i>
          </a>

          <div class="assistant-tip-card pointer-events-none opacity-95">
            <span class="assistant-tip-icon bg-sky-500/15 text-sky-400 border-sky-400/25">
              <i data-lucide="sparkles" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white">Wizards e prompts prontos</span>
              <span class="block text-xs text-gray-400 mt-0.5">Dentro de cada módulo: guias passo a passo + prompts para IA.</span>
            </span>
          </div>

          <div class="assistant-tip-card pointer-events-none opacity-95">
            <span class="assistant-tip-icon bg-sky-500/15 text-sky-400 border-sky-400/25">
              <i data-lucide="book-open" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white">APRENDER+ e recursos</span>
              <span class="block text-xs text-gray-400 mt-0.5">Fundamentos de programação e links de ferramentas curados.</span>
            </span>
          </div>

          <div class="assistant-tip-card pointer-events-none opacity-95">
            <span class="assistant-tip-icon bg-amber-500/15 text-amber-400 border-amber-400/25">
              <i data-lucide="award" class="h-4 w-4"></i>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white">Certificado e prêmio</span>
              <span class="block text-xs text-gray-400 mt-0.5">Complete os módulos e desbloqueie certificado + benefícios.</span>
            </span>
          </div>
        </div>

        <p class="text-[11px] text-gray-500 text-center pt-2 pb-1 leading-relaxed">
          Dúvida pontual? Use o <a href="#faq" class="text-sky-400 hover:underline">FAQ</a> ou o WhatsApp de suporte na área de membros.
        </p>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  container.innerHTML = markup;
  document.body.appendChild(container);

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function initAssistant() {
  const toggle = document.getElementById('chatbot-toggle');
  const win = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');

  if (toggle && win) {
    toggle.addEventListener('click', () => {
      win.classList.toggle('hidden');
    });
  }

  if (closeBtn && win) {
    closeBtn.addEventListener('click', () => {
      win.classList.add('hidden');
    });
  }

  // Fecha o painel ao clicar em âncoras internas da página
  if (win) {
    win.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        win.classList.add('hidden');
      });
    });
  }
}
