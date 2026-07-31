// conectWM Academy - Dashboard Script

// 1. DADOS DOS MÓDULOS E AULAS
const modulesData = [
  {
    id: 1,
    title: "Criando um SaaS",
    subtitle: "Sistemas Modulares e Nuvem",
    image: "images/module_saas.jpg",
    description: "Aprenda a estruturar arquiteturas web modernas, integrar APIs de IA, configurar bancos de dados relacionais e lançar os seus próprios Microsaas.",
    lessons: [
      { id: "1_1", title: "Introdução à Arquitetura SaaS com IA", duration: "12 min", desc: "Nesta aula, você aprenderá as bases conceituais de um SaaS modular e como usar assistentes de IA para definir a arquitetura ideal.", prompt: "Aja como um arquiteto de software sênior. Quero criar um SaaS de gestão de leads usando Node.js, Express e PostgreSQL. Esboce a arquitetura recomendada considerando escalabilidade." },
      { id: "1_2", title: "Estruturando o Banco de Dados em Segundos", duration: "18 min", desc: "Aprenda a modelar esquemas relacionais complexos utilizando prompts para o Cursor / Claude, economizando horas de planejamento manual.", prompt: "Gere o script SQL de criação de tabelas para um SaaS de assinaturas com usuários, planos, cobranças e logs de auditoria." },
      { id: "1_3", title: "Deploy e Configuração de Servidores na Nuvem", duration: "22 min", desc: "Como colocar sua aplicação no ar na Render, Vercel ou VPS própria de forma automatizada e com certificado SSL gratuito.", prompt: "Escreva um arquivo Dockerfile e docker-compose.yml otimizados para produção em Node.js com conexão a banco Postgres." }
    ]
  },
  {
    id: 2,
    title: "Aplicativos Secretos",
    subtitle: "Ferramentas Avançadas",
    image: "images/module_secret.jpg",
    description: "Desenvolva utilitários ocultos e extensões automatizadas que resolvem gargalos complexos e geram renda passiva recorrente.",
    lessons: [
      { id: "2_1", title: "Descobrindo APIs não documentadas", duration: "15 min", desc: "Aprenda técnicas seguras de inspeção de tráfego para entender como portais web funcionam internamente para coletar dados autorizados.", prompt: "Escreva um script básico em Python usando requests para ler dados públicos de um endpoint RESTful JSON e salvar em CSV." },
      { id: "2_2", title: "Criando utilitários ocultos de automação", duration: "20 min", desc: "Como automatizar envios, notificações e alertas em sistemas internos usando scripts leves em NodeJS executados localmente.", prompt: "Crie um script em JavaScript que monitora um arquivo de texto local e envia um POST para um Webhook do Discord sempre que houver modificações." },
      { id: "2_3", title: "Monetizando pequenos scripts secretos", duration: "25 min", desc: "Estratégia de empacotamento de pequenos scripts como extensões do Chrome ou executáveis desktop simples para venda direta.", prompt: "Gere o arquivo manifest.json e a estrutura básica para uma extensão do Google Chrome que altera o background de um site específico." }
    ]
  },
  {
    id: 3,
    title: "Tráfego Orgânico",
    subtitle: "Crescimento sem Gastos",
    image: "images/module_organic.jpg",
    description: "Aprenda SEO moderno, algoritmos das redes sociais e produção de conteúdo em escala otimizado por inteligência artificial.",
    lessons: [
      { id: "3_1", title: "SEO Inteligente auxiliado por IA", duration: "14 min", desc: "Como pesquisar palavras-chave com ferramentas gratuitas de IA e criar artigos que ranqueiam na primeira página do Google.", prompt: "Escreva a estrutura de tópicos (H1, H2, H3) para um artigo de blog focado na palavra-chave 'automação de processos industriais com IA'." },
      { id: "3_2", title: "Criação de Conteúdo em Escala com Claude", duration: "19 min", desc: "Métodos práticos de geração de roteiros de vídeo, posts de LinkedIn e posts em redes com o modelo Sonnet.", prompt: "Gere 5 variações de posts para o LinkedIn compartilhando o lançamento de um MicroSaaS de IA. Use um tom cativante e de Storytelling." },
      { id: "3_3", title: "Distribuição Viral no TikTok e Instagram", duration: "17 min", desc: "Como domar o algoritmo do Reels e TikTok estruturando vídeos curtos em ganchos magnéticos gerados por assistentes de roteiro.", prompt: "Escreva um roteiro de vídeo de 30 segundos (formato vertical) com um gancho forte nos primeiros 3 segundos para apresentar uma IA de produtividade." }
    ]
  },
  {
    id: 4,
    title: "Funil de Vendas & E-mail Marketing",
    subtitle: "Máquina de Conversão",
    image: "images/module_funnel.jpg",
    description: "Crie campanhas automáticas de aquisição, nutrição de leads, recuperação de carrinhos e fluxos de e-mail marketing inteligentes.",
    lessons: [
      { id: "4_1", title: "Copywriting de Alta Conversão com Chatbots", duration: "16 min", desc: "Como usar frameworks de copy (AIDA, PAS) com IAs para criar cartas de vendas e páginas de capturas ultra-persuasivas.", prompt: "Crie uma copy de página de vendas usando a estrutura PAS (Problema, Agitação, Solução) para um produto de automação de WhatsApp empresarial." },
      { id: "4_2", title: "Configurando Automações de E-mail (n8n/Make)", duration: "24 min", desc: "Crie fluxos integrados que enviam e-mails automaticamente após compras, cliques em links ou abandono de cadastros.", prompt: "Desenhe o pseudocódigo/lógica para integrar o webhook da Kiwify ao n8n que filtra compras recusadas e envia um e-mail de recuperação." },
      { id: "4_3", title: "Recuperação de Carrinho Abandonado Automatizada", duration: "21 min", desc: "Estratégia de envio automático de descontos e abordagens personalizadas via WhatsApp/E-mail para aumentar faturamento em 15%.", prompt: "Escreva 3 modelos de mensagens de recuperação de carrinho abandonado para WhatsApp. O tom deve ser prestativo, oferecendo suporte." }
    ]
  },
  {
    id: 5,
    title: "Métricas Financeiras",
    subtitle: "Análise de Saúde do Negócio",
    image: "images/module_metrics.jpg",
    description: "Controle receitas recorrentes (MRR/ARR), custo de aquisição de cliente (CAC), LTV, taxas de retenção e lucros reais.",
    lessons: [
      { id: "5_1", title: "Entendendo LTV, CAC e Churn Rate", duration: "15 min", desc: "As métricas mais importantes que investidores e fundadores de SaaS analisam para definir o sucesso da sua empresa.", prompt: "Explique como calcular o LTV (Lifetime Value) e o Churn Rate, e dê dicas práticas de como reduzir a evasão de clientes no plano mensal." },
      { id: "5_2", title: "Construindo Dashboards Financeiros com IA", duration: "18 min", desc: "Crie dashboards dinâmicos em HTML e JS conectados a planilhas para visualizar seu caixa em tempo real.", prompt: "Gere o código para um gráfico simples de barras em HTML/JS usando a biblioteca Chart.js para exibir o MRR de uma empresa ao longo de 6 meses." },
      { id: "5_3", title: "Análise Operacional de Custos de Cloud", duration: "12 min", desc: "Como otimizar o uso de banco de dados e APIs pagas para que a sua fatura da AWS ou Vercel não consuma sua margem de lucro.", prompt: "Como implementar um cache com Redis em Node.js para evitar requisições repetidas e caras ao banco de dados? Escreva o exemplo de código." }
    ]
  },
  {
    id: 6,
    title: "Criando Anúncios Vencedores",
    subtitle: "Tráfego Pago de Elite",
    image: "images/module_ads.jpg",
    description: "Domine campanhas no Meta Ads, Google Ads e geração automatizada de criativos de alta performance guiados por inteligência artificial.",
    lessons: [
      { id: "6_1", title: "Estruturação de Campanhas no Meta Ads", duration: "20 min", desc: "Como planejar criativos, públicos semelhantes (lookalike) e testes A/B para encontrar anúncios lucrativos no Facebook.", prompt: "Escreva um guia de estrutura de público de testes A/B para testar 3 criativos diferentes com um orçamento diário de R$ 50." },
      { id: "6_2", title: "Geração de Criativos com Inteligência Artificial", duration: "22 min", desc: "Ferramentas práticas para gerar imagens e roteiros de vídeos dinâmicos com IA sem precisar de editores caros.", prompt: "Dê ideias de prompts de geração de imagem no Midjourney/DALL-E para criar criativos limpos de anúncio para um app de controle de finanças." },
      { id: "6_3", title: "Otimização de Públicos e Escala Vertical", duration: "19 min", desc: "Como escalar seus anúncios gastando mais dinheiro mantendo a taxa de conversão e custo de aquisição saudáveis.", prompt: "Como analisar o ROAS (Retorno sobre Investimento em Anúncios) e identificar o momento exato de escalar uma campanha de R$ 100/dia para R$ 500/dia?" }
    ]
  },
  {
    id: 7,
    title: "Gestão de Cobrança",
    subtitle: "Faturamento Automático",
    image: "images/module_billing.jpg",
    description: "Integre Stripe, Kiwify e plataformas de faturamento de forma simples via API para cobranças via Pix e Cartão de Crédito.",
    lessons: [
      { id: "7_1", title: "Integração do Stripe e gateways nacionais", duration: "25 min", desc: "Configurando rotas de backend seguras para receber notificações de pagamentos, assinaturas ativas ou canceladas.", prompt: "Crie um webhook básico em Express/NodeJS para ouvir eventos de pagamento bem-sucedido enviados pelo Stripe." },
      { id: "7_2", title: "Cobranças Recorrentes e Webhooks", duration: "17 min", desc: "Como manter o acesso do usuário no banco de dados sincronizado automaticamente conforme o status da assinatura na Kiwify.", prompt: "Escreva o fluxo lógico para verificar se a assinatura expirou comparando a data atual com o campo next_billing_date." },
      { id: "7_3", title: "Prevenção de Inadimplência via IA", duration: "15 min", desc: "Notificação inteligente antes do vencimento do cartão do cliente e cobrança suave por canais digitais automáticos.", prompt: "Crie um script de envio de alerta por e-mail avisando o cliente que o cartão expira em 5 dias e fornecendo o link de alteração segura." }
    ]
  },
  {
    id: 8,
    title: "Mídias Sociais",
    subtitle: "Estratégia e Crescimento",
    image: "images/module_social.jpg",
    description: "Fortaleça o posicionamento da sua marca, crie autoridade em canais corporativos e converta seguidores em leads qualificados.",
    lessons: [
      { id: "8_1", title: "Branding Pessoal para Desenvolvedores", duration: "15 min", desc: "Como criar relevância profissional no GitHub, LinkedIn e redes para atrair clientes de desenvolvimento e propostas de SaaS.", prompt: "Como otimizar meu perfil do LinkedIn focado em 'Desenvolvedor Fullstack de Soluções com Inteligência Artificial'? Escreva sugestões de headline e sobre." },
      { id: "8_2", title: "Calendário Editorial Automatizado com IA", duration: "18 min", desc: "Ferramentas e processos para gerar 30 dias de ideias de posts e rascunhos em menos de uma hora.", prompt: "Gere uma matriz de conteúdo com 4 semanas de ideias de posts (focando em Dor, Autoridade, Solução e Quebra de Objeções) sobre IA." },
      { id: "8_3", title: "Engajamento e Atração de Leads Qualificados", duration: "14 min", desc: "Como transformar engajamento passivo de posts das mídias em leads de WhatsApp reais usando iscas digitais.", prompt: "Escreva um fluxo de conversa interativa simulada para automatizar o Direct do Instagram com um link de download de PDF gratuito." }
    ]
  },
  {
    id: 9,
    title: "Lançamento & Escala",
    subtitle: "Go-to-Market de Sucesso",
    image: "images/module_launch.jpg",
    description: "Monte seu plano de go-to-market, colete feedbacks rápidos e scale a operação comercial e a equipe de desenvolvimento.",
    lessons: [
      { id: "9_1", title: "Estratégia de Lançamento de MicroSaaS", duration: "22 min", desc: "Como estruturar um lançamento enxuto sem gastar rios de dinheiro, usando plataformas como Product Hunt e grupos de desenvolvedores.", prompt: "Dê sugestões de copies, imagens e postagens ideais para lançar um produto de IA no site Product Hunt." },
      { id: "9_2", title: "Atraindo os Primeiros 100 Clientes Pagantes", duration: "25 min", desc: "Abordagem ativa direta (cold mailing/outreach) e estratégias de indicação para validar sua precificação com clientes reais.", prompt: "Escreva um modelo de cold e-mail para oferecer um diagnóstico de automação gratuito para donos de agências de marketing." },
      { id: "9_3", title: "Processo de Escala e Contratação de Time", duration: "20 min", desc: "Como delegar tarefas operacionais, monitorar o SLA de atendimento do time e planejar os próximos passos de crescimento da empresa.", prompt: "Como estruturar o funil de contratação de um desenvolvedor júnior focado em No-Code/IA? Liste as fases de teste e perguntas-chave." }
    ]
  }
];

// 2. VERIFICAÇÃO DE AUTENTICAÇÃO
function checkAuth() {
  const loggedUser = localStorage.getItem('conectwm_logged_in_user');
  const isPaying = localStorage.getItem('conectwm_user_is_paying');

  if (!loggedUser || isPaying !== 'true') {
    alert("Acesso restrito! Por favor, faça login com uma conta ativa.");
    window.location.href = "/login.html";
  } else {
    // Exibir e-mail logado no perfil
    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl) {
      userEmailEl.innerText = loggedUser;
    }
  }
}

// 3. LOGOUT
function handleLogout() {
  localStorage.removeItem('conectwm_logged_in_user');
  localStorage.removeItem('conectwm_user_is_paying');
  window.location.href = "/login.html";
}

// 4. CONTROLE DE NAVEGAÇÃO ENTRE ABAS
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.dashboard-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSectionId = item.getAttribute('data-target');

      // Atualizar classes ativas no menu lateral
      navItems.forEach(nav => {
        nav.classList.remove('bg-sky-500/10', 'text-sky-400', 'border-l-4', 'border-sky-400');
        nav.classList.add('text-gray-400');
      });
      item.classList.add('bg-sky-500/10', 'text-sky-400', 'border-l-4', 'border-sky-400');
      item.classList.remove('text-gray-400');

      // Mostrar apenas a seção alvo
      sections.forEach(sec => {
        sec.classList.add('hidden');
      });
      const targetSec = document.getElementById(targetSectionId);
      if (targetSec) {
        targetSec.classList.remove('hidden');
      }

      // Se voltarmos para módulos, limpar a tela de exibição de aula e resetar para lista de módulos
      if (targetSectionId === 'sec-modulos') {
        showModulesList();
      }
    });
  });
}

// 5. RENDERIZAR MÓDULOS NA LISTA
function renderModulesList() {
  const container = document.getElementById('modules-grid');
  if (!container) return;

  container.innerHTML = '';
  modulesData.forEach(mod => {
    const card = document.createElement('div');
    card.className = "glass-card rounded-2xl overflow-hidden border border-gray-800 hover:border-sky-500/30 transition-all cursor-pointer group flex flex-col justify-between";
    card.style.height = "380px";
    
    // Armazenar ID do módulo no elemento
    card.setAttribute('data-module-id', mod.id);

    card.innerHTML = `
      <div class="relative h-44 overflow-hidden">
        <img src="${mod.image}" alt="${mod.title}" class="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <span class="absolute bottom-4 left-4 rounded-full bg-sky-500/25 border border-sky-400/30 text-sky-300 text-xs px-3 py-1 font-bold uppercase tracking-wider">
          Módulo ${mod.id}
        </span>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 class="text-xl font-bold font-outfit text-white leading-tight mb-2">${mod.title}</h4>
          <span class="text-xs text-sky-400 font-semibold block mb-3">${mod.subtitle}</span>
          <p class="text-gray-400 text-xs line-clamp-3 leading-relaxed">${mod.description}</p>
        </div>
        <div class="flex justify-between items-center pt-4 border-t border-gray-800/60 mt-3 text-xs text-gray-500">
          <span>${mod.lessons.length} Aulas completas</span>
          <span class="text-sky-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Acessar Aulas <i data-lucide="chevron-right" class="h-4 w-4"></i>
          </span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openModule(mod.id);
    });

    container.appendChild(card);
  });
  lucide.createIcons();
}

// 6. ABRIR MÓDULO E EXIBIR COMPONENTES DA AULA
function openModule(moduleId) {
  const mod = modulesData.find(m => m.id === moduleId);
  if (!mod) return;

  const modulesListDiv = document.getElementById('modules-list-wrapper');
  const lessonViewerDiv = document.getElementById('lesson-viewer-wrapper');

  if (modulesListDiv && lessonViewerDiv) {
    modulesListDiv.classList.add('hidden');
    lessonViewerDiv.classList.remove('hidden');
  }

  // Atualizar cabeçalho do módulo no viewer
  document.getElementById('current-module-title').innerText = `Módulo ${mod.id}: ${mod.title}`;
  document.getElementById('current-module-subtitle').innerText = mod.subtitle;

  // Renderizar Playlist de Aulas
  const playlistContainer = document.getElementById('lessons-playlist');
  if (playlistContainer) {
    playlistContainer.innerHTML = '';
    mod.lessons.forEach((lesson, index) => {
      const item = document.createElement('button');
      item.className = "w-full p-4 rounded-xl flex items-center gap-3 border text-left transition-all " +
                       (index === 0 ? "bg-sky-500/10 border-sky-500/30 text-white" : "bg-slate-900/50 border-gray-800 hover:border-gray-700 text-gray-400");
      item.setAttribute('data-lesson-id', lesson.id);

      item.innerHTML = `
        <div class="h-8 w-8 rounded-lg bg-slate-950 border border-gray-800 flex items-center justify-center flex-shrink-0 text-sky-400 text-xs font-bold font-outfit">
          ${index + 1}
        </div>
        <div class="flex-1 min-w-0">
          <h5 class="font-bold text-xs truncate leading-snug">${lesson.title}</h5>
          <span class="text-[10px] text-gray-500">${lesson.duration} • Vídeoaula</span>
        </div>
      `;

      item.addEventListener('click', () => {
        selectLesson(mod.id, lesson.id);
      });

      playlistContainer.appendChild(item);
    });
  }

  // Selecionar por padrão a primeira aula
  if (mod.lessons.length > 0) {
    selectLesson(mod.id, mod.lessons[0].id);
  }
}

// Retornar para a lista de módulos
function showModulesList() {
  const modulesListDiv = document.getElementById('modules-list-wrapper');
  const lessonViewerDiv = document.getElementById('lesson-viewer-wrapper');

  if (modulesListDiv && lessonViewerDiv) {
    modulesListDiv.classList.remove('hidden');
    lessonViewerDiv.classList.add('hidden');
  }
}

// 7. SELECIONAR AULA ESPECÍFICA
function selectLesson(moduleId, lessonId) {
  const mod = modulesData.find(m => m.id === moduleId);
  if (!mod) return;
  const lesson = mod.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  // Atualizar botões ativos na playlist
  const playlistItems = document.querySelectorAll('#lessons-playlist button');
  playlistItems.forEach(item => {
    const id = item.getAttribute('data-lesson-id');
    if (id === lessonId) {
      item.className = "w-full p-4 rounded-xl flex items-center gap-3 border text-left bg-sky-500/10 border-sky-500/30 text-white transition-all";
    } else {
      item.className = "w-full p-4 rounded-xl flex items-center gap-3 border text-left bg-slate-900/50 border-gray-800 hover:border-gray-700 text-gray-400 transition-all";
    }
  });

  // Atualizar Detalhes da Aula
  document.getElementById('lesson-title-display').innerText = lesson.title;
  document.getElementById('lesson-desc-display').innerText = lesson.desc;

  // Prompt do dia
  const promptBox = document.getElementById('lesson-prompt');
  if (promptBox) {
    promptBox.value = lesson.prompt;
  }

  // Simular alteração do player de vídeo com nova aula
  const videoPlaceholder = document.getElementById('video-placeholder-container');
  if (videoPlaceholder) {
    // Simular o título do vídeo renderizado no player de vídeo premium
    const playerTitle = videoPlaceholder.querySelector('.video-player-title');
    if (playerTitle) {
      playerTitle.innerText = `Vídeo: ${lesson.title} (${lesson.duration})`;
    }
  }

  // Reset do checkbox de progresso
  const progressCheck = document.getElementById('class-progress-check');
  if (progressCheck) {
    const progressKey = `conectwm_completed_${lesson.id}`;
    progressCheck.checked = localStorage.getItem(progressKey) === 'true';
  }
}

// 8. LOGICA DO PLAYER DE VIDEO SIMULADO
function initVideoPlayer() {
  const playBtn = document.getElementById('player-play-btn');
  const progressBar = document.getElementById('player-progress-bar');
  const volumeBtn = document.getElementById('player-volume-btn');
  const playIcon = playBtn ? playBtn.querySelector('i') : null;
  const volumeIcon = volumeBtn ? volumeBtn.querySelector('i') : null;

  let isPlaying = false;
  let isMuted = false;
  let progressInterval = null;
  let progressValue = 0;

  if (playBtn && progressBar) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        if (playIcon) {
          playIcon.setAttribute('data-lucide', 'pause');
          lucide.createIcons();
        }
        playBtn.classList.add('text-sky-400');
        // Iniciar progresso simulado
        progressInterval = setInterval(() => {
          if (progressValue < 100) {
            progressValue += 0.25;
            progressBar.style.width = `${progressValue}%`;
          } else {
            clearInterval(progressInterval);
            isPlaying = false;
            if (playIcon) {
              playIcon.setAttribute('data-lucide', 'play');
              lucide.createIcons();
            }
            playBtn.classList.remove('text-sky-400');
            progressValue = 0;
            progressBar.style.width = `0%`;
            alert('Aula concluída com sucesso!');
          }
        }, 100);
      } else {
        if (playIcon) {
          playIcon.setAttribute('data-lucide', 'play');
          lucide.createIcons();
        }
        playBtn.classList.remove('text-sky-400');
        clearInterval(progressInterval);
      }
    });
  }

  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        if (volumeIcon) {
          volumeIcon.setAttribute('data-lucide', 'volume-x');
          lucide.createIcons();
        }
        volumeBtn.classList.add('text-red-400');
      } else {
        if (volumeIcon) {
          volumeIcon.setAttribute('data-lucide', 'volume-2');
          lucide.createIcons();
        }
        volumeBtn.classList.remove('text-red-400');
      }
    });
  }
}

// 9. CÓPIA DO PROMPT
function initPromptCopy() {
  const copyBtn = document.getElementById('copy-prompt-btn');
  const promptInput = document.getElementById('lesson-prompt');

  if (copyBtn && promptInput) {
    copyBtn.addEventListener('click', () => {
      promptInput.select();
      promptInput.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(promptInput.value);
      
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "Copiado!";
      copyBtn.classList.add('bg-green-500', 'text-slate-950');
      copyBtn.classList.remove('bg-sky-400', 'hover:bg-sky-300');

      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.classList.remove('bg-green-500', 'text-slate-950');
        copyBtn.classList.add('bg-sky-400', 'hover:bg-sky-300');
      }, 2000);
    });
  }
}

// 10. COMPLEMENTO DE LIÇÕES CONCLUÍDAS
function initLessonProgress() {
  const progressCheck = document.getElementById('class-progress-check');
  if (progressCheck) {
    progressCheck.addEventListener('change', () => {
      // Obter ID da aula atualmente ativa
      const activeBtn = document.querySelector('#lessons-playlist button.text-white');
      if (activeBtn) {
        const lessonId = activeBtn.getAttribute('data-lesson-id');
        if (lessonId) {
          const progressKey = `conectwm_completed_${lessonId}`;
          localStorage.setItem(progressKey, progressCheck.checked);
        }
      }
    });
  }
}

// 11. INICIALIZAÇÃO GERAL DO PAINEL
document.addEventListener('DOMContentLoaded', () => {
  // Garantir controle de login
  checkAuth();

  // Configurar Logout
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

  // Navegação
  initNavigation();

  // Renderizar Módulos
  renderModulesList();

  // Voltar para lista de módulos
  const btnBackModules = document.getElementById('btn-back-modules');
  if (btnBackModules) {
    btnBackModules.addEventListener('click', showModulesList);
  }

  // Controles extras do player e prompt
  initVideoPlayer();
  initPromptCopy();
  initLessonProgress();
});
