// conectWM Academy - Dashboard Script

// 1. DADOS DOS MÓDULOS E AULAS
const modulesData = [
  {
    id: 1,
    title: "Criando um SaaS",
    subtitle: "Sistemas Modulares e Nuvem",
    image: "images/module_saas.jpg",
    description: "Aprenda a estruturar arquiteturas web modernas, integrar APIs de IA, configurar bancos de dados relacionais e lançar os seus próprios Microsaas. Componentes prontos de: TailwindUI, shadcn/ui, Aceternity UI e Uiverse.io.",
    lessons: [
      { 
        id: "1_1", 
        title: "Arquitetura SaaS e Componentes Prontos", 
        duration: "15 min", 
        desc: "Como planejar a infraestrutura de uma aplicação multi-inquilino (SaaS). Recomendamos buscar bibliotecas de componentes prontos para acelerar o desenvolvimento de interfaces: shadcn/ui (componentes React acessíveis e customizáveis), TailwindUI (componentes oficiais do Tailwind), Aceternity UI (efeitos de movimento modernos) e Uiverse.io (galeria de botões e cartões CSS/Tailwind gratuitos).", 
        prompt: "Aja como engenheiro de software sênior. Quero construir um SaaS de agendamento automático usando Node.js, Express, PostgreSQL e Tailwind CSS. Forneça a estrutura completa de pastas do projeto, o arquivo package.json inicial e as principais dependências de segurança (helmet, cors, dotenv, express-rate-limit) que devo instalar." 
      },
      { 
        id: "1_2", 
        title: "Modelagem de Banco de Dados com Cursor Editor", 
        duration: "18 min", 
        desc: "Aprenda a modelar esquemas relacionais complexos utilizando prompts para o Cursor / Claude, estruturando chaves estrangeiras, relacionamentos um-para-muitos e tabelas de faturamento vinculadas a usuários.", 
        prompt: "Escreva um script SQL completo para PostgreSQL contendo tabelas de: users (id, nome, email, hash_senha, created_at), subscriptions (id, user_id, status, stripe_customer_id, next_billing), e audit_logs. Garanta chaves estrangeiras apropriadas e indexação no email do usuário para otimização de busca." 
      },
      { 
        id: "1_3", 
        title: "Autenticação Segura JWT e Cookies httpOnly", 
        duration: "22 min", 
        desc: "Implementação passo a passo de autenticação por tokens JWT protegidos em cookies com a flag httpOnly para blindar seu SaaS contra ataques XSS (Cross-Site Scripting) de roubo de sessões.", 
        prompt: "Crie uma rota Express post('/login') em Javascript. Ela deve receber email e senha, validar no banco (com bcrypt) e gerar um token JWT assinado, configurando este token em um cookie seguro com as flags httpOnly, secure e sameSite='strict'." 
      }
    ]
  },
  {
    id: 2,
    title: "Aplicativos Secretos",
    subtitle: "Ferramentas Avançadas",
    image: "images/module_secret.jpg",
    description: "Apps e extensões secretas do mundo tech que poucos conhecem — Vimium, Workona, Bardeen, Merlin, Raycast e mais. Produtividade extrema + opcional criar extensão própria.",
    lessons: [
      {
        id: "2_1",
        title: "Pack Extensões Chrome Secretas",
        duration: "18 min",
        desc: "Instale Vimium, Workona, GoFullPage, WhatRuns, Text Blaze e Automa — ferramentas que a maioria dos devs brasileiros ainda não usa no dia a dia.",
        prompt: "Guia completo: instalar e configurar Vimium, Workona, GoFullPage, WhatRuns, Text Blaze e Automa no Chrome. Onde clicar, atalhos e 1 caso de uso por extensão."
      },
      {
        id: "2_2",
        title: "Apps de IA e Automação Escondidos",
        duration: "20 min",
        desc: "Merlin, Tactiq, Fireflies, Bardeen e Perplexity — IA e automação integradas na rotina sem trocar de aba o tempo todo.",
        prompt: "Setup de rotina com Merlin (sidebar GPT), Tactiq (transcrição Meet), Bardeen (automação Chrome) e Perplexity (pesquisa). Passo a passo instalação e fluxo diário."
      },
      {
        id: "2_3",
        title: "Criar Extensão ou Bot Próprio (Opcional)",
        duration: "25 min",
        desc: "Depois de dominar apps prontos, crie extensão Chrome MV3 ou bot Node.js empacotado em .exe para vender como produto.",
        prompt: "Extensão Chrome Manifest V3 ou bot Node.js com pkg (.exe). Código completo + chrome://extensions passo a passo + como monetizar licenças."
      }
    ]
  },
  {
    id: 3,
    title: "Tráfego Orgânico",
    subtitle: "Crescimento sem Gastos",
    image: "images/module_organic.jpg",
    description: "Aprenda SEO moderno, prospecção de leads ativos e formatação de vídeos curtos utilizando aplicativos como CapCut, Opus Clip e Submagic.",
    lessons: [
      { 
        id: "3_1", 
        title: "Prospecção Ativa B2B (Outreach de Alto Impacto)", 
        duration: "16 min", 
        desc: "Como identificar empresas locais com atendimento lento, extrair contatos corporativos e estruturar mensagens de abordagem consultiva altamente eficazes via LinkedIn e WhatsApp.", 
        prompt: "Crie um script de abordagem fria (cold outreach) pelo WhatsApp focado em proprietários de imobiliárias locais. A mensagem deve focar no problema da perda de leads de finais de semana e propor a implementação gratuita de um agente de atendimento inteligente 24/7." 
      },
      { 
        id: "3_2", 
        title: "Edição e Formatação de Vídeos Curtos com IA", 
        duration: "18 min", 
        desc: "Como usar aplicativos especializados para criar criativos virais: CapCut (edição e cortes rápidos), Opus Clip (corta trechos longos de lives em shorts virais de forma automática), Submagic (legenda com destaque colorido e emojis dinâmicos) e Veed.io (estúdio web com tradução e áudio aprimorado).", 
        prompt: "Aja como um editor de vídeo profissional especialista em Reels e TikTok. Escreva um roteiro detalhado de 45 segundos sobre automação corporativa, indicando cortes de câmera (zoom in/out), efeitos sonoros (SFX), transições sugeridas e a legenda destacada correspondente." 
      },
      { 
        id: "3_3", 
        title: "Funil de Comentários e Iscas Orgânicas", 
        duration: "14 min", 
        desc: "Como criar postagens estratégicas de carrossel ou vídeo nas mídias sociais e configurar automações (como ManyChat) que entregam materiais de valor por Direct quando o usuário comenta um termo específico.", 
        prompt: "Crie um planejamento de postagem para Instagram voltado a atrair desenvolvedores interessados em IA. Escreva a copy do post, a sugestão de slides de carrossel explicativos e a mensagem automática de boas-vindas que será enviada via Direct para quem comentar a palavra 'CÓDIGO'." 
      }
    ]
  },
  {
    id: 4,
    title: "Funil de Vendas & E-mail Marketing",
    subtitle: "Máquina de Conversão",
    image: "images/module_funnel.jpg",
    description: "Crie campanhas automáticas de aquisição, nutrição de leads, recuperação de carrinhos e fluxos de e-mail marketing inteligentes.",
    lessons: [
      { 
        id: "4_1", 
        title: "Copywriting AIDA para Páginas de Captura", 
        duration: "16 min", 
        desc: "Como usar estruturas clássicas de copywriting (Atenção, Interesse, Desejo, Ação) adaptadas ao mercado de tecnologia para maximizar a conversão de páginas de destino.", 
        prompt: "Escreva uma copy para página de captura de um e-book gratuito sobre 'Automações de Negócios com Make/Integromat'. Crie títulos chamativos, 4 bullet-points de benefícios claros e um CTA de urgência." 
      },
      { 
        id: "4_2", 
        title: "Integração de APIs de Envio de E-mail (Resend/SendGrid)", 
        duration: "20 min", 
        desc: "Aprenda a integrar serviços transacionais de e-mail no seu servidor utilizando Resend ou SendGrid, enviando dados do lead dinamicamente após o preenchimento de formulários.", 
        prompt: "Escreva uma função em Node.js utilizando a biblioteca oficial da Resend (@resend/node) para enviar um e-mail em formato HTML contendo links de materiais úteis para um novo lead cadastrado." 
      },
      { 
        id: "4_3", 
        title: "Automação de Fluxos com n8n e Make", 
        duration: "22 min", 
        desc: "Como conectar webhooks da Kiwify, Hotmart ou Stripe ao n8n ou Integromat para gerenciar funis de pós-venda, disparando mensagens automáticas de boas-vindas.", 
        prompt: "Explique a lógica de fluxo para integrar um webhook de compra aprovada da Kiwify ao n8n para atualizar uma linha em uma planilha Google Sheets de controle e enviar um alerta em um canal de Slack/Discord." 
      }
    ]
  },
  {
    id: 5,
    title: "Métricas Financeiras",
    subtitle: "Análise de Saúde do Negócio",
    image: "images/module_metrics.jpg",
    description: "Controle receitas recorrentes (MRR/ARR), custo de aquisição de cliente (CAC), LTV, taxas de retenção e lucros reais.",
    lessons: [
      { 
        id: "5_1", 
        title: "Cálculo Matemático de CAC, LTV e Churn", 
        duration: "15 min", 
        desc: "Domine as equações essenciais para calcular o Custo de Aquisição de Clientes, Lifetime Value e taxa de cancelamento (Churn), garantindo que suas margens financeiras permaneçam saudáveis.", 
        prompt: "Explique detalhadamente como calcular o LTV (Lifetime Value) e o CAC (Custo de Aquisição do Cliente). Se meu CAC é R$ 50, minha assinatura mensal é R$ 47 e o cliente fica em média 6 meses, qual é o meu retorno sobre investimento (ROI) e tempo de recuperação do CAC (Payback)?" 
      },
      { 
        id: "5_2", 
        title: "Visualização Dinâmica de Dashboards com Chart.js", 
        duration: "18 min", 
        desc: "Como estruturar um painel administrativo com gráficos de linhas e barras em HTML e JavaScript para monitorar o faturamento líquido da sua empresa em tempo real.", 
        prompt: "Gere o código HTML e Javascript usando Chart.js para criar um gráfico de linhas que mostra a evolução do MRR e da taxa de Churn nos últimos 6 meses. O visual deve ter um tema escuro sofisticado com grid ciano." 
      },
      { 
        id: "5_3", 
        title: "Gerenciamento de Custos de Cloud e Servidores", 
        duration: "14 min", 
        desc: "Estratégias para limitar o consumo de processamento de bancos de dados relacionais e cotas de APIs pagas usando Redis ou cache em memória local.", 
        prompt: "Como implementar um cache com Redis em Node.js para evitar requisições repetidas e caras ao banco de dados? Escreva o exemplo de código para salvar e resgatar consultas." 
      }
    ]
  },
  {
    id: 6,
    title: "Criando Anúncios Vencedores",
    subtitle: "Tráfego Pago de Elite",
    image: "images/module_ads.jpg",
    description: "Domine campanhas no Meta Ads, Google Ads e geração automatizada de criativos de alta performance guiados por inteligência artificial.",
    lessons: [
      { 
        id: "6_1", 
        title: "Instalação do Pixel e Conversão via Backend", 
        duration: "20 min", 
        desc: "Aprenda a configurar a API de Conversões do Facebook no servidor para registrar vendas de forma resiliente, superando o bloqueio de cookies comuns dos navegadores modernos.", 
        prompt: "Escreva um exemplo de código Express em Node.js que envia o evento de Purchase (Compra) para a API de Conversões do Meta (Facebook Conversion API) no backend contendo o email criptografado em SHA-256 e o valor do pagamento." 
      },
      { 
        id: "6_2", 
        title: "Roteiros de Vídeo Baseados no Hook-Pain-Solution", 
        duration: "18 min", 
        desc: "Como criar roteiros persuasivos estruturando anúncios em vídeo de 30 a 60 segundos com alto impacto nos primeiros instantes.", 
        prompt: "Escreva um roteiro detalhado para um anúncio de vídeo do Instagram Ads de 30 segundos vendendo um produto de automações com IA. Use a fórmula de gancho de curiosidade (3s), agitação da dor de tarefas manuais (12s), demonstração visual da automação (10s) e CTA direto (5s)." 
      },
      { 
        id: "6_3", 
        title: "Otimização de Públicos e Escala Vertical/Horizontal", 
        duration: "22 min", 
        desc: "Aprenda a gerenciar orçamentos aumentados sem encarecer o CAC, criando conjuntos de anúncios semelhantes e atualizando criativos para evitar fadiga de público.", 
        prompt: "Explique como planejar campanhas CBO (Campaign Budget Optimization) versus ABO (Ad Set Budget Optimization) e dê regras automáticas recomendadas para desativar criativos saturados." 
      }
    ]
  },
  {
    id: 7,
    title: "Gestão de Cobrança",
    subtitle: "Faturamento Automático",
    image: "images/module_billing.jpg",
    description: "Integração completa com Mercado Pago (Pix/Cartão, Sandbox de Teste, Webhooks) e Stripe Checkout.",
    lessons: [
      { 
        id: "7_1", 
        title: "Integração do Mercado Pago (Pix e Sandbox)", 
        duration: "25 min", 
        desc: "Como configurar as credenciais de teste (AccessToken e PublicKey) no SDK do Mercado Pago v2, gerando QR Code Pix dinâmicos no seu servidor para compras automáticas e rápidas.", 
        prompt: "Escreva um exemplo de código em Node.js usando o SDK do Mercado Pago v2 para criar uma preferência de pagamento de assinatura mensal via Pix, configurando a URL de notificação do Webhook (notification_url)." 
      },
      { 
        id: "7_2", 
        title: "Tratamento de Webhooks do Mercado Pago", 
        duration: "20 min", 
        desc: "Como criar uma rota segura no seu backend para receber as requisições POST automáticas do Mercado Pago, validar o status do pagamento na API oficial e liberar os acessos do cliente de forma instantânea.", 
        prompt: "Gere uma rota post('/webhooks/mercadopago') no Express.js que processa notificações de pagamento. O script deve validar a assinatura do Mercado Pago, buscar o status do pagamento na API oficial usando o ID recebido, e se estiver 'approved', atualizar o status do usuário no banco." 
      },
      { 
        id: "7_3", 
        title: "Stripe Checkout para Gestão de Planos", 
        duration: "18 min", 
        desc: "Configure sessões de checkout seguras no Stripe e crie o Portal do Cliente para que os próprios usuários gerenciem, alterem cartões ou cancelem planos de forma 100% autônoma.", 
        prompt: "Crie um script Node.js para criar uma sessão de checkout do Stripe com preço recorrente mensal e redirecionar o cliente para a tela de pagamento seguro do Stripe." 
      }
    ]
  },
  {
    id: 8,
    title: "Mídias Sociais",
    subtitle: "Estratégia e Crescimento",
    image: "images/module_social.jpg",
    description: "Fortaleça o posicionamento da sua marca, crie autoridade em canais corporativos e converta seguidores em leads qualificados.",
    lessons: [
      { 
        id: "8_1", 
        title: "Perfil e Autoridade B2B no LinkedIn", 
        duration: "16 min", 
        desc: "Como escrever cabeçalhos, bios e descrições otimizados no seu perfil profissional para atrair clientes corporativos de alto poder aquisitivo.", 
        prompt: "Crie um guia de otimização de perfil no LinkedIn focado em 'Especialista em Automações de Processos e Inteligência Artificial B2B'. Sugira 3 headlines de impacto e um texto para a seção 'Sobre' focado em conversão." 
      },
      { 
        id: "8_2", 
        title: "Calendário Editorial de Conteúdo Mensal", 
        duration: "18 min", 
        desc: "Como estruturar um funil de postagens divididos em: atração (conteúdo amplo/humor), autoridade (cases técnicos/tutoriais) e conversão (oferta direta do SaaS).", 
        prompt: "Gere um cronograma editorial contendo 5 ideias de publicações técnicas sobre desenvolvimento ágil com IA. Cada publicação deve incluir título, roteiro básico dos pontos de valor e CTA convidativo." 
      },
      { 
        id: "8_3", 
        title: "Funil no Direct do Instagram com ManyChat", 
        duration: "14 min", 
        desc: "Configuração prática do fluxo de conversação do ManyChat, capturando dados do seguidor e redirecionando-o para links de compra segura.", 
        prompt: "Escreva a copy de uma sequência automática de 3 mensagens do Direct do Instagram para leads que comentarem 'QUERO'. A primeira envia o PDF prometido, a segunda pergunta a maior dificuldade e a terceira indica o link do checkout simulado." 
      }
    ]
  },
  {
    id: 9,
    title: "Lançamento & Escala",
    subtitle: "Go-to-Market de Sucesso",
    image: "images/module_launch.jpg",
    description: "Monte seu plano de go-to-market, colete feedbacks rápidos e scale a operação comercial e a equipe de desenvolvimento.",
    lessons: [
      { 
        id: "9_1", 
        title: "Lançamento Orgânico no Product Hunt", 
        duration: "20 min", 
        desc: "O passo a passo estratégico de como cadastrar seu MicroSaaS no Product Hunt, engajar apoiadores no Reddit e alcançar a medalha de 'Produto do Dia'.", 
        prompt: "Escreva um rascunho de post de apresentação para o Product Hunt descrevendo um SaaS de IA de forma atraente, destacando os diferenciais competitivos e oferecendo um código promocional de 30% off para os apoiadores iniciais." 
      },
      { 
        id: "9_2", 
        title: "Abordagem Comercial Ativa (Outreach de Consultoria)", 
        duration: "22 min", 
        desc: "Como estruturar uma busca fria por empresas de médio porte locais e agendar reuniões focadas em desenhar soluções sob medida de eficiência operacional.", 
        prompt: "Escreva um roteiro de cold call/cold email direcionado para proprietários de agências de eventos, destacando o atraso na resposta de orçamentos e sugerindo uma demonstração rápida de um chatbot qualificador automático de leads." 
      },
      { 
        id: "9_3", 
        title: "Contratação de Time e Metodologias Ágeis", 
        duration: "18 min", 
        desc: "Como gerenciar novos desenvolvedores juniores, testar competências técnicas de forma rápida e organizar entregas usando quadros Kanban enxutos.", 
        prompt: "Desenhe um plano de teste prático de 2 horas para contratação de um desenvolvedor NodeJS júnior, definindo a tarefa de integração de API de IA a ser desenvolvida, critérios de avaliação de segurança de código e qualidade de arquitetura." 
      }
    ]
  }
];

// 2. AUTENTICAÇÃO DO DASHBOARD — exige login válido
async function checkAuth() {
  const userEmailEl = document.getElementById('user-email');
  const token = typeof getAuthToken === 'function' ? getAuthToken() : localStorage.getItem('conectwm_auth_token');

  if (!token) {
    window.location.replace('/login.html');
    return false;
  }

  if (typeof fetchAuthMe === 'function') {
    const me = await fetchAuthMe();
    if (me?.email && me?.active) {
      if (userEmailEl) userEmailEl.innerText = me.email;
      localStorage.setItem('conectwm_logged_in_user', me.email);
      localStorage.setItem('conectwm_user_is_paying', 'true');
      if (me.subscription?.expiresAt) {
        localStorage.setItem('conectwm_subscription_expires', me.subscription.expiresAt);
      }
      return true;
    }
  }

  if (typeof clearAuthSession === 'function') clearAuthSession();
  else {
    localStorage.removeItem('conectwm_auth_token');
    localStorage.removeItem('conectwm_logged_in_user');
    localStorage.removeItem('conectwm_user_is_paying');
    localStorage.removeItem('conectwm_subscription_expires');
  }

  window.location.replace('/login.html?error=sessao');
  return false;
}

// 3. LOGOUT
function handleLogout() {
  if (typeof clearAuthSession === 'function') clearAuthSession();
  else {
    localStorage.removeItem('conectwm_logged_in_user');
    localStorage.removeItem('conectwm_user_is_paying');
    localStorage.removeItem('conectwm_auth_token');
  }
  window.location.href = '/login.html';
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
        nav.classList.remove('text-sky-400', 'border-sky-400');
        nav.classList.add('text-gray-400', 'border-transparent');
      });
      item.classList.add('text-sky-400', 'border-sky-400');
      item.classList.remove('text-gray-400', 'border-transparent');

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
          <span>${moduleWizardsData[mod.id] ? moduleWizardsData[mod.id].steps.length + ' etapas' : mod.lessons.length + ' aulas'}</span>
          <span class="text-sky-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Iniciar Passo a Passo <i data-lucide="chevron-right" class="h-4 w-4"></i>
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

// 6. ABRIR MÓDULO — Wizard Interativo Passo a Passo
function openModule(moduleId) {
  const mod = modulesData.find(m => m.id === moduleId);
  if (!mod) return;

  const modulesListDiv = document.getElementById('modules-list-wrapper');
  const lessonViewerDiv = document.getElementById('lesson-viewer-wrapper');

  if (modulesListDiv && lessonViewerDiv) {
    modulesListDiv.classList.add('hidden');
    lessonViewerDiv.classList.remove('hidden');
  }

  document.getElementById('current-module-title').innerText = `Módulo ${mod.id}: ${mod.title}`;
  document.getElementById('current-module-subtitle').innerText = mod.subtitle;

  const wizard = moduleWizardsData[moduleId];
  const introEl = document.getElementById('wizard-step-container');
  const saved = loadWizardProgress(moduleId);
  const isDone = localStorage.getItem(`conectwm_module_done_${moduleId}`) === 'true';

  if (introEl && wizard) {
    introEl.innerHTML = `
      <div class="fade-in space-y-4 text-center py-8">
        <div class="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/30 px-4 py-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider">
          Módulo ${mod.id} — Passo a Passo
        </div>
        ${isDone ? '<span class="inline-block text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full">✓ Módulo Concluído</span>' : ''}
        <h3 class="text-2xl font-bold font-outfit text-white">${wizard.title}</h3>
        <p class="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">${wizard.intro}</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <button id="wizard-start-btn" class="px-8 py-4 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-sm transition-all btn-glow-tech font-outfit">
            ${saved ? 'Continuar de Onde Parou →' : 'Começar Agora →'}
          </button>
          ${saved ? '<button id="wizard-restart-intro-btn" class="px-6 py-4 rounded-xl bg-slate-900 border border-gray-800 text-gray-400 hover:text-white font-bold text-sm transition-all font-outfit">Recomeçar do Zero</button>' : ''}
        </div>
      </div>
    `;
    document.getElementById('wizard-start-btn')?.addEventListener('click', () => {
      initModuleWizard(moduleId);
    });
    document.getElementById('wizard-restart-intro-btn')?.addEventListener('click', () => {
      localStorage.removeItem(getWizardProgressKey(moduleId));
      initModuleWizard(moduleId);
    });
  }

  const playlistContainer = document.getElementById('lessons-playlist');
  if (playlistContainer) {
    playlistContainer.innerHTML = '<p class="text-xs text-gray-500 p-3">Clique em "Começar Agora" para ver as etapas.</p>';
  }

  const progressBar = document.getElementById('wizard-progress-bar');
  const progressLabel = document.getElementById('wizard-progress-label');
  if (progressBar) progressBar.style.width = '0%';
  if (progressLabel) progressLabel.textContent = 'Pronto para iniciar';
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

// 11. DADOS DAS DICAS DE SEGURANÇA E PROMPTS APPSEC
const securityTipsData = [
  {
    id: 1,
    title: "Vazamento de Credenciais (.env)",
    icon: "eye-off",
    desc: "Nunca submeta arquivos .env ou segredos hardcoded no Git. Use variáveis de ambiente injetadas de forma segura no runtime.",
    prompt: "Analise o código a seguir e procure por chaves de API brutas (hardcoded) ou variáveis sensíveis expostas. Forneça o código corrigido usando process.env."
  },
  {
    id: 2,
    title: "SQL Injection (SQLi)",
    icon: "database",
    desc: "Evite concatenar variáveis de entrada diretamente em strings SQL. Sempre use prepared statements ou ORMs como Prisma/Sequelize.",
    prompt: "Verifique se o seguinte código contém vulnerabilidade de injeção de SQL. Se sim, reescreva-o usando Prepared Statements ou parametrização segura."
  },
  {
    id: 3,
    title: "CORS Permissivo",
    icon: "lock",
    desc: "Não configure CORS com o curinga '*'. Restrinja as origens de API apenas ao seu domínio confiável em produção.",
    prompt: "Examine as configurações de CORS deste código. Reescreva a política para restringir o acesso apenas a domínios autorizados e prevenir requisições não autorizadas."
  },
  {
    id: 4,
    title: "Falta de Rate Limiting",
    icon: "zap",
    desc: "Endpoints sem limite de taxa são suscetíveis a ataques DDoS e ataques de força bruta, além de estouro de faturamento de APIs.",
    prompt: "Identifique se os endpoints deste código Express.js possuem Rate Limiting. Escreva um middleware limitador de requisições para proteger as rotas contra spam."
  },
  {
    id: 5,
    title: "Cross-Site Scripting (XSS)",
    icon: "code",
    desc: "Sanitize todas as entradas de usuário antes de renderizá-las no navegador para evitar injeção de scripts maliciosos.",
    prompt: "Analise o código em busca de falhas de XSS na renderização de entradas do usuário. Mostre como sanitizar os inputs usando bibliotecas como DOMPurify ou escaping correto."
  },
  {
    id: 6,
    title: "Cross-Site Request Forgery (CSRF)",
    icon: "shield",
    desc: "Proteja rotas POST/PUT de alteração de estado contra requisições indesejadas vindas de outras abas utilizando cookies SameSite e tokens CSRF.",
    prompt: "Verifique se o código protege contra ataques CSRF nas rotas de escrita (POST/PUT). Escreva uma implementação com tokens CSRF e cookies seguros."
  },
  {
    id: 7,
    title: "Armazenamento Inseguro de JWT",
    icon: "key",
    desc: "Não guarde tokens JWT no localStorage. Prefira Cookies seguros com as flags httpOnly, secure e SameSite=Strict.",
    prompt: "Avalie como o token JWT está sendo enviado e armazenado nesta autenticação. Forneça a promoção do token para cookies protegidos com httpOnly."
  },
  {
    id: 8,
    title: "Validação Incompleta de Payload",
    icon: "check-square",
    desc: "Sempre valide os formatos, tipos e tamanhos de inputs no backend utilizando bibliotecas como Zod, Joi ou Yup.",
    prompt: "Analise os objetos de entrada recebidos nas rotas e reescreva a validação utilizando um validador de schema estruturado como Zod ou Joi."
  },
  {
    id: 9,
    title: "Vazamento de Stack Traces",
    icon: "alert-triangle",
    desc: "Retornar o stack trace bruto do backend expõe detalhes internos do servidor. Trate erros e retorne mensagens amigáveis.",
    prompt: "Examine os blocos catch e middlewares de tratamento de erro do código. Ajuste-os para não expor stack traces detalhados e retornar apenas mensagens amigáveis genéricas."
  },
  {
    id: 10,
    title: "Broken Object Level Authorization (IDOR)",
    icon: "users",
    desc: "Nunca confie que o usuário logado só enviará IDs pertencentes a ele nas requisições. Valide a titularidade no banco de dados.",
    prompt: "Verifique se este código possui vulnerabilidade IDOR, onde IDs de recursos são alterados sem validação de propriedade. Ajuste o middleware para checar a titularidade do recurso."
  },
  {
    id: 11,
    title: "Dependências Vulneráveis",
    icon: "package",
    desc: "Mantenha pacotes npm sempre atualizados e audite as dependências de segurança periodicamente com npm audit.",
    prompt: "Forneça as melhores práticas e comandos de auditoria para identificar e corrigir pacotes vulneráveis no package.json deste projeto."
  },
  {
    id: 12,
    title: "Senhas em Texto Claro",
    icon: "key",
    desc: "Nunca salve senhas limpas. Sempre criptografe antes de armazená-las no banco usando funções robustas com salt, como bcrypt.",
    prompt: "Analise o processo de registro e login de usuários deste código. Substitua criptografias fracas pela biblioteca bcrypt ou argon2 com salt adequado."
  },
  {
    id: 13,
    title: "Injeção de Comando no OS (RCE)",
    icon: "terminal",
    desc: "Evite funções como child_process.exec ou eval passando entradas diretas de usuários, pois permitem invasão total do servidor.",
    prompt: "Examine se há funções exec, eval, ou child_process executando strings baseadas em inputs de usuários. Reescreva o fluxo sem executar comandos do sistema."
  },
  {
    id: 14,
    title: "Uploads de Arquivos Inseguros",
    icon: "upload-cloud",
    desc: "Limite o tamanho do arquivo, valide a extensão por whitelist e o tipo MIME real. Salve arquivos fora da raiz pública de execução.",
    prompt: "Audite esta lógica de upload de arquivos. Adicione validação de extensão por whitelist, validação de MIME type real e salve os arquivos fora da pasta pública executável."
  },
  {
    id: 15,
    title: "Ausência do Middleware Helmet",
    icon: "shield-alert",
    desc: "Use o middleware Helmet no Express para injetar automaticamente cabeçalhos fundamentais de segurança HTTP (como CSP, X-Frame-Options).",
    prompt: "Ajuste esta aplicação Express adicionando middlewares como Helmet para configurar cabeçalhos de segurança (CSP, HSTS, X-Content-Type-Options)."
  },
  {
    id: 16,
    title: "Dados Sensíveis Não Cifrados",
    icon: "lock",
    desc: "Dados confidenciais como CPFs, documentos ou cartões devem ser encriptados no banco de dados com algoritmos simétricos como AES-256.",
    prompt: "Proponha a implementação de criptografia simétrica AES-256 no banco de dados para campos de dados sensíveis antes de salvá-los no modelo."
  },
  {
    id: 17,
    title: "Sessões e Cookies Vulneráveis",
    icon: "cookie",
    desc: "Configure cookies de sessão com atributos de segurança rígidos e tempo de expiração curto para evitar ataques de Session Hijacking.",
    prompt: "Avalie a configuração do express-session ou cookie-parser deste código e configure os cookies de sessão de forma restrita (Secure, HttpOnly, SameSite, Max-Age)."
  },
  {
    id: 18,
    title: "Exposição Excessiva na API",
    icon: "file-warning",
    desc: "Remova propriedades privadas do banco (como senhas hash e segredos de token) dos objetos JSON antes de retornar nas APIs.",
    prompt: "Reescreva a rota de consulta a usuários para garantir que propriedades privadas (como password_hash) sejam deletadas do objeto antes do retorno JSON da API."
  },
  {
    id: 19,
    title: "Falta de Logs e Auditoria",
    icon: "file-text",
    desc: "Mantenha um log detalhado de ações administrativas críticas do sistema para permitir análise pós-incidente.",
    prompt: "Crie uma estrutura simples de log de auditoria no Express que registra no arquivo de logs eventos críticos, contendo timestamp, IP, rota e ID do usuário autenticado."
  },
  {
    id: 20,
    title: "Privilégios de Sistema Excessivos",
    icon: "activity",
    desc: "Execute o processo NodeJS do backend sob um usuário do sistema sem privilégios administrativos (evite rodar como root/administrador).",
    prompt: "Explique como auditar as permissões de arquivos e pastas no servidor Linux/Windows deste SaaS, garantindo que o processo web tenha privilégios mínimos."
  },
  {
    id: 21,
    title: "Redirecionamento Aberto (Open Redirect)",
    icon: "link",
    desc: "Evite redirecionar usuários para URLs externas dinâmicas vindas de parâmetros (como ?next=...) sem validá-las em uma whitelist.",
    prompt: "Analise se este código possui redirecionamentos abertos (Open Redirect) baseados em entradas de query. Escreva uma checagem de domínio por whitelist para bloquear destinos externos maliciosos."
  },
  {
    id: 22,
    title: "Divulgação de Versão de Software",
    icon: "info",
    desc: "Omitir cabeçalhos padrão do servidor (como X-Powered-By ou Server) dificulta que atacantes identifiquem exploits específicos da versão.",
    prompt: "Ajuste o servidor de forma a ocultar os cabeçalhos de assinatura do software (como X-Powered-By: Express ou Server: nginx) para mitigar fingerprinting."
  },
  {
    id: 23,
    title: "DNS com Política HSTS",
    icon: "globe",
    desc: "Habilite HSTS (HTTP Strict Transport Security) para forçar o navegador a usar conexões HTTPS em todas as comunicações com seu SaaS.",
    prompt: "Proponha a configuração e cabeçalho do Strict-Transport-Security (HSTS) para o backend Node/Express, incluindo suporte a subdomínios e preload."
  },
  {
    id: 24,
    title: "Desativação de Contas Suspeitas",
    icon: "user-x",
    desc: "Implemente mecanismos automáticos de suspensão temporária para contas que apresentem múltiplos logins com falha ou atividades de spam.",
    prompt: "Crie um algoritmo ou modelo de bloqueio temporário de usuário no banco de dados após 5 tentativas falhas de login (Account Lockout), com contador e timestamp de liberação."
  },
  {
    id: 25,
    title: "Redirecionamento HTTPS Forçado",
    icon: "shield-check",
    desc: "Force o redirecionamento automático de tráfego HTTP comum para HTTPS seguro na camada de servidor ou aplicação.",
    prompt: "Escreva um middleware para Express.js que detecta se a requisição é HTTP comum e força o redirecionamento automático para HTTPS (enforce SSL)."
  },
  {
    id: 26,
    title: "Ataques de Deserialização Insegura",
    icon: "refresh-cw",
    desc: "Evite converter payloads brutos complexos (como arquivos binários serialized) de fontes não confiáveis em objetos em memória.",
    prompt: "Analise se o código utiliza deserialização insegura de objetos (como funções JSON.parse abusadas, eval ou pacotes de serialização antigos). Corrija aplicando validação estrita."
  },
  {
    id: 27,
    title: "Broken Function Level Authorization (BFLA)",
    icon: "user-check",
    desc: "Valide se o usuário logado possui a role (permissão de cargo, como 'admin') antes de deixá-lo acessar endpoints de gerenciamento corporativo.",
    prompt: "Escreva um middleware de controle de acesso baseado em papéis (RBAC) no Express que valida se o usuário possui a role necessária ('admin', 'editor') para a rota ativa."
  },
  {
    id: 28,
    title: "Ataques de Força Bruta (Senha e MFA)",
    icon: "unlock",
    desc: "Adicione delays lineares ou exponenciais após senhas incorretas sucessivas para travar a velocidade de ataques automatizados de dicionário.",
    prompt: "Escreva uma lógica de atraso progressivo (linear delay) no endpoint de login após falhas sucessivas para inviabilizar ataques de força bruta rápidos."
  },
  {
    id: 29,
    title: "XML External Entity (XXE) Injection",
    icon: "file-code",
    desc: "Configure parseadores de XML no backend para desativar resoluções de entidades externas e evitar vazamento de arquivos locais do servidor.",
    prompt: "Audite o parseador de XML deste código e reconfigure-o para desabilitar a resolução de DTD (Document Type Definition) e entidades externas (XXE)."
  },
  {
    id: 30,
    title: "Diretório Git Exposto (.git)",
    icon: "git-branch",
    desc: "Pastas .git expostas em servidores de produção permitem que invasores baixem todo o código-fonte da aplicação.",
    prompt: "Explique como configurar o servidor web (Nginx/Apache) para bloquear o acesso público à pasta oculta .git e diretórios correlatos."
  },
  {
    id: 31,
    title: "Senhas Fracas no Cadastro",
    icon: "shield-off",
    desc: "Exija requisitos mínimos de senha (letras maiúsculas, minúsculas, números, caracteres especiais e tamanho) para barrar senhas óbvias.",
    prompt: "Crie um script de validação de senha robusto usando Regex ou a biblioteca password-validator, garantindo que senhas fracas sejam barradas no registro de usuários."
  },
  {
    id: 32,
    title: "Server-Side Request Forgery (SSRF)",
    icon: "send",
    desc: "Nunca permita que a aplicação envie requisições HTTP para URLs dinâmicas informadas por usuários sem checar se pertencem a IPs internos privados.",
    prompt: "Verifique se este código possui falha SSRF ao fazer requisições fetch baseadas em URLs fornecidas pelo cliente. Ajuste o código para barrar requisições para IPs de rede local (127.0.0.1, 10.0.0.0, etc.)."
  },
  {
    id: 33,
    title: "Metadados de Arquivos Enviados (Vazamento)",
    icon: "image",
    desc: "Remova metadados (como tags EXIF contendo geolocalização e modelo do celular) de imagens enviadas por usuários antes de salvá-las.",
    prompt: "Escreva um script usando a biblioteca sharp ou similar para processar imagens enviadas via upload e remover metadados EXIF confidenciais antes do armazenamento definitivo."
  },
  {
    id: 34,
    title: "Configurações Padrão Inseguras",
    icon: "settings",
    desc: "Altere credenciais padrão de bancos de dados, portas padrão e caminhos administrativos conhecidos de ferramentas integradas.",
    prompt: "Forneça um checklist de hardening de configuração e portas padrão (como mudar a porta default do Postgres ou Redis, desativar logs verbose, etc.)."
  },
  {
    id: 35,
    title: "Cache Inseguro de Páginas Privadas",
    icon: "hard-drive",
    desc: "Configure headers de controle de cache (Cache-Control: no-store) para impedir que dados sensíveis de usuários logados fiquem salvos em caches públicos.",
    prompt: "Configure os cabeçalhos de controle de cache do Express para garantir que rotas privadas com dados financeiros ou pessoais não sejam cacheadas no navegador."
  },
  {
    id: 36,
    title: "Vulnerabilidade Prototype Pollution",
    icon: "skull",
    desc: "Evite mesclagens recursivas de objetos usando parâmetros do usuário não sanitizados que possam sobrescrever o protótipo base do JavaScript.",
    prompt: "Verifique se o seguinte código Express/Javascript está vulnerável a Prototype Pollution através de clonagens profundas de objetos não validados. Reescreva de forma segura."
  },
  {
    id: 37,
    title: "Session Cookies Sem Flags Necessárias",
    icon: "cookie",
    desc: "Garanta que cookies de sessão trafeguem sempre com Secure (somente HTTPS) e HttpOnly (indetectável por JS).",
    prompt: "Audite a criação de cookies neste backend Express e reescreva a lógica configurando as flags HttpOnly, Secure e SameSite corretas."
  },
  {
    id: 38,
    title: "Abuso de Reset de Senha (Tokens Previsíveis)",
    icon: "rotate-ccw",
    desc: "Tokens de redefinição de senha devem ser gerados usando geradores criptográficos aleatórios (não sequenciais) e possuir expiração curta.",
    prompt: "Substitua a lógica de geração de tokens de reset de senha previsíveis (como Math.random) por criptografia robusta de números aleatórios usando o módulo crypto do Node.js."
  },
  {
    id: 39,
    title: "Ataques DDoS via Expressões Regulares (ReDoS)",
    icon: "search",
    desc: "Expressões regulares complexas (como com backtracking catastrófico) podem travar a thread principal do NodeJS se testadas contra payloads gigantes.",
    prompt: "Examine as expressões regulares do código e identifique possíveis brechas para ReDoS (Regular Expression Denial of Service). Reescreva as regex de forma segura."
  },
  {
    id: 40,
    title: "Vazamento de Dados Pessoais em Logs",
    icon: "alert-circle",
    desc: "Evite registrar senhas de usuários, números de cartões ou dados pessoais sensíveis em arquivos de texto de log de erro do servidor.",
    prompt: "Crie uma função sanitizadora de logs em Javascript que mascara informações sensíveis (como CPFs, emails e cartões de crédito) antes de escrevê-los nos logs."
  },
  {
    id: 41,
    title: "Referer Leakage (API Keys em Headers)",
    icon: "link",
    desc: "Proteja chaves de API trafegadas na URL para que não vazem no cabeçalho Referer quando o usuário clica em links externos.",
    prompt: "Configure a diretiva de segurança Referrer-Policy apropriada no Express para bloquear o vazamento de caminhos e parâmetros de query sigilosos para sites terceiros."
  },
  {
    id: 42,
    title: "Ausência de Multi-Factor Authentication (MFA)",
    icon: "smartphone",
    desc: "Exija autenticação em duas etapas para acessos administrativos vitais do seu SaaS.",
    prompt: "Forneça o fluxo e o código inicial para integrar autenticação em duas etapas baseada em TOTP (Google Authenticator) no NodeJS utilizando a biblioteca otplib."
  },
  {
    id: 43,
    title: "Vulnerabilidade de Clickjacking",
    icon: "layers",
    desc: "Impeça que seu site ou dashboard de pagamento seja renderizado dentro de tags iframe de portais maliciosos para roubar cliques.",
    prompt: "Adicione as configurações necessárias de cabeçalho X-Frame-Options e Content-Security-Policy (frame-ancestors) para desativar iframes de terceiros."
  },
  {
    id: 44,
    title: "APIs REST Sem Escopo de Escrita",
    icon: "key",
    desc: "Valide se o token de acesso (OAuth/API Key) possui permissão específica de escrita (write) antes de efetuar alterações no banco de dados.",
    prompt: "Escreva uma lógica de validação de escopos de API (Scope Validation) que checa se o token do portador possui escopos adequados ('read', 'write') para acessar a rota."
  },
  {
    id: 45,
    title: "Injeção de E-mail / SMTP Headers",
    icon: "mail",
    desc: "Entradas de usuários que alimentam o campo de destinatário (To), cópia (CC) ou assunto de e-mails devem ser sanitizadas para evitar spam.",
    prompt: "Analise a lógica de envio de e-mails em busca de falhas de injeção de cabeçalhos SMTP/Email. Adicione sanitização para prevenir que caracteres de quebra de linha (CRLF) injetem destinatários ocultos."
  },
  {
    id: 46,
    title: "Divulgação de Portas e Serviços Internos",
    icon: "server",
    desc: "Proteja servidores internos (como bancos de dados ou instâncias de cache) bloqueando o acesso direto da internet e permitindo conexões apenas da VPC interna.",
    prompt: "Descreva boas práticas para configurar firewalls (como UFW, Security Groups) para restringir o acesso público aos serviços de banco de dados e APIs internas do projeto."
  },
  {
    id: 47,
    title: "Backups Desprotegidos no Diretório Web",
    icon: "archive",
    desc: "Nunca compacte arquivos ou realize dumps de bancos de dados (.zip, .sql) salvando-os diretamente na pasta pública do servidor.",
    prompt: "Escreva uma checagem automatizada para verificar se há arquivos de backup comuns, dumps de banco SQL ou arquivos compactados expostos no diretório público do Express."
  },
  {
    id: 48,
    title: "Ausência de Content Security Policy (CSP)",
    icon: "shield",
    desc: "Impeça a injeção e execução de arquivos JavaScript de domínios maliciosos não declarados nas tags de cabeçalho CSP.",
    prompt: "Estruture uma Content-Security-Policy (CSP) robusta e configurável para o middleware Helmet no Express, restringindo fontes de scripts de origens desconhecidas."
  },
  {
    id: 49,
    title: "Cookies Sem SameSite",
    icon: "cookie",
    desc: "Defina explicitamente SameSite=Lax ou SameSite=Strict em todos os cookies de sessão para prevenir o roubo de requisições de origem cruzada.",
    prompt: "Ajuste os cabeçalhos de resposta deste código para garantir que todo cookie setado possua a flag SameSite configurada corretamente."
  },
  {
    id: 50,
    title: "Excesso de Informações no Registro de Erros",
    icon: "file-warning",
    desc: "Não salve logs verbosos em ambientes de produção. Configure o nível do logger para logs críticos de aviso e erro.",
    prompt: "Configure um logger profissional como Winston ou Pino no Node.js para alternar automaticamente o nível de log entre verbose (desenvolvimento) e error/critical (produção)."
  }
];

// 11. FORMULÁRIO DE STACK — SEGURANÇA
const SECURITY_WIZARD_KEY = 'conectwm_security_stack';

const securityWizardSteps = [
  {
    id: 'linguagem',
    title: 'Etapa 1 — Linguagem de Programação',
    question: 'Qual linguagem seu sistema usa no backend?',
    tip: 'Isso personaliza os prompts de auditoria para a sintaxe e frameworks corretos.',
    field: 'linguagem',
    options: [
      { value: 'nodejs', label: 'JavaScript / Node.js (Express, Fastify, NestJS)' },
      { value: 'python', label: 'Python (Django, Flask, FastAPI)' },
      { value: 'php', label: 'PHP (Laravel, WordPress, CodeIgniter)' },
      { value: 'csharp', label: 'C# / .NET (ASP.NET Core)' },
      { value: 'java', label: 'Java (Spring Boot)' },
      { value: 'outra', label: 'Outra linguagem' }
    ]
  },
  {
    id: 'banco',
    title: 'Etapa 2 — Banco de Dados',
    question: 'Qual banco de dados seu projeto utiliza?',
    tip: 'Cada banco tem riscos específicos: SQL Injection, regras Firestore, RLS no Supabase, etc.',
    field: 'banco',
    options: [
      { value: 'postgresql', label: 'PostgreSQL (Supabase, Neon, VPS)' },
      { value: 'mysql', label: 'MySQL / MariaDB' },
      { value: 'firebase', label: 'Firebase Firestore (NoSQL)' },
      { value: 'mongodb', label: 'MongoDB' },
      { value: 'sqlite', label: 'SQLite' },
      { value: 'sqlserver', label: 'Microsoft SQL Server' },
      { value: 'nenhum', label: 'Ainda não tenho banco definido' }
    ]
  },
  {
    id: 'sistema',
    title: 'Etapa 3 — Sistema / Framework',
    question: 'Qual é o tipo do seu sistema ou framework principal?',
    field: 'sistema',
    options: [
      { value: 'saas_express', label: 'SaaS com API REST (Express / Fastify)' },
      { value: 'nextjs', label: 'Next.js (React full-stack)' },
      { value: 'firebase_full', label: 'Firebase completo (Auth + Firestore + Hosting)' },
      { value: 'supabase_full', label: 'Supabase (Auth + PostgreSQL + Edge Functions)' },
      { value: 'wordpress', label: 'WordPress / CMS' },
      { value: 'laravel', label: 'Laravel (PHP)' },
      { value: 'django', label: 'Django / FastAPI (Python)' },
      { value: 'landing', label: 'Site estático / Landing page (HTML/JS)' },
      { value: 'outro', label: 'Outro / ainda definindo' }
    ]
  },
  {
    id: 'hospedagem_sec',
    title: 'Etapa 4 — Onde está hospedado?',
    question: 'Onde seu sistema roda em produção (ou vai rodar)?',
    field: 'hospedagem',
    options: [
      { value: 'firebase', label: 'Firebase Hosting / Functions' },
      { value: 'vercel', label: 'Vercel / Netlify' },
      { value: 'vps', label: 'VPS (DigitalOcean, Hetzner, AWS EC2)' },
      { value: 'shared', label: 'Hospedagem compartilhada (cPanel)' },
      { value: 'local', label: 'Ainda só local / em desenvolvimento' }
    ]
  }
];

const securityLabels = {
  linguagem: { nodejs: 'Node.js', python: 'Python', php: 'PHP', csharp: 'C#/.NET', java: 'Java', outra: 'Outra' },
  banco: { postgresql: 'PostgreSQL', mysql: 'MySQL', firebase: 'Firebase Firestore', mongodb: 'MongoDB', sqlite: 'SQLite', sqlserver: 'SQL Server', nenhum: 'Sem banco ainda' },
  sistema: { saas_express: 'SaaS API REST', nextjs: 'Next.js', firebase_full: 'Firebase Full-Stack', supabase_full: 'Supabase', wordpress: 'WordPress', laravel: 'Laravel', django: 'Django/FastAPI', landing: 'Site estático', outro: 'Outro' },
  hospedagem: { firebase: 'Firebase', vercel: 'Vercel/Netlify', vps: 'VPS', shared: 'Hospedagem compartilhada', local: 'Local/dev' }
};

let securityWizardState = { step: 0, answers: {} };

function loadSecurityStack() {
  try {
    const saved = localStorage.getItem(SECURITY_WIZARD_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return null;
}

function saveSecurityStack(answers) {
  localStorage.setItem(SECURITY_WIZARD_KEY, JSON.stringify(answers));
}

function buildSecurityMasterPrompt(answers) {
  const lang = securityLabels.linguagem[answers.linguagem] || 'Node.js';
  const db = securityLabels.banco[answers.banco] || 'PostgreSQL';
  const sys = securityLabels.sistema[answers.sistema] || 'SaaS';
  const host = securityLabels.hospedagem[answers.hospedagem] || 'VPS';

  return `Aja como auditor AppSec sênior especialista em ${lang} e ${sys}.

CONTEXTO DO MEU PROJETO:
- Linguagem: ${lang}
- Banco de dados: ${db}
- Sistema/Framework: ${sys}
- Hospedagem: ${host}

Analise o código que vou colar e verifique vulnerabilidades críticas ESPECÍFICAS para este stack:
${answers.banco === 'firebase' ? '- Regras Firestore inseguras, Auth mal configurado, API keys expostas' : ''}
${answers.banco === 'postgresql' || answers.banco === 'mysql' ? '- SQL Injection, queries sem parametrização, credenciais expostas' : ''}
${answers.linguagem === 'nodejs' ? '- XSS, CSRF, JWT em localStorage, CORS *, dependências npm vulneráveis' : ''}
${answers.linguagem === 'php' ? '- SQLi, XSS, includes locais, uploads inseguros, versão PHP desatualizada' : ''}
${answers.linguagem === 'python' ? '- Django/Flask misconfig, SECRET_KEY exposta, SQLAlchemy injection' : ''}
- Headers de segurança faltantes (Helmet/CSP)
- Rate limiting ausente
- .env ou secrets no Git
- IDOR / Broken Access Control
- Uploads de arquivo inseguros
- Logs com dados sensíveis

Para cada falha encontrada: nome da vulnerabilidade, linha/arquivo, risco, e código corrigido para ${lang} + ${db}.`;
}

function personalizeSecurityPrompt(basePrompt, answers) {
  const lang = securityLabels.linguagem[answers.linguagem] || 'Node.js';
  const db = securityLabels.banco[answers.banco] || 'PostgreSQL';
  return `[Stack: ${lang} + ${db}] ${basePrompt}`;
}

function initSecurityWizard() {
  const saved = loadSecurityStack();
  if (saved && saved.linguagem && saved.banco && saved.sistema) {
    securityWizardState.answers = saved;
    showSecurityContent(saved);
    return;
  }
  renderSecurityWizardStep();
}

function renderSecurityWizardStep() {
  const wrapper = document.getElementById('security-wizard-wrapper');
  if (!wrapper) return;

  const step = securityWizardSteps[securityWizardState.step];
  if (!step) return;

  const saved = securityWizardState.answers[step.field];
  const total = securityWizardSteps.length;
  const pct = Math.round(((securityWizardState.step + 1) / total) * 100);

  const optionsHtml = step.options.map(opt => `
    <button type="button" class="security-choice-btn text-left p-4 rounded-xl border transition-all w-full ${
      saved === opt.value
        ? 'bg-sky-500/15 border-sky-500/40 text-white ring-1 ring-sky-500/30'
        : 'bg-slate-900/60 border-gray-800 hover:border-sky-500/30 text-gray-300 hover:text-white'
    }" data-value="${opt.value}">
      <span class="text-sm font-semibold">${opt.label}</span>
    </button>
  `).join('');

  wrapper.innerHTML = `
    <div class="space-y-5 fade-in">
      <div class="flex items-center justify-between gap-4">
        <span class="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-1 text-xs font-bold text-sky-400 uppercase tracking-wider">
          🛡️ ${step.title}
        </span>
        <span class="text-xs text-gray-500 font-mono">${securityWizardState.step + 1}/${total}</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
        <div class="h-full bg-sky-400 transition-all duration-300" style="width:${pct}%"></div>
      </div>
      <h3 class="text-xl font-bold font-outfit text-white">${step.question}</h3>
      ${step.tip ? `<p class="text-gray-500 text-sm">💡 ${step.tip}</p>` : ''}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${optionsHtml}</div>
      <div class="flex justify-between pt-4 border-t border-gray-900">
        <button id="sec-wiz-prev" class="px-5 py-3 rounded-xl bg-slate-900 border border-gray-800 text-sm font-bold text-gray-400 hover:text-white transition-all ${securityWizardState.step === 0 ? 'opacity-40 cursor-not-allowed' : ''}" ${securityWizardState.step === 0 ? 'disabled' : ''}>← Anterior</button>
        <button id="sec-wiz-next" class="px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-sm font-bold transition-all btn-glow-tech">
          ${securityWizardState.step === total - 1 ? 'Ver Dicas de Segurança →' : 'Próxima →'}
        </button>
      </div>
    </div>
  `;

  wrapper.querySelectorAll('.security-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrapper.querySelectorAll('.security-choice-btn').forEach(b => {
        b.className = 'security-choice-btn text-left p-4 rounded-xl border transition-all w-full bg-slate-900/60 border-gray-800 hover:border-sky-500/30 text-gray-300 hover:text-white';
      });
      btn.className = 'security-choice-btn text-left p-4 rounded-xl border transition-all w-full bg-sky-500/15 border-sky-500/40 text-white ring-1 ring-sky-500/30';
      securityWizardState.answers[step.field] = btn.dataset.value;
    });
  });

  document.getElementById('sec-wiz-prev')?.addEventListener('click', () => {
    if (securityWizardState.step > 0) {
      securityWizardState.step--;
      renderSecurityWizardStep();
    }
  });

  document.getElementById('sec-wiz-next')?.addEventListener('click', () => {
    if (!securityWizardState.answers[step.field]) {
      alert('Selecione uma opção para continuar.');
      return;
    }
    if (securityWizardState.step < total - 1) {
      securityWizardState.step++;
      renderSecurityWizardStep();
    } else {
      saveSecurityStack(securityWizardState.answers);
      showSecurityContent(securityWizardState.answers);
    }
  });
}

function showSecurityContent(answers) {
  const wizardWrap = document.getElementById('security-wizard-wrapper');
  const contentWrap = document.getElementById('security-content-wrapper');
  const summary = document.getElementById('security-stack-summary');

  if (wizardWrap) wizardWrap.classList.add('hidden');
  if (contentWrap) contentWrap.classList.remove('hidden');

  if (summary) {
    summary.innerHTML = `
      <div class="flex flex-wrap gap-2 text-xs">
        <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-gray-800 text-gray-300"><strong class="text-sky-400">Linguagem:</strong> ${securityLabels.linguagem[answers.linguagem] || '—'}</span>
        <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-gray-800 text-gray-300"><strong class="text-sky-400">Banco:</strong> ${securityLabels.banco[answers.banco] || '—'}</span>
        <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-gray-800 text-gray-300"><strong class="text-sky-400">Sistema:</strong> ${securityLabels.sistema[answers.sistema] || '—'}</span>
        <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-gray-800 text-gray-300"><strong class="text-sky-400">Hospedagem:</strong> ${securityLabels.hospedagem[answers.hospedagem] || '—'}</span>
      </div>
      <button id="sec-wiz-reconfig" class="text-xs font-bold text-sky-400 hover:text-sky-300 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">Reconfigurar Stack</button>
    `;
    document.getElementById('sec-wiz-reconfig')?.addEventListener('click', () => {
      securityWizardState = { step: 0, answers: {} };
      localStorage.removeItem(SECURITY_WIZARD_KEY);
      if (wizardWrap) wizardWrap.classList.remove('hidden');
      if (contentWrap) contentWrap.classList.add('hidden');
      renderSecurityWizardStep();
    });
  }

  const masterText = document.getElementById('master-prompt-text');
  if (masterText) {
    masterText.value = buildSecurityMasterPrompt(answers);
  }

  renderSecurityTipsGrid(answers);
}

// 12. RENDERIZAR DIRETRIZES DE SEGURANÇA E CONFIGURAR CLIQUES
function renderSecurityTipsGrid(answers) {
  const container = document.getElementById('security-tips-grid');
  if (!container) return;

  container.innerHTML = '';
  securityTipsData.forEach(tip => {
    const card = document.createElement('div');
    card.className = "glass-card rounded-2xl p-6 border border-sky-500/10 hover:border-sky-500/20 space-y-4 flex flex-col justify-between";
    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
            <i data-lucide="${tip.icon}" class="h-5 w-5"></i>
          </div>
          <h4 class="text-md font-bold font-outfit text-white leading-tight">${tip.title}</h4>
        </div>
        <p class="text-gray-400 text-xs leading-relaxed">${tip.desc}</p>
        
        <div class="space-y-2">
          <span class="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">Prompt de Validação</span>
          <textarea id="prompt-text-${tip.id}" readonly class="w-full h-16 bg-slate-950 border border-gray-900 rounded-xl p-2.5 text-[11px] text-sky-200/80 font-mono focus:outline-none resize-none leading-relaxed">${personalizeSecurityPrompt(tip.prompt, answers || {})}</textarea>
        </div>
      </div>
      <button data-tip-id="${tip.id}" class="copy-tip-prompt-btn w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-gray-800 text-xs font-bold transition-all mt-2">
        Copiar Prompt
      </button>
    `;
    container.appendChild(card);
  });

  // Re-inicializa ícones do Lucide após renderizar
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Configura cliques nos botões de copiar individuais
  const copyButtons = document.querySelectorAll('.copy-tip-prompt-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tipId = btn.getAttribute('data-tip-id');
      const textarea = document.getElementById(`prompt-text-${tipId}`);
      if (textarea) {
        textarea.select();
        navigator.clipboard.writeText(textarea.value);

        const originalText = btn.innerText;
        btn.innerText = "Copiado!";
        btn.classList.add('bg-green-500', 'text-slate-950', 'border-green-500');
        btn.classList.remove('bg-slate-900', 'hover:bg-slate-800', 'border-gray-800');

        setTimeout(() => {
          btn.innerText = originalText;
          btn.classList.remove('bg-green-500', 'text-slate-950', 'border-green-500');
          btn.classList.add('bg-slate-900', 'hover:bg-slate-800', 'border-gray-800');
        }, 1500);
      }
    });
  });

  // Configura botão de copiar do Prompt Mestre
  const copyMasterBtn = document.getElementById('copy-master-prompt-btn');
  const masterTextarea = document.getElementById('master-prompt-text');
  if (copyMasterBtn && masterTextarea) {
    copyMasterBtn.addEventListener('click', () => {
      masterTextarea.select();
      navigator.clipboard.writeText(masterTextarea.value);

      const originalText = copyMasterBtn.innerText;
      copyMasterBtn.innerText = "Copiado!";
      copyMasterBtn.classList.add('bg-green-500', 'text-slate-950');
      copyMasterBtn.classList.remove('bg-sky-400', 'hover:bg-sky-300');

      setTimeout(() => {
        copyMasterBtn.innerText = originalText;
        copyMasterBtn.classList.remove('bg-green-500', 'text-slate-950');
        copyMasterBtn.classList.add('bg-sky-400', 'hover:bg-sky-300');
      }, 1500);
    });
  }
}

// 13. INICIALIZAÇÃO GERAL DO PAINEL
document.addEventListener('DOMContentLoaded', async () => {
  const authed = await checkAuth();
  if (!authed) return;

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

  // Controles extras do wizard, TikTok Shop e segurança
  if (typeof initTikTokShop === 'function') initTikTokShop();
  if (typeof initDevResources === 'function') initDevResources();
  if (typeof initAfiliados === 'function') initAfiliados();
  initSecurityWizard();
});
