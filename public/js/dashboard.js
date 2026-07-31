// conectWM Academy - Dashboard Script

// 1. DADOS DOS MÓDULOS E AULASconst modulesData = [
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
    description: "Desenvolva utilitários ocultos e extensões automatizadas que resolvem gargalos complexos e geram renda passiva recorrente.",
    lessons: [
      { 
        id: "2_1", 
        title: "Descobrindo APIs Ocultas via Inspeção", 
        duration: "15 min", 
        desc: "Aprenda a monitorar e inspecionar o tráfego HTTP na aba 'Network' (Rede) dos navegadores. Útil para entender como grandes portais públicos processam dados e como você pode simular essas requisições no seu robô sem pagar por APIs oficiais caras.", 
        prompt: "Escreva um script Node.js usando fetch que faz uma requisição GET imitando os cabeçalhos de um navegador real (User-Agent, Accept, Referer, Cookie) para obter dados JSON de um endpoint público e salvar localmente." 
      },
      { 
        id: "2_2", 
        title: "Construindo Extensões para Google Chrome", 
        duration: "20 min", 
        desc: "Crie utilitários e extensões em Javascript que lêem o DOM da página ativa e automatizam tarefas complexas de automação e scraping para o cliente diretamente no navegador.", 
        prompt: "Gere os arquivos manifest.json (v3), background.js e content.js para uma extensão do Chrome que detecta números de telefone na página ativa e adiciona um botão ao lado para enviar uma mensagem rápida via API do WhatsApp Web." 
      },
      { 
        id: "2_3", 
        title: "Empacotando Scripts NodeJS em Executáveis (.exe)", 
        duration: "25 min", 
        desc: "Como compilar seus robôs criados em NodeJS em executáveis standalone (.exe para Windows e .app para Mac) utilizando a biblioteca 'pkg'. Excelente método para distribuir softwares e vender licenças físicas sem revelar o código-fonte.", 
        prompt: "Explique o passo a passo para usar a biblioteca 'pkg' do npm para empacotar um script index.js em um único arquivo .exe executável que roda de forma autônoma sem necessitar do Node.js instalado no sistema do cliente." 
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
