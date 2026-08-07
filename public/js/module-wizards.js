// conectWM Academy - Formulários Interativos Passo a Passo por Módulo

// Etapa reutilizável: Hospedagem e Infraestrutura
const HOSTING_STEP = {
  id: "hospedagem",
  title: "Hospedagem e Infraestrutura",
  question: "Como você quer hospedar seu projeto? Quer começar 100% gratuito ou pode investir?",
  tip: "Para iniciantes, recomendamos Firebase (100% grátis no começo). Quando crescer, migre para Supabase ou uma VPS.",
  type: "choice",
  field: "hospedagem",
  options: [
    {
      value: "firebase",
      label: "100% gratuito · Firebase (recomendado para iniciar)",
      prompt: "Quero criar meu SaaS 100% gratuito usando Firebase. Me guie passo a passo: 1) Criar projeto no Firebase Console, 2) Configurar Authentication (email/senha e Google), 3) Criar coleções no Cloud Firestore, 4) Conectar com HTML/JS ou React, 5) Deploy gratuito no Firebase Hosting. Gere código completo com comentários."
    },
    {
      value: "supabase",
      label: "Posso pagar um pouco · Supabase (PostgreSQL na nuvem)",
      prompt: "Quero usar Supabase para meu SaaS. Me guie: 1) Criar projeto no supabase.com (tier free), 2) Modelar tabelas no PostgreSQL, 3) Configurar Supabase Auth, 4) Row Level Security (RLS), 5) Conectar frontend com @supabase/supabase-js. Gere código completo Node.js + JavaScript."
    },
    {
      value: "vps",
      label: "Quero controle total · VPS própria (DigitalOcean, Hetzner...)",
      prompt: "Quero hospedar meu SaaS em uma VPS. Me guie completo: 1) Escolher VPS barata (Hetzner/DigitalOcean), 2) Instalar Ubuntu + Node.js + PostgreSQL + Nginx, 3) Configurar PM2, 4) SSL com Certbot, 5) Deploy do Express.js. Inclua comandos Linux e estrutura de pastas."
    }
  ]
};

function getHostingLabel(h) {
  return {
    firebase: "Firebase (100% gratuito · Auth + Firestore + Hosting)",
    supabase: "Supabase (PostgreSQL na nuvem · tier free + planos pagos)",
    vps: "VPS própria (Node.js + PostgreSQL + Nginx · controle total)"
  }[h] || "Firebase (gratuito para começar)";
}

function getHostingInstructions(h, context) {
  const ctx = context || "SaaS";
  if (h === "firebase") {
    return `Use Firebase (100% GRATUITO para iniciar):
- Firebase Authentication (login email/senha + Google)
- Cloud Firestore (banco NoSQL em tempo real)
- Firebase Hosting (deploy gratuito do frontend)
- Cloud Functions (backend serverless, se precisar)
- Plano Spark é grátis · ideal para MVP e primeiros clientes`;
  }
  if (h === "supabase") {
    return `Use Supabase (tier free generoso, escala com plano pago ~$25/mês):
- PostgreSQL gerenciado (SQL relacional completo)
- Supabase Auth integrado
- Row Level Security (RLS) para proteger dados
- Storage para arquivos
- Edge Functions para webhooks e lógica backend`;
  }
  if (h === "vps") {
    return `Use VPS própria (a partir de ~R$25-50/mês · Hetzner, DigitalOcean, Contabo):
- Ubuntu 22.04 + Node.js + Express + PostgreSQL
- Nginx como reverse proxy + SSL (Certbot/Let's Encrypt)
- PM2 para manter o app sempre online
- Controle total: ideal quando tiver tráfego e precisar de performance`;
  }
  return getHostingInstructions("firebase", ctx);
}

// Catálogo de apps secretos · Módulo 2
const SECRET_APPS_CATALOG = {
  browser: [
    { name: 'Vimium', url: 'https://vimium.github.io/', type: 'Extensão', desc: 'Navegue qualquer site só com o teclado · estilo Vim.' },
    { name: 'Workona', url: 'https://workona.com/', type: 'Extensão', desc: 'Workspaces de abas por projeto · nunca mais perca contexto.' },
    { name: 'GoFullPage', url: 'https://gofullpage.com/', type: 'Extensão', desc: 'Screenshot de página inteira com um clique.' },
    { name: 'WhatRuns', url: 'https://www.whatruns.com/', type: 'Extensão', desc: 'Descubra frameworks, analytics e tech stack de qualquer site.' },
    { name: 'Text Blaze', url: 'https://blaze.today/', type: 'Extensão', desc: 'Snippets de texto com atalho · emails e respostas instantâneas.' },
    { name: 'Automa', url: 'https://automa.site/', type: 'Extensão', desc: 'Automação visual no browser · scrape, clique, preenchimento.' },
    { name: 'Hoverify', url: 'https://hoverify.com/', type: 'Extensão', desc: 'Inspecione CSS, cores e fontes de qualquer elemento rapidamente.' }
  ],
  dev: [
    { name: 'Thunder Client', url: 'https://www.thunderclient.com/', type: 'Extensão VS Code', desc: 'Postman dentro do Cursor/VS Code · teste APIs sem sair do editor.' },
    { name: 'Error Lens', url: 'https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens', type: 'Extensão VS Code', desc: 'Erros e warnings inline na linha · menos clique no Problems.' },
    { name: 'Pieces', url: 'https://pieces.app/', type: 'App', desc: 'Salva snippets com contexto e busca com IA · memória do dev.' },
    { name: 'REST Client', url: 'https://marketplace.visualstudio.com/items?itemName=humao.rest-client', type: 'Extensão VS Code', desc: 'Arquivos .http para testar endpoints versionados no Git.' },
    { name: 'GitLens', url: 'https://gitlens.amod.io/', type: 'Extensão VS Code', desc: 'Blame, histórico e autoria inline · entenda código legado.' },
    { name: 'Warp', url: 'https://www.warp.dev/', type: 'Terminal', desc: 'Terminal moderno com IA integrada · comandos sugeridos.' }
  ],
  automacao: [
    { name: 'Bardeen', url: 'https://www.bardeen.ai/', type: 'Extensão', desc: 'Automação no Chrome: scrape → planilha → CRM sem código.' },
    { name: 'Automa', url: 'https://automa.site/', type: 'Extensão', desc: 'Grave fluxos visuais e repita tarefas em qualquer site.' },
    { name: 'Tally', url: 'https://tally.so/', type: 'Web', desc: 'Formulários lindos grátis com webhook para n8n/Make.' },
    { name: 'Apify', url: 'https://apify.com/', type: 'Web', desc: 'Scrapers prontos e actors na nuvem · dados em escala.' },
    { name: 'Phantombuster', url: 'https://phantombuster.com/', type: 'Web', desc: 'Automação LinkedIn/Instagram para prospecção B2B.' },
    { name: 'Typefully', url: 'https://typefully.com/', type: 'Web', desc: 'Agende threads no X/Twitter com analytics.' }
  ],
  ia: [
    { name: 'Merlin', url: 'https://www.getmerlin.in/', type: 'Extensão', desc: 'GPT/Claude em sidebar em qualquer página aberta.' },
    { name: 'Tactiq', url: 'https://tactiq.io/', type: 'Extensão', desc: 'Transcreve Google Meet/Zoom grátis · notas automáticas.' },
    { name: 'Fireflies.ai', url: 'https://fireflies.ai/', type: 'Web', desc: 'Bot entra na reunião e gera resumo + action items.' },
    { name: 'Perplexity', url: 'https://www.perplexity.ai/', type: 'Web', desc: 'Pesquisa com IA e fontes citadas · substitui Google em research.' },
    { name: 'Otter.ai', url: 'https://otter.ai/', type: 'App', desc: 'Transcrição de áudio e reuniões em tempo real.' },
    { name: 'SparkToro', url: 'https://sparktoro.com/', type: 'Web', desc: 'Descubra onde seu público passa tempo online (poucos usam no BR).' }
  ],
  geral: [
    { name: 'Raycast', url: 'https://www.raycast.com/', type: 'App Mac', desc: 'Launcher que substitui Spotlight · atalhos, extensões, IA.' },
    { name: 'PowerToys', url: 'https://learn.microsoft.com/en-us/windows/powertoys/', type: 'App Windows', desc: 'FancyZones, renomear em lote, color picker · grátis Microsoft.' },
    { name: 'Espanso', url: 'https://espanso.org/', type: 'App', desc: 'Expansor de texto cross-platform · :email vira assinatura completa.' },
    { name: 'ShareX', url: 'https://getsharex.com/', type: 'App Windows', desc: 'Captura de tela/OCR/gravação · alternativa gratuita ao Snagit.' },
    { name: 'Excalidraw', url: 'https://excalidraw.com/', type: 'Web', desc: 'Diagramas hand-drawn colaborativos · wireframes rápidos.' },
    { name: 'Cron', url: 'https://cron.com/', type: 'App', desc: 'Calendário moderno com scheduling links · menos fricção que Calendly.' }
  ],
  packs: {
    extensoes: ['Vimium', 'Workona', 'GoFullPage', 'WhatRuns', 'Text Blaze', 'Automa', 'Merlin'],
    devpack: ['Thunder Client', 'Error Lens', 'Pieces', 'REST Client', 'GitLens', 'Warp'],
    autopack: ['Bardeen', 'Automa', 'Tally', 'Apify', 'Typefully'],
    iapack: ['Merlin', 'Tactiq', 'Fireflies.ai', 'Perplexity', 'Otter.ai', 'SparkToro']
  }
};

function getAllSecretAppsFlat() {
  return [
    ...SECRET_APPS_CATALOG.browser,
    ...SECRET_APPS_CATALOG.dev,
    ...SECRET_APPS_CATALOG.automacao,
    ...SECRET_APPS_CATALOG.ia,
    ...SECRET_APPS_CATALOG.geral
  ];
}

function getRecommendedSecretApps(answers) {
  const all = getAllSecretAppsFlat();
  const byName = (name) => all.find(a => a.name === name);
  const pack = answers.pack && SECRET_APPS_CATALOG.packs[answers.pack];
  if (pack) {
    const fromPack = pack.map(byName).filter(Boolean);
    if (fromPack.length) return fromPack;
  }
  const area = answers.area || 'browser';
  const areaApps = SECRET_APPS_CATALOG[area] || SECRET_APPS_CATALOG.browser;
  return areaApps.slice(0, 8);
}

function renderSecretAppsGrid(apps) {
  if (!apps?.length) return '';
  return `
    <div class="space-y-3 mt-2">
      <h4 class="text-sm font-bold text-emerald-400 uppercase tracking-wider">🔒 Apps Secretos · Instale Agora</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${apps.map(app => `
          <div class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-white text-sm">${app.name}</span>
              <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-gray-400 border border-gray-800">${app.type}</span>
            </div>
            <p class="text-xs text-gray-400 leading-relaxed">${app.desc}</p>
            <a href="${app.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300">Abrir site →</a>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

const moduleWizardsData = {
  1: {
    title: "Criando um SaaS",
    intro: "Vamos montar seu SaaS do zero com IA. Responda cada etapa e copie os prompts prontos para colar no Cursor, ChatGPT ou Claude.",
    steps: [
      {
        id: "ia_pronta",
        title: "Etapa 1 · Ferramentas de IA",
        question: "Você já tem uma ferramenta de IA configurada para programar?",
        tip: "Recomendamos o Cursor Editor (gratuito para começar) ou ChatGPT/Claude no navegador.",
        type: "choice",
        field: "ia_tool",
        options: [
          { value: "cursor", label: "Sim, uso o Cursor Editor", guide: ["Abra <strong>cursor.com</strong> → clique <strong>Download</strong>", "Instale e abra o Cursor → <strong>Sign Up</strong> com Google ou e-mail", "Clique <strong>Open Folder</strong> → crie pasta <code>meu-saas</code>", "Pressione <strong>Ctrl+L</strong> (Chat) ou <strong>Ctrl+I</strong> (Composer) para falar com a IA", "Cole o prompt pronto abaixo e peça para gerar o código"], prompt: "Estou no Cursor Editor com pasta vazia 'meu-saas'. Me guie passo a passo: criar package.json, server.js Express, instalar dependências no terminal integrado (npm install), e rodar com node server.js. Explique cada clique no Cursor." },
          { value: "copilot", label: "Sim, uso GitHub Copilot (VS Code)", guide: ["Baixe <strong>code.visualstudio.com</strong> → instale VS Code", "Extensões (Ctrl+Shift+X) → busque <strong>GitHub Copilot</strong> → Install", "Faça login GitHub → crie pasta do projeto → File → Open Folder", "Abra terminal (Ctrl+`) → digite comandos que a IA sugerir", "Selecione código + Copilot Chat para pedir alterações"], prompt: "Uso VS Code + Copilot. Me explique: criar projeto SaaS, package.json, server.js Express, npm install, e testar em localhost:3000. Onde clicar no VS Code para cada passo." },
          { value: "chatgpt", label: "Sim, uso ChatGPT ou Claude no navegador", guide: ["Acesse <strong>chat.openai.com</strong> ou <strong>claude.ai</strong>", "Crie conta gratuita → clique <strong>New Chat</strong>", "Cole o prompt completo → peça código arquivo por arquivo", "Copie cada arquivo para o Bloco de Notas → salve como .js/.html", "Para testar: instale Node.js em <strong>nodejs.org</strong> → abra PowerShell na pasta"], prompt: "Uso ChatGPT/Claude no navegador sem editor. Me ensine criar SaaS: lista de arquivos, código completo de cada um, como salvar no Windows, instalar Node.js, e testar passo a passo no PowerShell." },
          { value: "nao", label: "Não, ainda não tenho nada configurado", guide: ["<strong>1.</strong> Acesse <strong>nodejs.org</strong> → baixe LTS → instale (Next, Next, Finish)", "<strong>2.</strong> Acesse <strong>cursor.com</strong> → Download → instale o Cursor", "<strong>3.</strong> Abra Cursor → Sign Up → Open Folder → crie pasta do projeto", "<strong>4.</strong> Terminal (Ctrl+`) → digite <code>node -v</code> para confirmar Node instalado", "<strong>5.</strong> Ctrl+L no Cursor → cole o prompt abaixo → comece a criar"], prompt: "Sou iniciante absoluto no Windows. Roteiro visual completo: instalar Node.js, instalar Cursor, criar primeira pasta, abrir terminal, fazer primeira pergunta à IA e ver o site rodando em localhost. Onde clicar em cada tela." }
        ]
      },
      {
        id: "ideia_saas",
        title: "Etapa 2 · Ideia do Produto",
        question: "Você já tem uma ideia definida para o seu SaaS?",
        tip: "Não precisa ser perfeita. Uma ideia simples já basta para a IA gerar a estrutura.",
        type: "choice",
        field: "ideia",
        options: [
          { value: "definida", label: "Sim, já tenho nome e proposta de valor", prompt: null },
          { value: "vaga", label: "Tenho uma ideia vaga, preciso refinar", prompt: "Tenho uma ideia vaga de SaaS mas não sei se é viável. Me faça 10 perguntas estratégicas (nicho, dor, concorrentes, monetização) e depois sugira 3 ideias de MicroSaaS validáveis que posso construir em 7 dias usando IA." },
          { value: "nao", label: "Não tenho ideia ainda", prompt: "Não tenho ideia de SaaS. Sugira 5 ideias de MicroSaaS de nicho (agendamento, CRM simples, gestão de leads, automação WhatsApp, controle financeiro) que posso validar rapidamente. Para cada uma: problema, solução, preço sugerido e stack recomendada." }
        ]
      },
      {
        id: "nome_saas",
        title: "Etapa 3 · Detalhes do Projeto",
        question: "Descreva brevemente seu SaaS (nome, o que resolve, para quem):",
        tip: "Exemplo: 'AgendaPro · sistema de agendamento para barbearias que envia lembrete automático no WhatsApp.'",
        type: "text",
        field: "descricao_saas",
        placeholder: "Ex: MeuSaaS · automação de orçamentos para imobiliárias..."
      },
      {
        id: "hospedagem",
        title: "Etapa 4 · Hospedagem e Infraestrutura",
        question: "Como você quer hospedar seu SaaS? Quer começar 100% gratuito ou pode investir?",
        tip: "Firebase é 100% grátis no começo (Auth + Firestore + Hosting). Quando crescer, migre para Supabase ou compre uma VPS.",
        type: "choice",
        field: "hospedagem",
        options: HOSTING_STEP.options.map(o => ({
          ...o,
          guide: o.value === "firebase" ? [
            "Acesse <strong>console.firebase.google.com</strong> → Login Google",
            "Clique <strong>Criar projeto</strong> → dê um nome → Continue → Continue → Criar",
            "Menu lateral: <strong>Authentication</strong> → Começar → E-mail/Senha → Ativar → Salvar",
            "Menu: <strong>Firestore Database</strong> → Criar banco → Modo teste → Próximo → Ativar",
            "Menu: <strong>Hosting</strong> → Começar → siga instalação Firebase CLI no terminal",
            "Configurações ⚙️ → Seus apps → ícone Web <strong>&lt;/&gt;</strong> → copie firebaseConfig"
          ] : o.value === "supabase" ? [
            "Acesse <strong>supabase.com</strong> → <strong>Start your project</strong>",
            "Login GitHub → <strong>New Project</strong> → nome + senha do banco → Create",
            "Menu <strong>Table Editor</strong> → New table → crie tabela users",
            "Menu <strong>Authentication</strong> → Providers → ative Email",
            "Menu <strong>Settings</strong> → API → copie URL e anon key",
            "SQL Editor → New query → cole schema SQL que a IA gerar → Run"
          ] : [
            "Acesse <strong>hetzner.com</strong> ou <strong>digitalocean.com</strong> → Create Account",
            "Create Droplet/Server → Ubuntu 22.04 → plano mais barato (~€4/mês)",
            "Copie o IP → conecte via SSH (PowerShell: ssh root@SEU_IP)",
            "Instale: <code>apt update && apt install -y nodejs npm nginx postgresql</code>",
            "Instale PM2: <code>npm i -g pm2</code> → rode app → <code>pm2 startup</code>",
            "Certbot SSL: <code>apt install certbot python3-certbot-nginx</code>"
          ]
        }))
      },
      {
        id: "nivel",
        title: "Etapa 5 · Seu Nível",
        question: "Qual é o seu nível atual de programação?",
        type: "choice",
        field: "nivel",
        options: [
          { value: "iniciante", label: "Iniciante · nunca programei", prompt: null },
          { value: "basico", label: "Básico · já vi HTML/CSS/JS", prompt: null },
          { value: "intermediario", label: "Intermediário · já fiz projetos pequenos", prompt: null }
        ]
      }
    ],
    buildFinalPrompt(answers) {
      const nivelMap = { iniciante: "iniciante absoluto (explique cada linha de código)", basico: "básico (explique conceitos importantes)", intermediario: "intermediário (seja direto e técnico)" };
      const hosp = answers.hospedagem || "firebase";

      let stackDetail = "";
      if (hosp === "firebase") {
        stackDetail = "Firebase SDK (Auth + Firestore + Hosting) · 100% gratuito no plano Spark";
      } else if (hosp === "supabase") {
        stackDetail = "Supabase (@supabase/supabase-js) + PostgreSQL + Supabase Auth";
      } else {
        stackDetail = "Node.js + Express + PostgreSQL na VPS + Nginx + PM2";
      }

      return `Aja como engenheiro de software sênior e arquiteto de SaaS. Estou no nível ${nivelMap[answers.nivel] || "iniciante"}.

Quero construir este SaaS: ${answers.descricao_saas || "um MicroSaaS de automação de processos"}.

HOSPEDAGEM ESCOLHIDA: ${getHostingLabel(hosp)}
${getHostingInstructions(hosp)}

Stack técnica: ${stackDetail}
Ferramenta de IA que uso: ${answers.ia_tool || "Cursor"}

Forneça:
1. Estrutura completa de pastas do projeto
2. Configuração inicial (${hosp === "firebase" ? "firebase.json + firebaseConfig" : hosp === "supabase" ? "supabase client + .env" : "package.json + server.js + nginx.conf"})
3. ${hosp === "firebase" ? "Regras de segurança do Firestore + Auth" : hosp === "supabase" ? "Schema SQL + RLS policies" : "Modelagem PostgreSQL + rotas Express"}
4. Página de login/cadastro com Tailwind CSS
5. Deploy passo a passo (${hosp === "firebase" ? "firebase deploy" : hosp === "supabase" ? "Vercel + Supabase" : "VPS com PM2 + Nginx"})
6. Próximos 5 passos que devo pedir à IA depois

Seja prático, gere código completo e comentado para ${hosp === "firebase" ? "Firebase" : hosp === "supabase" ? "Supabase" : "VPS"}.`;
    }
  },

  2: {
    title: "Aplicativos Secretos",
    intro: "Ferramentas e extensões que poucos conhecem no mundo tech · para produtividade extrema. Instale, configure e opcionalmente crie a sua própria extensão.",
    steps: [
      {
        id: "area",
        title: "Etapa 1 · Área de Produtividade",
        question: "Onde você mais precisa ganhar produtividade?",
        tip: "Cada área tem apps secretos diferentes · escolha onde perde mais tempo hoje.",
        type: "choice",
        field: "area",
        options: [
          { value: "browser", label: "Navegador · abas, foco, extensões Chrome", guide: ["Abra Chrome → <strong>chrome://extensions</strong>", "Ative <strong>Modo desenvolvedor</strong> para instalar extensões", "Use packs abaixo: Toby, Vimium, GoFullPage..."], prompt: "Liste as 10 melhores extensões Chrome secretas para produtividade (Toby, Vimium, Automa, etc.) com link e como instalar cada uma passo a passo." },
          { value: "dev", label: "Desenvolvimento · código, APIs, terminal", guide: ["VS Code / Cursor → Extensions (Ctrl+Shift+X)", "Busque: Thunder Client, GitLens, Error Lens", "Terminal: instale Fig/Warp ou use PowerToys no Windows"], prompt: "Extensões VS Code/Cursor secretas para dev: Thunder Client, Pieces, Error Lens, Live Server. Como instalar e usar cada uma." },
          { value: "automacao", label: "Automação · tarefas repetitivas sem código", guide: ["Teste <strong>bardeen.ai</strong> (extensão Chrome grátis)", "<strong>automa.site</strong> · automação visual no browser", "<strong>n8n.io</strong> · fluxos webhook quando escalar"], prompt: "Compare Bardeen, Automa, n8n e Make para automação no browser. Qual usar primeiro sendo iniciante? Passo a passo de instalação." },
          { value: "ia", label: "IA escondida · chat, resumo, reuniões", guide: ["Extensão <strong>Merlin</strong> ou <strong>Monica</strong> no Chrome", "<strong>tactiq.io</strong> · transcreve Google Meet grátis", "<strong>fireflies.ai</strong> · notas automáticas de call"], prompt: "Apps de IA pouco conhecidos: Merlin, Tactiq, Fireflies, Otter. Como instalar e integrar na rotina de trabalho diária." },
          { value: "geral", label: "Produtividade geral · clipboard, captura, atalhos", guide: ["Windows: instale <strong>Powertoys</strong> (Microsoft Store grátis)", "Mac: <strong>Raycast</strong> (raycast.com) substitui Spotlight", "Clipboard: <strong>Paste</strong> (Mac) ou <strong>Ditto</strong> (Windows)"], prompt: "Ferramentas secretas de produtividade: Raycast, PowerToys, Espanso, ShareX, CleanShot. Setup completo Windows e Mac." }
        ]
      },
      {
        id: "sistema",
        title: "Etapa 2 · Seu Sistema",
        question: "Qual sistema você usa no dia a dia?",
        type: "choice",
        field: "sistema",
        options: [
          { value: "windows", label: "Windows 10/11", guide: ["Microsoft Store → busque <strong>PowerToys</strong> → Instalar", "ShareX para screenshots: <strong>getsharex.com</strong>", "Espanso expansor texto: <strong>espanso.org</strong>"], prompt: null },
          { value: "mac", label: "Mac (macOS)", guide: ["<strong>raycast.com</strong> → Download → substitui Spotlight", "CleanShot X ou Shottr para capturas", "Paste app para histórico clipboard"], prompt: null },
          { value: "chrome", label: "Só Chrome (qualquer OS)", guide: ["Chrome Web Store → extensões listadas no módulo", "Sincronize extensões com conta Google", "Use <strong>Workona</strong> para workspaces de abas"], prompt: null }
        ]
      },
      {
        id: "pack",
        title: "Etapa 3 · Pack de Apps Secretos",
        question: "Qual pack de ferramentas secretas instalar primeiro?",
        tip: "São apps que a maioria dos devs BR ainda não usa · vantagem competitiva imediata.",
        type: "choice",
        field: "pack",
        options: [
          { value: "extensoes", label: "Pack Extensões Chrome (7 ferramentas)", guide: ["<strong>Vimium</strong> · navegue sites só com teclado", "<strong>Toby</strong> ou <strong>Workona</strong> · organize abas em projetos", "<strong>GoFullPage</strong> · screenshot página inteira", "<strong>WhatRuns</strong> · descubra tech stack de qualquer site", "<strong>Text Blaze</strong> · snippets de texto com atalho", "<strong>Automa</strong> · automação visual no browser", "<strong>Superpower ChatGPT</strong> · GPT em qualquer aba"], prompt: "Guia instalação pack Chrome: Vimium, Workona, GoFullPage, WhatRuns, Text Blaze, Automa, Superpower ChatGPT. Onde clicar em cada um e 1 caso de uso." },
          { value: "devpack", label: "Pack Dev (Cursor/VS Code + APIs)", guide: ["Thunder Client · testa API dentro do editor", "Error Lens · erros inline no código", "Pieces · salva snippets com IA", "REST Client · .http files para APIs", "GitLens · histórico Git visual"], prompt: "Configurar pack dev no Cursor: Thunder Client, Error Lens, Pieces, REST Client. Exemplos práticos de uso em projeto Node.js." },
          { value: "autopack", label: "Pack Automação (sem programar)", guide: ["<strong>bardeen.ai</strong> · scrape + planilha + CRM", "<strong>automa.site</strong> · clique/grave fluxos", "<strong>tally.so</strong> · formulários que disparam webhook", "<strong>typefully.com</strong> · agendar threads Twitter/X"], prompt: "Montar 3 automações com Bardeen + Tally + webhook n8n. Passo a passo visual para iniciante." },
          { value: "iapack", label: "Pack IA Produtividade", guide: ["<strong>Merlin</strong> · GPT sidebar em qualquer site", "<strong>tactiq.io</strong> · transcrição Google Meet", "<strong>fireflies.ai</strong> · bot entra na call e resume", "<strong>perplexity.ai</strong> · pesquisa com fontes"], prompt: "Rotina diária com Merlin + Tactiq + Perplexity: reuniões, pesquisa e redação. Setup em 15 minutos." }
        ]
      },
      {
        id: "objetivo",
        title: "Etapa 4 · Seu Objetivo",
        question: "O que você quer resolver com essas ferramentas?",
        type: "text",
        field: "objetivo",
        placeholder: "Ex: Organizar 50 abas de pesquisa, automatizar coleta de leads, transcrever reuniões..."
      },
      {
        id: "criar_tool",
        title: "Etapa 5 · Além de Usar Apps",
        question: "Quer também criar sua própria extensão ou bot?",
        tip: "Depois de dominar apps prontos, você pode vender extensões .exe ou Chrome customizadas.",
        type: "choice",
        field: "criar_tool",
        options: [
          { value: "so_apps", label: "Só usar apps secretos prontos (por agora)", prompt: null },
          { value: "extensao", label: "Quero criar extensão Chrome própria", guide: ["chrome://extensions → Modo desenvolvedor", "Carregar sem compactação → pasta com manifest.json", "Use Cursor para gerar manifest v3 + content.js"], prompt: "Extensão Chrome MV3 customizada para: [OBJETIVO]. manifest.json + background.js + content.js completos." },
          { value: "bot", label: "Quero bot Node.js / executável .exe", guide: ["Cursor → npm init → index.js", "npm install node-fetch", "pkg para gerar .exe: npm i -g pkg"], prompt: "Bot Node.js automatizado para [OBJETIVO]. Código + como empacotar em .exe com pkg no Windows." }
        ]
      }
    ],
    buildFinalPrompt(answers) {
      const apps = getRecommendedSecretApps(answers);
      const appList = apps.map(a => `- ${a.name} (${a.url}): ${a.desc}`).join('\n');
      return `Aja como especialista em produtividade tech e ferramentas secretas.

Área: ${answers.area || "produtividade geral"}
Sistema: ${answers.sistema || "Windows"}
Pack escolhido: ${answers.pack || "extensões Chrome"}
Objetivo: ${answers.objetivo || "aumentar produtividade"}
Criar ferramenta própria: ${answers.criar_tool || "só apps prontos"}

Apps secretos recomendados:
${appList}

Me entregue:
1) Plano de instalação em ordem (Dia 1 a Dia 3) · onde clicar em cada app
2) Atalhos e hacks de produtividade com cada ferramenta
3) Stack completa integrada para meu objetivo
4) ${answers.criar_tool === 'extensao' ? 'Roteiro para criar minha extensão Chrome' : answers.criar_tool === 'bot' ? 'Roteiro para criar bot/.exe' : 'Próximos apps secretos para explorar depois'}
5) Como monetizar dominar essas ferramentas (freelance, extensão paga, consultoria)`;
    },
    buildFinalExtraHtml(answers) {
      return renderSecretAppsGrid(getRecommendedSecretApps(answers));
    }
  },

  3: {
    title: "Tráfego Orgânico",
    intro: "Cresça sem gastar em ads. Guias de CapCut, Canva, ManyChat e ChatGPT · onde clicar em cada app.",
    steps: [
      {
        id: "ia_conteudo",
        title: "Etapa 1 · IA para Conteúdo",
        question: "Qual ferramenta de IA você usa para criar conteúdo?",
        type: "choice",
        field: "ia_conteudo",
        options: [
          { value: "chatgpt", label: "ChatGPT (chat.openai.com)", guide: ["Acesse <strong>chat.openai.com</strong> → Login", "Clique <strong>New chat</strong>", "Cole prompt → Enter → copie resultado", "Para imagens: use <strong>DALL-E</strong> ou Canva"], prompt: "5 prompts reutilizáveis ChatGPT: post Instagram, roteiro Reels 45s, copy LinkedIn, cold email, legenda TikTok. Formato copiar e colar." },
          { value: "claude", label: "Claude (claude.ai)", guide: ["Acesse <strong>claude.ai</strong> → Sign Up", "New Chat → cole prompt longo (Claude aceita textos grandes)", "Use para roteiros e carrosséis completos"], prompt: "Prompts Claude para conteúdo orgânico B2B: 3 posts LinkedIn, 1 roteiro Reels, 1 sequência WhatsApp outreach." },
          { value: "nao", label: "Não uso IA ainda · quero começar", guide: ["Crie conta grátis em <strong>chat.openai.com</strong>", "Ou <strong>claude.ai</strong> (melhor para textos longos)", "Canva grátis: <strong>canva.com</strong> para artes", "CapCut grátis: app ou <strong>capcut.com</strong> para editar vídeos"], prompt: "Nunca usei IA para conteúdo. Tutorial do zero: criar conta ChatGPT, primeiro prompt, gerar 3 posts Instagram sobre automação com IA, e onde colar no Instagram." }
        ]
      },
      {
        id: "nicho",
        title: "Etapa 2 · Seu Nicho",
        question: "Qual é o nicho do seu produto ou serviço?",
        type: "text",
        field: "nicho",
        placeholder: "Ex: Automação para clínicas, SaaS para barbearias..."
      },
      {
        id: "redes",
        title: "Etapa 3 · Redes Sociais",
        question: "Qual rede social você vai focar primeiro?",
        type: "choice",
        field: "redes",
        options: [
          { value: "instagram", label: "Instagram (Reels + Carrossel)", guide: ["Baixe app Instagram ou acesse instagram.com", "Perfil → <strong>Editar perfil</strong> → bio com CTA", "Botão <strong>+</strong> → Reels ou Carrossel", "Use <strong>CapCut</strong> para editar → exportar → postar", "Stories: enquete/link para capturar leads"], prompt: null },
          { value: "linkedin", label: "LinkedIn (B2B)", guide: ["linkedin.com → seu perfil → ícone <strong> lápis</strong>", "Seção <strong>Sobre</strong>: copy de autoridade", "<strong>Criar publicação</strong> → texto + documento PDF", "Conectar com 10 decisores/dia do nicho", "LinkedIn Analytics: ver impressões"], prompt: null },
          { value: "tiktok", label: "TikTok / YouTube Shorts", guide: ["App TikTok → <strong>+</strong> → Upload ou gravar", "CapCut: editar → auto-legenda → exportar", "YouTube: Studio → <strong>Criar</strong> → Upload Short (<60s)", "Use hashtags: #saas #automacao #ia"], prompt: null },
          { value: "todas", label: "Multicanal (repurpose conteúdo)", guide: ["Crie 1 vídeo no CapCut", "Opus Clip (opus.pro): corta em shorts automático", "Poste mesmo vídeo: Reels + TikTok + Shorts", "Canva: adapte para carrossel LinkedIn"], prompt: "Estratégia repurpose: 1 vídeo → 5 formatos (Reels, TikTok, Shorts, carrossel, post LinkedIn). Apps e ordem de execução." }
        ]
      },
      {
        id: "apps_edicao",
        title: "Etapa 4 · Apps de Edição",
        question: "Quais apps de edição você vai usar?",
        type: "choice",
        field: "apps_edicao",
        options: [
          { value: "capcut", label: "CapCut (vídeos · grátis)", guide: ["Baixe CapCut (celular) ou capcut.com (PC)", "New Project → importe vídeo ou grave", "Texto → Auto Captions (legendas automáticas)", "Efeitos → Transitions → Export 1080p", "Salve e poste no Instagram Reels"], prompt: "Roteiro Reels 45s + instruções CapCut: onde clicar para legenda automática, zoom, transições e exportar." },
          { value: "canva", label: "Canva (carrosséis · grátis)", guide: ["canva.com → Login → <strong>Criar design</strong>", "Busque 'Instagram Carrossel'", "Edite 7 slides → Exportar PNG/PDF", "Poste no Instagram como carrossel"], prompt: "Copy de carrossel 7 slides + layout Canva slide a slide (título, cor, fonte)." },
          { value: "manychat", label: "ManyChat (automação Direct · grátis)", guide: ["manychat.com → Sign Up → conecte Instagram", "Automation → <strong>New Flow</strong>", "Trigger: comentário contém 'QUERO'", "Ação: enviar DM com link/PDF", "Publicar automação → teste comentando no post"], prompt: "Fluxo ManyChat completo: trigger comentário 'QUERO' → DM com PDF → pergunta dificuldade → link checkout. Copy das mensagens." }
        ]
      },
      {
        id: "formato",
        title: "Etapa 5 · Formato Principal",
        question: "Qual formato de conteúdo criar primeiro esta semana?",
        type: "choice",
        field: "formato",
        options: [
          { value: "video", label: "Vídeos curtos (Reels/TikTok)", prompt: "Roteiro Reels 45s sobre [NICHO]: gancho 3s, 3 pontos valor, CTA. Inclua instruções CapCut passo a passo." },
          { value: "carrossel", label: "Carrosséis educativos", prompt: "Carrossel 7 slides Instagram [NICHO]. Texto de cada slide + instruções Canva." },
          { value: "outreach", label: "Prospecção WhatsApp/LinkedIn", prompt: "Sequência 3 mensagens cold outreach [NICHO] via WhatsApp: gancho, prova social, convite demo." }
        ]
      }
    ],
    buildFinalPrompt(answers) {
      return `Aja como estrategista de growth orgânico.

Nicho: ${answers.nicho || "automação com IA"}
Rede: ${answers.redes || "Instagram"}
Apps: ${answers.apps_edicao || "CapCut + Canva"}
Formato: ${answers.formato || "vídeos"}

Plano 30 dias com:
1. Calendário semanal (4 semanas) · o que postar cada dia
2. 12 posts prontos (copy + app para criar: CapCut/Canva)
3. Hashtags por post
4. Fluxo ManyChat (comentário → DM → lead)
5. Onde clicar em cada app para executar

Inclua tutoriais visuais 'clique aqui' para iniciantes.`;
    }
  },

  4: {
    title: "Funil de Vendas & E-mail Marketing",
    intro: "Monte landing page, e-mails e automações. Guias de Resend, n8n, Make e Mailchimp · clique a clique.",
    steps: [
      {
        id: "ferramentas",
        title: "Etapa 1 · Ferramentas de Automação",
        question: "Qual ferramenta você vai usar para o funil?",
        type: "choice",
        field: "ferramentas",
        options: [
          { value: "n8n", label: "n8n (automação · grátis self-hosted ou cloud)", guide: ["Acesse <strong>n8n.io</strong> → cloud grátis ou instale local", "Clique <strong>New Workflow</strong>", "Adicione nó <strong>Webhook</strong> → copie URL", "Adicione nó <strong>Send Email</strong> ou HTTP Request", "Conecte nós → <strong>Execute workflow</strong> → ative"], prompt: "Workflow n8n: webhook recebe lead → salva Google Sheets → envia email Resend → notifica WhatsApp. JSON exportável." },
          { value: "make", label: "Make / Integromat (visual · tier grátis)", guide: ["Acesse <strong>make.com</strong> → Sign Up", "<strong>Create new scenario</strong>", "Módulo 1: Webhooks → Custom webhook", "Módulo 2: Resend ou Gmail → Send email", "Clique <strong>Run once</strong> → teste → ative scenario"], prompt: "Cenário Make: formulário site → email boas-vindas → adicionar linha Google Sheets. Passo a passo visual Make." },
          { value: "resend", label: "Resend (e-mail transacional · grátis 3k/mês)", guide: ["Acesse <strong>resend.com</strong> → Sign Up", "Menu <strong>API Keys</strong> → Create API Key → copie", "Menu <strong>Domains</strong> → Add Domain → configure DNS", "Docs: copie exemplo Node.js", "Teste: envie email de teste no dashboard"], prompt: "Integrar Resend no Express.js: capturar lead POST /api/lead, enviar email HTML boas-vindas. Código completo + .env." },
          { value: "nao", label: "Não tenho nada · montar do zero", guide: ["Comece com <strong>resend.com</strong> (email grátis)", "Landing no seu site ou <strong>carrd.co</strong> (grátis)", "n8n.io cloud grátis para conectar formulário → email", "Depois evolua para Make ou n8n self-hosted"], prompt: "Funil do zero: Resend + landing page HTML + webhook n8n. Onde criar conta, onde clicar, código Node.js completo." }
        ]
      },
      {
        id: "produto",
        title: "Etapa 2 · Produto/Oferta",
        question: "O que você está vendendo no funil?",
        type: "text",
        field: "produto",
        placeholder: "Ex: Assinatura SaaS R$47/mês, consultoria automação..."
      },
      {
        id: "landing",
        title: "Etapa 3 · Página de Captura",
        question: "Onde vai hospedar sua landing page de captura?",
        type: "choice",
        field: "landing",
        options: [
          { value: "proprio", label: "No meu site (HTML/Node.js)", guide: ["Use seu index.html ou crie landing.html", "Formulário: action='/api/lead' method POST", "No server.js: rota POST que recebe email", "Teste: preencha form → veja console log", "Deploy: Firebase Hosting ou Vercel"], prompt: null },
          { value: "carrd", label: "Carrd.co (landing grátis rápida)", guide: ["carrd.co → Sign Up → <strong>+ New Site</strong>", "Escolha template One Page", "Seção Form → conecte Formspree ou webhook", "Publish → copie URL", "Compartilhe link nos ads/redes"], prompt: "Copy landing page AIDA completa para Carrd: headline, bullets, FAQ, CTA. Texto pronto para colar." },
          { value: "nao", label: "Preciso criar do zero com IA", guide: ["Peça à IA HTML completo da landing", "Salve como landing.html", "Hospede no Firebase Hosting grátis", "Formulário conectado ao Resend ou n8n"], prompt: "Landing page HTML + CSS Tailwind completa com formulário captura email. Copy AIDA para [PRODUTO]. Pronta para deploy Firebase." }
        ]
      },
      {
        id: "sequencia",
        title: "Etapa 4 · Sequência de E-mails",
        question: "Quantos e-mails na sequência de nutrição?",
        type: "choice",
        field: "emails",
        options: [
          { value: "3", label: "3 e-mails (rápido)", guide: ["Resend → Templates ou código HTML", "Email 1: imediato após cadastro", "Email 2: dia 2 · case de sucesso", "Email 3: dia 5 · oferta com urgência", "Configure delay no n8n/Make entre envios"], prompt: "Sequência 3 emails: assunto + corpo HTML. Email 1 boas-vindas, 2 prova social, 3 oferta." },
          { value: "5", label: "5 e-mails (completo)", prompt: "Sequência 5 emails nutrição: assunto + HTML cada. Jornada do lead frio ao comprador." },
          { value: "7", label: "7 e-mails (funil longo)", prompt: "Sequência 7 emails: assunto + corpo. Inclua storytelling, objeções, bônus, escassez." }
        ]
      },
      {
        id: "hospedagem",
        title: "Etapa 5 · Hospedagem do Funil",
        question: "Onde rodar backend do funil (webhooks, emails)?",
        type: "choice",
        field: "hospedagem",
        options: HOSTING_STEP.options
      }
    ],
    buildFinalPrompt(answers) {
      const hosp = answers.hospedagem || "firebase";
      return `Aja como copywriter de funis e especialista automação.

Produto: ${answers.produto || "SaaS"}
Ferramenta: ${answers.ferramentas || "Resend + n8n"}
Landing: ${answers.landing || "próprio site"}
Emails: ${answers.emails || "5"}
Hospedagem: ${getHostingLabel(hosp)}

Entregue:
1. Copy landing page HTML completa
2. Sequência ${answers.emails || "5"} emails (assunto + HTML)
3. Código webhook Node.js (${hosp})
4. Fluxo n8n/Make visual (passo a passo onde clicar)
5. Métricas: abertura, clique, conversão`;
    }
  },

  5: {
    title: "Métricas Financeiras",
    intro: "Controle MRR, CAC, LTV e Churn. Guias de Google Sheets, Stripe Dashboard e Chart.js.",
    steps: [
      {
        id: "controle",
        title: "Etapa 1 · Ferramenta de Controle",
        question: "Onde vai acompanhar os números do negócio?",
        type: "choice",
        field: "controle",
        options: [
          { value: "sheets", label: "Google Sheets (grátis · recomendado)", guide: ["Acesse <strong>sheets.google.com</strong> → Blank spreadsheet", "Crie abas: Receitas, Despesas, MRR, Clientes", "Coluna A: mês | Coluna B: valor | use fórmulas =SUM()", "Compartilhe com sócio se necessário", "Atualize todo dia 1 do mês"], prompt: "Planilha Google Sheets SaaS: abas MRR, Churn, CAC, LTV com fórmulas automáticas. Estrutura coluna a coluna." },
          { value: "stripe", label: "Stripe/Mercado Pago Dashboard", guide: ["Stripe: dashboard.stripe.com → <strong>Reports</strong>", "Mercado Pago: mercadopago.com.br → <strong>Suas vendas</strong>", "Exporte CSV mensal → importe no Sheets", "Acompanhe MRR em Billing → Subscriptions"], prompt: "Como extrair MRR e churn do Stripe Dashboard e Mercado Pago. Onde clicar para exportar relatórios." },
          { value: "nao", label: "Não controlo nada ainda", guide: ["Comece com Google Sheets hoje", "Anote: preço, clientes ativos, gastos ads", "Peça à IA fórmulas de MRR e LTV", "Atualize semanalmente"], prompt: "Planilha controle financeiro SaaS do zero: template Google Sheets com fórmulas MRR, CAC, LTV, Churn. Instruções de preenchimento." }
        ]
      },
      {
        id: "modelo",
        title: "Etapa 2 · Modelo de Receita",
        question: "Como você cobra dos clientes?",
        type: "choice",
        field: "modelo",
        options: [
          { value: "mensal", label: "Assinatura mensal (SaaS recorrente)", guide: ["MRR = preço × clientes ativos", "Anote cancelamentos para calcular Churn", "Use Stripe Billing ou planilha"], prompt: null },
          { value: "anual", label: "Plano anual com desconto", guide: ["Divida valor anual por 12 para MRR", "Ex: R$497/ano = R$41,42 MRR por cliente"], prompt: null },
          { value: "unico", label: "Pagamento único / Projeto", guide: ["Receita = vendas do mês (não recorrente)", "Foque em CAC e repetir vendas"], prompt: null },
          { value: "misto", label: "Misto (mensal + serviços avulsos)", guide: ["Separe abas: Recorrente vs Avulso", "Some ambos para receita total"], prompt: null }
        ]
      },
      {
        id: "numeros",
        title: "Etapa 3 · Seus Números Atuais",
        question: "Informe: preço mensal, clientes ativos, gasto marketing/mês",
        type: "text",
        field: "numeros",
        placeholder: "Ex: R$47/mês, 12 clientes, R$500/mês em ads..."
      },
      {
        id: "dashboard",
        title: "Etapa 4 · Dashboard Visual",
        question: "Quer gráficos visuais ou só planilha?",
        type: "choice",
        field: "dashboard",
        options: [
          { value: "chartjs", label: "Dashboard web com Chart.js", guide: ["Peça à IA HTML + Chart.js", "Salve como dashboard.html", "Abra no navegador localmente", "Ou hospede no Firebase Hosting", "Atualize dados no JS ou conecte API"], prompt: "HTML + Chart.js: gráfico linha MRR 6 meses, barras CAC vs LTV, tema escuro. Código completo com dados exemplo." },
          { value: "sheets", label: "Gráficos no Google Sheets", guide: ["Selecione dados na planilha", "Insert → <strong>Chart</strong>", "Escolha Line chart para MRR", "Customize cores e título", "Fixe gráfico em aba Dashboard"], prompt: "Como criar gráficos MRR e Churn no Google Sheets: selecionar dados, inserir gráfico, tipos recomendados." },
          { value: "planilha", label: "Só planilha por enquanto", prompt: null }
        ]
      }
    ],
    buildFinalPrompt(answers) {
      return `Aja como CFO de startup SaaS e analista financeiro.

Modelo: ${answers.modelo || "assinatura mensal"}
Números atuais: ${answers.numeros || "R$47/mês, 10 clientes, R$300/mês marketing"}
Controle: ${answers.controle || "planilha"}

Calcule e explique:
1. MRR, ARR, Churn Rate, LTV, CAC, Payback Period
2. Com meus números, o negócio é saudável? Break-even?
3. Quanto posso gastar em ads por cliente?
4. Projeção de receita para 6 e 12 meses (3 cenários)
5. ${answers.dashboard === "chartjs" ? "Código Chart.js dashboard completo" : answers.dashboard === "sheets" ? "Tutorial gráficos Google Sheets" : "Template planilha com fórmulas"}`;
    }
  },

  6: {
    title: "Criando Anúncios Vencedores",
    intro: "Meta Ads, Google Ads e criativos com IA. Onde clicar no Gerenciador de Anúncios passo a passo.",
    steps: [
      {
        id: "conta_ads",
        title: "Etapa 1 · Plataforma de Anúncios",
        question: "Onde vai anunciar?",
        type: "choice",
        field: "conta_ads",
        options: [
          { value: "meta", label: "Meta Ads (Instagram/Facebook)", guide: ["Acesse <strong>business.facebook.com</strong>", "Create Account → nome da empresa", "Menu <strong>Configurações do negócio</strong> → Contas de anúncios → Adicionar", "Instale <strong>Pixel</strong>: Eventos de dados → Conectar dados → Web", "Copie código Pixel → cole antes &lt;/head&gt; do site"], prompt: "Configurar Meta Pixel no site: código base + evento Purchase. Onde colar no HTML e testar no Events Manager." },
          { value: "google", label: "Google Ads", guide: ["ads.google.com → Start now", "Crie campanha → Objetivo: Vendas/Leads", "Tipo: Performance Max ou Search", "Instale <strong>Google Tag</strong> no site", "Conecte conversões em Ferramentas → Conversões"], prompt: "Campanha Google Ads Search para SaaS B2B: estrutura, palavras-chave, copy anúncio, landing page." },
          { value: "nao", label: "Não tenho conta · criar agora", guide: ["Recomendado: Meta Business (business.facebook.com)", "Crie conta pessoal Facebook se não tiver", "Business Settings → Add Ad Account", "Adicione forma de pagamento (cartão)", "Instale Pixel antes de rodar ads"], prompt: "Tutorial visual Meta Business Manager do zero: criar conta, ad account, pixel, primeira campanha conversão. Onde clicar em cada tela." }
        ]
      },
      {
        id: "produto_ads",
        title: "Etapa 2 · Produto Anunciado",
        question: "O que você vai anunciar?",
        type: "text",
        field: "produto",
        placeholder: "Ex: SaaS agendamento R$47/mês..."
      },
      {
        id: "criativo_app",
        title: "Etapa 3 · App para Criar Criativos",
        question: "Como vai produzir os criativos (imagens/vídeos)?",
        type: "choice",
        field: "criativo_app",
        options: [
          { value: "capcut", label: "CapCut (vídeo ads · grátis)", guide: ["CapCut → New Project → 9:16 vertical", "Importe gravação ou use template", "Texto grande nos primeiros 3 segundos (gancho)", "Auto Caption → Export", "Upload direto no Ads Manager"], prompt: "Roteiro vídeo ad 30s Hook-Pain-Solution + instruções CapCut para Meta Ads." },
          { value: "canva", label: "Canva (imagem/carrossel · grátis)", guide: ["canva.com → Instagram Post ou Ad", "Templates 'Facebook Ad'", "Customize headline + CTA", "Download PNG → Ads Manager → Create Ad → Upload"], prompt: "5 variações criativo estático Canva: headline, texto, CTA para Meta Ads." },
          { value: "ia", label: "Só copy · IA escreve, eu gravo depois", guide: ["ChatGPT: peça roteiro + indicaciones visuais", "Grave com celular (selfie ou tela)", "CapCut: edite e legenda", "Teste 3 variações de gancho"], prompt: "5 copies Meta Ads completas: headline 40 chars, texto principal, descrição, CTA. Teste A/B ganchos." }
        ]
      },
      {
        id: "orcamento",
        title: "Etapa 4 · Orçamento e Campanha",
        question: "Qual orçamento e como estruturar campanha?",
        type: "choice",
        field: "orcamento",
        options: [
          { value: "baixo", label: "Até R$500/mês (teste)", guide: ["Ads Manager → Create → Campaign", "Objetivo: <strong>Sales</strong> ou Leads", "Orçamento campanha (CBO): R$15-20/dia", "1 conjunto anúncios, 3 criativos", "Deixe rodar 3-5 dias antes de otimizar"], prompt: "Estrutura campanha Meta R$500/mês: CBO, público interesse SaaS/automação, 3 criativos, KPIs esperados." },
          { value: "medio", label: "R$500–R$2.000/mês", guide: ["Teste 2 campanhas: cold + retargeting", "Público lookalike 1% após 100 conversões", "Escale 20% a cada 3 dias se ROAS ok"], prompt: "Plano escala Meta Ads R$500-2000: cold, warm, retargeting, lookalike." },
          { value: "alto", label: "Acima R$2.000/mês", guide: ["Separe campanhas por funil", "API Conversões no servidor (CAPI)", "Teste criativos UGC semanalmente"], prompt: "Estrutura avançada Meta Ads + CAPI Node.js para escala R$2000+/mês." }
        ]
      }
    ],
    buildFinalPrompt(answers) {
      return `Aja como media buyer Meta/Google Ads para SaaS.

Produto: ${answers.produto || "SaaS automação"}
Plataforma: ${answers.conta_ads || "Meta Ads"}
App criativo: ${answers.criativo_app || "CapCut"}
Orçamento: ${answers.orcamento || "R$500/mês"}

Entregue:
1. Passo a passo Ads Manager (onde clicar)
2. 3 públicos-alvo configuráveis
3. ${answers.criativo_app === "capcut" ? "Roteiro vídeo 30s" : "5 copies + brief Canva"}
4. Pixel/CAPI código Node.js
5. Regras otimização e KPIs`;
    }
  },

  7: {
    title: "Gestão de Cobrança",
    intro: "Configure checkout e receba pagamentos. Hotmart, Kiwify, Mercado Pago, Stripe e mais · com guia de onde clicar em cada plataforma.",
    steps: [
      {
        id: "tipo_checkout",
        title: "Etapa 1 · Tipo de Checkout",
        question: "Como você quer vender e cobrar?",
        tip: "Plataformas prontas (Hotmart/Kiwify) não exigem programar checkout. Mercado Pago/Stripe exigem integração no seu site.",
        type: "choice",
        field: "tipo_checkout",
        options: [
          { value: "plataforma", label: "Plataforma pronta (Hotmart, Kiwify, Eduzz) · recomendado para começar", guide: ["Ideal para cursos, comunidades e infoprodutos", "Checkout, Pix, boleto e cartão já inclusos", "Você só configura produto + preço + link", "Webhook libera acesso automaticamente no seu site"], prompt: "Comparativo Hotmart vs Kiwify vs Eduzz para comunidade/SaaS: taxas, recorrência, afiliados, qual escolher para R$47/mês." },
          { value: "proprio", label: "Checkout no meu site (Mercado Pago, Stripe)", guide: ["Ideal para SaaS com login próprio", "Cliente paga dentro do seu site/app", "Precisa de backend para webhooks", "Mais controle, mais técnico"], prompt: "Quando usar checkout próprio vs Hotmart/Kiwify? Prós e contras para MicroSaaS brasileiro." },
          { value: "hibrido", label: "Os dois · plataforma + área de membros própria", guide: ["Venda na Kiwify/Hotmart (checkout fácil)", "Webhook libera login no seu dashboard", "Melhor dos dois mundos para comunidade conectWM"], prompt: "Arquitetura híbrida: vender na Kiwify + liberar acesso automático no dashboard Firebase. Fluxo completo." }
        ]
      },
      {
        id: "gateway",
        title: "Etapa 2 · Plataforma de Checkout",
        question: "Qual plataforma de pagamento/checkout você vai usar?",
        type: "choice",
        field: "gateway",
        options: [
          {
            value: "kiwify",
            label: "Kiwify (checkout moderno · Brasil)",
            guide: [
              "Acesse <strong>kiwify.com.br</strong> → <strong>Criar conta grátis</strong>",
              "Menu <strong>Produtos</strong> → <strong>+ Novo produto</strong>",
              "Tipo: <strong>Assinatura</strong> (recorrente) ou Pagamento único",
              "Defina preço (ex: R$47/mês) → salve",
              "Aba <strong>Checkout</strong> → copie o <strong>Link de pagamento</strong>",
              "Menu <strong>Apps</strong> → <strong>Webhooks</strong> → <strong>+ Novo webhook</strong>",
              "URL: <code>https://seusite.com/api/webhooks/kiwify</code> → evento: <strong>order.paid</strong>",
              "Copie o <strong>token secreto</strong> do webhook para validar no backend"
            ],
            prompt: "Integrar webhook Kiwify no Node.js/Firebase: receber order.paid, validar assinatura HMAC, liberar acesso usuário por email. Código completo + onde pegar token no painel Kiwify."
          },
          {
            value: "hotmart",
            label: "Hotmart (líder BR · cursos e assinaturas)",
            guide: [
              "Acesse <strong>hotmart.com</strong> → Login → <strong>Sou Produtor</strong>",
              "Menu <strong>Produtos</strong> → <strong>Criar produto</strong>",
              "Formato: <strong>Assinatura</strong> ou Curso online",
              "Configure planos (mensal R$47 / anual R$497)",
              "Aba <strong>Página de pagamento</strong> → personalize checkout",
              "Menu <strong>Ferramentas</strong> → <strong>Webhook (API Hotmart)</strong>",
              "Cadastre URL: <code>https://seusite.com/api/webhooks/hotmart</code>",
              "Selecione eventos: <strong>PURCHASE_COMPLETE</strong>, <strong>SUBSCRIPTION_CANCELLATION</strong>",
              "Copie <strong>Hottok</strong> (chave secreta) em Meus Produtos → Configurações"
            ],
            prompt: "Webhook Hotmart Node.js: validar Hottok, eventos PURCHASE_COMPLETE e SUBSCRIPTION_CANCELLATION, liberar/revogar acesso. Código Express + Firebase Firestore."
          },
          {
            value: "eduzz",
            label: "Eduzz (checkout + afiliados)",
            guide: [
              "Acesse <strong>eduzz.com</strong> → Cadastre-se como Produtor",
              "Menu <strong>Produtos</strong> → <strong>Novo conteúdo</strong>",
              "Tipo: Recorrência ou Pagamento único → defina valor",
              "Gere <strong>Link de checkout</strong> Eduzz",
              "Configurações → <strong>Webhook/Postback</strong>",
              "URL postback + eventos de venda aprovada",
              "Integre com Orbita ou Sun para área de membros (opcional)"
            ],
            prompt: "Integrar postback Eduzz: receber venda aprovada, mapear campos email/produto, liberar acesso dashboard. Código webhook Node.js."
          },
          {
            value: "mercadopago",
            label: "Mercado Pago (checkout no seu site · Pix/Cartão)",
            guide: [
              "Acesse <strong>mercadopago.com.br/developers</strong>",
              "<strong>Suas integrações</strong> → Criar aplicação",
              "Copie <strong>Public Key</strong> + <strong>Access Token</strong> (TEST primeiro)",
              "Use <strong>Checkout Pro</strong> (link) ou <strong>Checkout Transparente</strong> (embedded)",
              "Assinaturas: API <strong>Preapproval</strong> para recorrência",
              "Painel → <strong>Webhooks</strong> → URL + eventos payment",
              "Teste sandbox antes de produção"
            ],
            prompt: "Mercado Pago SDK v2 Node.js: assinatura recorrente Pix+cartão, webhook payment approved, liberar acesso. Sandbox + produção passo a passo."
          },
          {
            value: "stripe",
            label: "Stripe (internacional · cartão recorrente)",
            guide: [
              "<strong>dashboard.stripe.com</strong> → Create account",
              "Products → <strong>+ Add product</strong> → preço recorrente",
              "Payment Links → crie link ou use Checkout Session API",
              "Developers → Webhooks → <strong>+ Add endpoint</strong>",
              "Eventos: <strong>checkout.session.completed</strong>, <strong>invoice.paid</strong>",
              "Copie <strong>Signing secret</strong> (whsec_...)"
            ],
            prompt: "Stripe Checkout + Customer Portal Node.js: sessão recorrente, webhook, cancelamento self-service. Código completo."
          },
          {
            value: "gumroad",
            label: "Gumroad (internacional · simples)",
            guide: [
              "gumroad.com → Sign Up → Create Product",
              "Pricing: subscription ou one-time",
              "Settings → Advanced → <strong Ping URL</strong> (webhook)",
              "URL: seu endpoint + salve",
              "Embed botão ou use link direto na landing page"
            ],
            prompt: "Webhook Gumroad ping: validar, liberar acesso por email. Integração simples Node.js."
          },
          {
            value: "nao_sei",
            label: "Não sei qual escolher · me ajude",
            guide: [
              "Comunidade/curso BR → <strong>Kiwify</strong> ou Hotmart",
              "SaaS com login próprio → Mercado Pago ou Stripe",
              "Quer afiliados → Hotmart ou Eduzz",
              "Internacional → Stripe ou Gumroad",
              "Começando? Kiwify é o mais rápido (15 min setup)"
            ],
            prompt: "Comparativo completo: Kiwify vs Hotmart vs Eduzz vs Mercado Pago vs Stripe. Taxas, recorrência, facilidade, webhooks, qual para produto R$47/mês comunidade SaaS."
          }
        ]
      },
      {
        id: "cobranca",
        title: "Etapa 3 · Tipo de Cobrança e Preço",
        question: "Como vai cobrar e qual o preço?",
        tip: "Exemplo: R$47/mês recorrente ou R$497 pagamento único anual.",
        type: "choice",
        field: "cobranca",
        options: [
          { value: "mensal", label: "Assinatura mensal (ex: R$47/mês)", guide: ["Na Kiwify/Hotmart: escolha tipo <strong>Assinatura/Recorrência</strong>", "Defina valor mensal + trial opcional (7 dias grátis)", "Configure cancelamento automático se inadimplente"], prompt: "Configurar assinatura mensal R$47 na [PLATAFORMA]: onde clicar, campos obrigatórios, trial 7 dias." },
          { value: "anual", label: "Plano anual com desconto (ex: R$497/ano)", guide: ["Crie 2 planos: mensal R$47 e anual R$497", "Destaque economia de 2 meses no checkout", "Hotmart/Kiwify: adicione order bump anual"], prompt: "Dois planos mensal+anual na [PLATAFORMA]: copy checkout, order bump, comparativo preços." },
          { value: "unico", label: "Pagamento único (acesso vitalício)", guide: ["Tipo produto: pagamento único", "Sem recorrência · acesso permanente", "Ideal para curso fechado ou licença"], prompt: null },
          { value: "ambos", label: "Mensal + Anual (2 opções no checkout)", guide: ["Crie 2 produtos ou 2 planos na mesma oferta", "Checkout mostra toggle mensal/anual", "Kiwify: use múltiplos planos no mesmo produto"], prompt: "Checkout com toggle mensal R$47 / anual R$497 na [PLATAFORMA]. Passo a passo visual." }
        ]
      },
      {
        id: "preco",
        title: "Etapa 4 · Valor do Plano",
        question: "Qual o preço exato do seu plano?",
        type: "text",
        field: "preco",
        placeholder: "Ex: R$47/mês, R$497/ano, ou R$197 único..."
      },
      {
        id: "automacao",
        title: "Etapa 5 · Liberar Acesso Automático",
        question: "Como vai liberar acesso no dashboard após pagamento?",
        tip: "Webhook da plataforma → seu servidor → libera login do aluno automaticamente.",
        type: "choice",
        field: "automacao",
        options: [
          {
            value: "n8n",
            label: "n8n (automação visual · grátis)",
            guide: [
              "n8n.io → cloud grátis ou instale local",
              "Workflow: <strong>Webhook</strong> recebe Kiwify/Hotmart",
              "Nó 2: filtrar evento pagamento aprovado",
              "Nó 3: <strong>Firebase/Supabase</strong> → criar/atualizar usuário",
              "Nó 4: <strong>Resend</strong> → email boas-vindas com link login",
              "Ative workflow → copie URL webhook → cole na Kiwify/Hotmart"
            ],
            prompt: "Workflow n8n: webhook Kiwify/Hotmart → Firebase Auth criar usuário → email Resend boas-vindas. JSON exportável + onde colar URL na plataforma."
          },
          {
            value: "firebase",
            label: "Firebase Functions (backend grátis)",
            guide: [
              "Crie Cloud Function HTTP: <code>/webhooks/checkout</code>",
              "Valide assinatura do webhook (token Kiwify/Hottok Hotmart)",
              "Se pagamento OK → Firestore: users/{email}.paid = true",
              "Envie email via Resend ou Firebase Extensions",
              "Deploy: <code>firebase deploy --only functions</code>",
              "Cole URL da function no painel da plataforma"
            ],
            prompt: "Firebase Cloud Function webhook [PLATAFORMA]: validar pagamento, atualizar Firestore, enviar email acesso. Código completo index.js + firebase.json."
          },
          {
            value: "express",
            label: "Node.js/Express na VPS ou Vercel",
            guide: [
              "Rota POST <code>/api/webhooks/kiwify</code> (ou hotmart/mercadopago)",
              "Valide token/HMAC no header",
              "Atualize banco PostgreSQL/Supabase: status assinatura",
              "Redirecione cliente para /dashboard após checkout (URL sucesso)",
              "Teste com webhook de sandbox antes de produção"
            ],
            prompt: "Express.js webhook [PLATAFORMA]: validação, PostgreSQL/Supabase update, página obrigado. Código server.js completo."
          },
          {
            value: "manual",
            label: "Manual por enquanto (planilha + email)",
            guide: [
              "Exporte vendas da Kiwify/Hotmart diariamente",
              "Google Sheets: lista emails pagantes",
              "Libere acesso manual no dashboard",
              "Quando tiver 10+ vendas/mês → automatize com n8n"
            ],
            prompt: "Processo manual temporário: planilha controle assinantes Kiwify/Hotmart, checklist liberação acesso, quando migrar para webhook."
          }
        ]
      },
      {
        id: "hospedagem",
        title: "Etapa 6 · Hospedagem do Webhook",
        question: "Onde hospedar o endpoint que recebe o webhook?",
        type: "choice",
        field: "hospedagem",
        options: [
          {
            value: "firebase",
            label: "Firebase Functions (100% grátis)",
            guide: ["firebase.google.com → Functions → HTTPS trigger", "URL gerada: https://us-central1-projeto.cloudfunctions.net/webhook", "Cole essa URL na Kiwify/Hotmart → Webhooks"],
            prompt: null
          },
          {
            value: "supabase",
            label: "Supabase Edge Functions",
            guide: ["Supabase Dashboard → Edge Functions → New function", "Deploy webhook handler", "URL: https://projeto.supabase.co/functions/v1/webhook"],
            prompt: null
          },
          {
            value: "vercel",
            label: "Vercel Serverless (grátis)",
            guide: ["vercel.com → Import projeto Next/Express", "Crie api/webhook.js na pasta api/", "Deploy automático → URL: https://seusite.vercel.app/api/webhook", "Cole URL no painel checkout"],
            prompt: "API route Vercel /api/webhook [PLATAFORMA]: handler completo serverless."
          },
          {
            value: "vps",
            label: "VPS (URL fixa 24h)",
            guide: ["Nginx proxy → Express na porta 3000", "URL: https://api.seudominio.com/webhooks/kiwify", "Obrigatório HTTPS (webhooks exigem SSL)"],
            prompt: null
          }
        ]
      }
    ],
    buildFinalPrompt(answers) {
      const gwMap = {
        kiwify: "Kiwify",
        hotmart: "Hotmart",
        eduzz: "Eduzz",
        mercadopago: "Mercado Pago",
        stripe: "Stripe",
        gumroad: "Gumroad",
        nao_sei: "Kiwify (recomendado)"
      };
      const gw = gwMap[answers.gateway] || "Kiwify";
      const hosp = answers.hospedagem || "firebase";
      const auto = answers.automacao || "n8n";

      return `Aja como especialista em billing, checkout e webhooks para infoprodutos/SaaS no Brasil.

PLATAFORMA CHECKOUT: ${gw}
Tipo: ${answers.tipo_checkout || "plataforma pronta"}
Cobrança: ${answers.cobranca || "mensal"}
Preço: ${answers.preco || "R$47/mês"}
Automação acesso: ${auto}
Hospedagem webhook: ${getHostingLabel(hosp)}

Entregue GUIA COMPLETO DE CONFIGURAÇÃO:

1. CHECKOUT ${gw} · passo a passo onde clicar no painel:
   - Criar produto/plano ${answers.preco || "R$47/mês"}
   - Configurar ${answers.cobranca || "recorrência"}
   - Copiar link checkout para landing page
   - Página de obrigado / redirect pós-pagamento

2. WEBHOOK ${gw} · configuração exata:
   - Onde cadastrar URL no painel ${gw}
   - Quais eventos marcar (pagamento aprovado, cancelamento)
   - Como copiar token secreto (Hottok/secret key)
   - URL exemplo: https://meusite.com/api/webhooks/${answers.gateway || "kiwify"}

3. CÓDIGO BACKEND (${auto} + ${hosp}):
   - Validar assinatura webhook ${gw}
   - Liberar acesso usuário por email
   - Revogar acesso se cancelamento
   - Email boas-vindas com link /dashboard

4. TESTE SANDBOX:
   - Como simular compra teste na ${gw}
   - Verificar webhook chegou (logs)
   - Confirmar acesso liberado

5. CHECKLIST GO-LIVE:
   - Trocar credenciais teste → produção
   - Testar Pix + cartão reais
   - Monitorar primeiras 10 vendas

Seja extremamente visual: "clique aqui", "menu X", "aba Y". Código completo comentado.`;
    }
  },

  8: {
    title: "Mídias Sociais",
    intro: "LinkedIn, Instagram e ManyChat. Guias visuais de onde clicar em cada plataforma.",
    steps: [
      {
        id: "perfis",
        title: "Etapa 1 · Otimizar Perfis",
        question: "Qual rede você vai otimizar primeiro?",
        type: "choice",
        field: "perfis",
        options: [
          { value: "linkedin", label: "LinkedIn (B2B · autoridade)", guide: ["linkedin.com → seu perfil → ícone <strong>lápis</strong>", "Foto profissional + banner (Canva 1584×396)", "Headline: resultado + nicho (120 chars)", "Sobre: problema → solução → CTA link", "Destaques: adicione links serviços/comunidade"], prompt: "Otimize LinkedIn B2B automação IA: 3 headlines, texto Sobre conversão, 5 tópicos destaque." },
          { value: "instagram", label: "Instagram (visual + Reels)", guide: ["Instagram → Editar perfil", "Bio: 1 linha valor + link (Linktree/beacons.ai)", "Foto logo/marca", "Destaques: Comunidade, Depoimentos, FAQ", "Mude para conta Profissional/Creator"], prompt: "Bio Instagram + 5 ideias destaques + primeiro carrossel autoridade." },
          { value: "ambos", label: "LinkedIn + Instagram juntos", guide: ["Canva: crie kit visual (cores, fonte)", "Mesma bio adaptada para cada rede", "Repurpose: post LinkedIn → carrossel Instagram", "ManyChat conecta Instagram para leads"], prompt: "Kit presença LinkedIn + Instagram: bios, 3 posts cada, calendário 2 semanas." },
          { value: "nao", label: "Criar perfis do zero", guide: ["Crie LinkedIn e Instagram hoje", "Canva: foto perfil + banner", "ChatGPT: escreva bio", "Primeiro post: apresentação + dor do nicho"], prompt: "Roteiro 7 dias: criar LinkedIn + Instagram do zero, bio, 3 posts, conectar 30 leads." }
        ]
      },
      {
        id: "marca",
        title: "Etapa 2 · Posicionamento",
        question: "Como você se posiciona? (1 frase)",
        type: "text",
        field: "marca",
        placeholder: "Ex: Especialista em automação com IA para clínicas..."
      },
      {
        id: "apps_post",
        title: "Etapa 3 · Apps para Criar Posts",
        question: "Quais apps usa para criar conteúdo?",
        type: "choice",
        field: "apps_post",
        options: [
          { value: "canva", label: "Canva (posts e carrosséis)", guide: ["canva.com → Create design → LinkedIn Post ou Instagram", "Brand Kit: salve cores e logo", "Templates → customize → Download", "Agende com Meta Business Suite se quiser"], prompt: "Template Canva carrossel 5 slides autoridade técnica. Texto de cada slide." },
          { value: "capcut", label: "CapCut (Reels e vídeos)", guide: ["CapCut → 9:16 → grave ou importe", "Templates virais → adapte texto", "Auto legendas → export", "Poste Reels + compartilhe no Stories"], prompt: "Roteiro Reels 30s autoridade + passos CapCut." },
          { value: "chatgpt", label: "ChatGPT (só texto · copiar manual)", guide: ["ChatGPT → peça post pronto", "Copie → cole no LinkedIn/Instagram", "Use Canva só para imagem de capa"], prompt: "10 posts LinkedIn prontos B2B automação: gancho, corpo, CTA cada." }
        ]
      },
      {
        id: "automacao",
        title: "Etapa 4 · ManyChat (Automação Direct)",
        question: "Vai configurar resposta automática no Instagram?",
        type: "choice",
        field: "automacao",
        options: [
          { value: "sim", label: "Sim · ManyChat (grátis até 1k contatos)", guide: ["manychat.com → Get Started Free", "Connect Instagram → autorize", "Automation → New Flow", "Trigger: <strong>User comments on post</strong> → keyword QUERO", "Send Message: PDF + pergunta + link", "Live → teste comentando QUERO"], prompt: "Fluxo ManyChat: comentário QUERO → DM PDF → qualificação → link. Copy 3 mensagens." },
          { value: "nao", label: "Não agora · só conteúdo manual", guide: ["Responda DMs manualmente 1x/dia", "Use CTA 'Comente QUERO' nos posts", "Quando tiver volume → configure ManyChat"], prompt: null }
        ]
      },
      {
        id: "frequencia",
        title: "Etapa 5 · Frequência",
        question: "Quantos posts por semana?",
        type: "choice",
        field: "frequencia",
        options: [
          { value: "3", label: "3 posts/semana", guide: ["Seg: educativo | Qua: case/prova | Sex: oferta suave", "Use calendário Google ou Notion"], prompt: null },
          { value: "5", label: "5 posts/semana", prompt: "Calendário 5 posts/sem LinkedIn+Instagram mix autoridade/venda." },
          { value: "7", label: "1 post/dia", prompt: "Calendário 7 posts/sem com temas rotativos." }
        ]
      }
    ],
    buildFinalPrompt(answers) {
      return `Aja como social media strategist B2B tech.

Marca: ${answers.marca || "automação IA"}
Rede foco: ${answers.perfis || "LinkedIn"}
Apps: ${answers.apps_post || "Canva"}
ManyChat: ${answers.automacao === "sim" ? "sim" : "não"}
Frequência: ${answers.frequencia || "3"}/sem

Entregue:
1. Bios otimizadas (LinkedIn + Instagram)
2. Calendário 4 semanas com onde clicar (Canva/CapCut)
3. 12 posts prontos (copy + instrução visual)
4. ${answers.automacao === "sim" ? "Fluxo ManyChat passo a passo" : "Estratégia DM manual"}
5. Métricas semanais`;
    }
  },

  9: {
    title: "Lançamento & Escala",
    intro: "Hora de lançar e escalar. Responda para receber prompts de go-to-market, outreach e contratação.",
    steps: [
      {
        id: "ia_pronta",
        title: "Etapa 1 · Status do Produto",
        question: "Em que fase está seu produto?",
        type: "choice",
        field: "fase",
        options: [
          { value: "mvp", label: "MVP pronto, preciso de primeiros clientes", prompt: null },
          { value: "beta", label: "Em beta com alguns usuários testando", prompt: null },
          { value: "ideia", label: "Ainda na fase de ideia/planejamento", prompt: "Tenho ideia de SaaS mas nada construído. Me dê um plano de 14 dias: validar ideia, construir MVP com IA, conseguir 3 beta testers, e preparar lançamento." }
        ]
      },
      {
        id: "lancamento",
        title: "Etapa 2 · Canal de Lançamento",
        question: "Onde quer lançar primeiro?",
        type: "choice",
        field: "canal",
        options: [
          { value: "producthunt", label: "Product Hunt (alcance global devs)", guide: ["producthunt.com → Sign Up", "Click <strong>Submit</strong> → New Product", "Preencha: nome, tagline, descrição, screenshots", "Agende launch para terça-feira 00:01 PST", "Peça upvotes: LinkedIn, Twitter, comunidades dev"], prompt: "Post Product Hunt completo: tagline, description, maker comment, estratégia 50 upvotes dia 1." },
          { value: "outreach", label: "Outreach direto (email/WhatsApp)", guide: ["Google Maps ou LinkedIn: liste 20 empresas locais", "Encontre WhatsApp/email do dono", "Envie mensagem personalizada (não spam)", "Use CRM grátis: Notion ou Google Sheets", "Follow-up dia 3 e dia 7"], prompt: "Sequência 3 cold emails B2B + script WhatsApp para demo SaaS gratuita." },
          { value: "organico", label: "Lançamento orgânico (7 dias)", guide: ["Dia -7: teaser Stories 'algo grande vem'", "Dia -3: countdown Canva nos Stories", "Dia 0: post LinkedIn + Reels demo", "Dia 0: email lista + grupo WhatsApp", "Oferta early bird 48h"], prompt: "Calendário lançamento orgânico 7 dias: copy cada post, horário, canal." }
        ]
      },
      {
        id: "meta",
        title: "Etapa 3 · Meta de Lançamento",
        question: "Qual sua meta para os primeiros 30 dias?",
        type: "text",
        field: "meta",
        placeholder: "Ex: 50 usuários, 10 pagantes, R$500 MRR..."
      },
      {
        id: "hospedagem",
        title: "Etapa 4 · Hospedagem para Lançamento",
        question: "Onde seu SaaS vai ficar no ar? 100% gratuito ou pode investir?",
        tip: "Firebase Hosting é grátis e ideal para lançar o MVP. Supabase ou VPS quando precisar escalar.",
        type: "choice",
        field: "hospedagem",
        options: HOSTING_STEP.options.map(o => ({
          ...o,
          guide: o.value === "firebase" ? [
            "Terminal: <code>npm install -g firebase-tools</code>",
            "<code>firebase login</code> → autorize no navegador",
            "<code>firebase init hosting</code> → selecione projeto",
            "<code>firebase deploy</code> → site no ar em minutos",
            "URL: seu-projeto.web.app · compartilhe no lançamento"
          ] : o.value === "supabase" ? [
            "Frontend: deploy Vercel (vercel.com) grátis",
            "Conecte GitHub → Import repo → Deploy",
            "Supabase já hospeda banco + auth",
            "Configure env vars VITE_SUPABASE_URL no Vercel"
          ] : [
            "Configure domínio DNS apontando para IP VPS",
            "Nginx + Certbot SSL",
            "PM2 start server.js",
            "Teste URL antes do dia D"
          ]
        }))
      },
      {
        id: "equipe",
        title: "Etapa 5 · Equipe",
        question: "Vai contratar ajuda ou fazer solo?",
        type: "choice",
        field: "equipe",
        options: [
          { value: "solo", label: "Solo · faço tudo com IA", prompt: null },
          { value: "freelancer", label: "Freelancer pontual (design, dev)", prompt: "Preciso contratar freelancer júnior para ajudar no SaaS. Crie: descrição da vaga, teste prático de 2h (integrar API de IA), critérios de avaliação, e faixa salarial justa." },
          { value: "socio", label: "Busco sócio/co-founder", prompt: "Busco co-founder técnico ou comercial para meu SaaS. Escreva post para LinkedIn + mensagem para enviar em comunidades de startups. Inclua: o que ofereço, o que busco, equity sugerida." }
        ]
      }
    ],
    buildFinalPrompt(answers) {
      const hosp = answers.hospedagem || "firebase";
      return `Aja como consultor de go-to-market para startups SaaS.

Fase: ${answers.fase || "MVP pronto"}
Canal: ${answers.canal || "outreach direto"}
Meta 30 dias: ${answers.meta || "10 clientes pagantes"}
Equipe: ${answers.equipe || "solo com IA"}

HOSPEDAGEM/DEPLOY: ${getHostingLabel(hosp)}
${getHostingInstructions(hosp, "lançamento")}

Plano completo de lançamento:
1. Checklist pré-lançamento (7 dias antes)
2. Deploy em produção (${hosp === "firebase" ? "firebase deploy · gratuito" : hosp === "supabase" ? "Vercel + Supabase" : "VPS + PM2 + domínio"})
3. Roteiro do dia D (hora a hora)
4. ${answers.canal === "producthunt" ? "Post Product Hunt pronto" : answers.canal === "outreach" ? "Sequência de 5 cold emails" : "Calendário orgânico 7 dias"}
5. Oferta especial early adopter (desconto + bônus)
6. Métricas diárias para acompanhar
7. Quando migrar de ${hosp === "firebase" ? "Firebase free → Supabase ou VPS" : hosp === "supabase" ? "Supabase free → plano Pro ou VPS" : "VPS atual → escalar recursos"}`;
    }
  },

  10: {
    title: "WhatsApp + IA · Funcionário Virtual 24h",
    intro: "Monte um robô de atendimento no WhatsApp que qualifica leads, responde dúvidas e agenda horários com IA. Escolha suas ferramentas e copie os prompts prontos.",
    steps: [
      {
        id: "nicho",
        title: "Etapa 1 · Seu Negócio",
        question: "Para qual nicho você quer criar o funcionário virtual?",
        tip: "Quanto mais específico o nicho, melhor a IA responde. Ex: clínica odontológica, imobiliária, barbearia, academia.",
        type: "choice",
        field: "nicho",
        options: [
          { value: "clinica", label: "Clínica / consultório (agendamento + dúvidas)", prompt: null },
          { value: "imobiliaria", label: "Imobiliária (qualificar compradores/locatários)", prompt: null },
          { value: "barbearia", label: "Barbearia / salão (horários + serviços)", prompt: null },
          { value: "infoproduto", label: "Infoproduto / Academy (vendas + suporte)", prompt: null },
          { value: "b2b", label: "B2B / automação para empresas", prompt: null },
          { value: "outro", label: "Outro nicho", prompt: null }
        ]
      },
      {
        id: "plataforma",
        title: "Etapa 2 · Conectar o WhatsApp",
        question: "Como você quer conectar o WhatsApp?",
        tip: "Evolution API é open-source e roda na sua VPS. Z-API e similar são mais simples (SaaS brasileiro). Typebot é visual, bom para começar sem código.",
        type: "choice",
        field: "plataforma",
        options: [
          {
            value: "evolution",
            label: "Evolution API (open-source · VPS/Docker)",
            guide: [
              "Acesse <strong>github.com/EvolutionAPI/evolution-api</strong>",
              "Instale via Docker: <code>docker compose up -d</code>",
              "Painel: crie instância → escaneie QR Code no celular",
              "Configure <strong>Webhook URL</strong> apontando para seu servidor",
              "Teste envio: POST /message/sendText na documentação"
            ],
            prompt: "Tutorial Evolution API do zero: Docker no VPS, criar instância, QR Code, webhook Node.js Express recebendo mensagens, responder automaticamente. Código completo comentado."
          },
          {
            value: "zapi",
            label: "Z-API ou API WhatsApp SaaS (mais fácil)",
            guide: [
              "Crie conta em provedor (ex: Z-API, UltraMsg, W-API)",
              "Conecte número WhatsApp via QR Code no painel",
              "Copie <strong>Token</strong> e <strong>Instance ID</strong>",
              "Configure webhook de mensagens recebidas",
              "Teste curl de envio de texto no painel do provedor"
            ],
            prompt: "Integração Z-API (ou similar) com Node.js: webhook recebe mensagem, processa, envia resposta. Rotas Express, .env, tratamento de mídia e erro."
          },
          {
            value: "typebot",
            label: "Typebot + WhatsApp (visual, low-code)",
            guide: [
              "Acesse <strong>typebot.io</strong> → Sign Up",
              "Create typebot → monte fluxo visual de perguntas",
              "Integrações → conecte WhatsApp via Evolution ou Z-API",
              "Publique bot → teste mandando mensagem",
              "Evolua para IA depois com webhook n8n"
            ],
            prompt: "Montar atendimento WhatsApp no Typebot: fluxo qualificação 5 perguntas, integração WhatsApp, handoff para humano, export JSON do typebot."
          },
          {
            value: "n8n_only",
            label: "n8n + WhatsApp (sem programar)",
            guide: [
              "<strong>n8n.io</strong> → cloud grátis ou self-hosted",
              "New Workflow → trigger <strong>Webhook</strong>",
              "Nó HTTP Request → API WhatsApp (Evolution/Z-API)",
              "Nó OpenAI → gera resposta",
              "Ative workflow → cole URL webhook na API WhatsApp"
            ],
            prompt: "Workflow n8n completo WhatsApp: webhook mensagem → OpenAI Chat → resposta WhatsApp → salvar lead Google Sheets. JSON exportável passo a passo."
          }
        ]
      },
      {
        id: "ia",
        title: "Etapa 3 · Inteligência Artificial",
        question: "Qual IA vai ser o cérebro do funcionário virtual?",
        type: "choice",
        field: "ia",
        options: [
          {
            value: "openai",
            label: "OpenAI (GPT-4o-mini · recomendado)",
            guide: [
              "platform.openai.com → API Keys → Create",
              "Copie chave → .env <code>OPENAI_API_KEY=</code>",
              "Use modelo <code>gpt-4o-mini</code> (barato e rápido)",
              "Defina system prompt com regras do negócio",
              "Limite tokens e custo por conversa"
            ],
            prompt: "Código Node.js: receber texto WhatsApp → OpenAI chat completions com system prompt de atendente [NICHO] → enviar resposta WhatsApp. Inclua histórico das últimas 10 mensagens."
          },
          {
            value: "gemini",
            label: "Google Gemini (tier free generoso)",
            guide: [
              "aistudio.google.com → Get API Key",
              "npm install @google/generative-ai",
              "Configure system instruction no modelo",
              "Teste no playground antes de integrar"
            ],
            prompt: "Integração Gemini API com webhook WhatsApp: mesmo fluxo OpenAI, código Node.js completo, system prompt funcionário virtual."
          },
          {
            value: "hibrido",
            label: "Híbrido · IA + respostas fixas",
            guide: [
              "Palavras-chave (preço, horário, endereço) → resposta fixa instantânea",
              "Resto → OpenAI/Gemini",
              "Reduz custo e acelera FAQ",
              "Use switch/case ou n8n IF node"
            ],
            prompt: "Arquitetura híbrida WhatsApp: FAQ fixo (preço, horário, local) + fallback IA OpenAI. Código Node.js com router de intenções simples."
          }
        ]
      },
      {
        id: "funcoes",
        title: "Etapa 4 · Funções do Funcionário Virtual",
        question: "O que o robô deve fazer automaticamente?",
        type: "choice",
        field: "funcoes",
        options: [
          { value: "atendimento", label: "Atendimento 24h + FAQ", prompt: "System prompt WhatsApp: atendente [NICHO] 24h, tom profissional e humano, FAQ completo, nunca inventar preços." },
          { value: "qualificacao", label: "Qualificar leads (perguntas + score)", prompt: "Fluxo WhatsApp qualificação: 5 perguntas, score lead quente/morno/frio, salvar CRM, alertar vendedor se quente." },
          { value: "agendamento", label: "Agendar horários (Calendly/Google Calendar)", prompt: "Bot WhatsApp agendamento: oferece slots, confirma data/hora, envia lembrete 24h antes, integra Google Calendar API." },
          { value: "completo", label: "Completo · FAQ + qualificar + agendar + CRM", prompt: "Funcionário virtual completo: saudação, FAQ, qualificação, agendamento, handoff humano, log no Firestore/Sheets. Arquitetura + prompts + código." }
        ]
      },
      {
        id: "integracao",
        title: "Etapa 5 · CRM e Automações",
        question: "Onde salvar leads e conectar automações?",
        type: "choice",
        field: "integracao",
        options: [
          { value: "sheets", label: "Google Sheets (simples · grátis)", guide: ["Google Sheets → nova planilha Leads", "n8n ou código → Google Sheets API", "Colunas: nome, WhatsApp, interesse, score, data"], prompt: "Salvar lead WhatsApp no Google Sheets via Node.js ou n8n. Credenciais, código e formato da planilha." },
          { value: "firebase", label: "Firebase Firestore (escala com SaaS)", guide: ["Firestore → coleção leads", "Webhook grava documento por telefone", "Dashboard admin lê leads em tempo real"], prompt: "Webhook WhatsApp → Firestore: schema leads, código Node.js firebase-admin, regras de segurança." },
          { value: "n8n", label: "n8n (WhatsApp → email → Slack → CRM)", guide: ["Lead qualificado → email Resend", "Notificação Slack/Discord", "Tag no HubSpot/Pipedrive se tiver"], prompt: "Automações pós-lead WhatsApp no n8n: 3 workflows (notificar dono, email boas-vindas, follow-up 24h)." },
          { value: "notion", label: "Notion como CRM leve", guide: ["Crie database Leads no Notion", "n8n HTTP → Notion API", "Status: novo, contato, fechado"], prompt: "Integrar WhatsApp leads com Notion database via n8n ou Node.js." }
        ]
      },
      {
        id: "deploy",
        title: "Etapa 6 · Colocar no Ar",
        question: "Onde hospedar o funcionário virtual?",
        type: "choice",
        field: "deploy",
        options: [
          { value: "vps", label: "VPS (Hetzner, DigitalOcean · controle total)", guide: ["Ubuntu + Docker Evolution + Node", "PM2 para API Node", "Nginx + SSL Certbot", "Domínio webhook: api.seudominio.com/webhook/whatsapp"], prompt: "Deploy completo VPS: Evolution API + Express bot + PM2 + Nginx + SSL. Comandos Linux passo a passo." },
          { value: "railway", label: "Railway / Render (deploy rápido)", guide: ["GitHub repo → conecte Railway", "Env vars OPENAI + WHATSAPP_TOKEN", "Deploy automático", "URL pública vira webhook"], prompt: "Deploy bot WhatsApp Node.js no Railway: Dockerfile, variáveis, webhook URL, logs e restart." },
          { value: "n8n_cloud", label: "Só n8n Cloud (sem servidor próprio)", guide: ["n8n.io cloud → workflow ativo 24h", "Webhook público incluso", "Limite free: suficiente para testar"], prompt: "Checklist produção n8n cloud WhatsApp: limites, backup workflow, monitoramento, quando migrar VPS." }
        ]
      }
    ],
    buildFinalPrompt(answers) {
      const nichoLabels = {
        clinica: "clínica/consultório",
        imobiliaria: "imobiliária",
        barbearia: "barbearia/salão",
        infoproduto: "infoproduto/Academy",
        b2b: "automação B2B",
        outro: answers.nicho_custom || "negócio local"
      };
      const nicho = nichoLabels[answers.nicho] || answers.nicho || "negócio local";
      const plataforma = answers.plataforma || "evolution";
      const ia = answers.ia || "openai";
      const funcoes = answers.funcoes || "completo";
      const integracao = answers.integracao || "sheets";
      const deploy = answers.deploy || "vps";

      return `Aja como engenheiro sênior especialista em automação WhatsApp + IA.

PROJETO: Funcionário virtual 24h no WhatsApp para ${nicho}.

STACK ESCOLHIDA:
- WhatsApp: ${plataforma} (${plataforma === "evolution" ? "Evolution API Docker" : plataforma === "zapi" ? "Z-API/SaaS" : plataforma === "typebot" ? "Typebot visual" : "n8n workflow"})
- IA: ${ia}
- Funções: ${funcoes}
- CRM/integração: ${integracao}
- Deploy: ${deploy}

ENTREGUE UM PLANO COMPLETO EXECUTÁVEL:

1. ARQUITETURA (diagrama em texto): celular → API WhatsApp → webhook → IA → CRM → resposta

2. PASSO A PASSO ONDE CLICAR (Dia 1 a Dia 5):
   - Dia 1: conectar WhatsApp (QR Code, webhook teste)
   - Dia 2: system prompt + primeira resposta IA
   - Dia 3: fluxo qualificação + FAQ híbrido
   - Dia 4: integrar CRM (${integracao})
   - Dia 5: deploy produção (${deploy})

3. SYSTEM PROMPT COMPLETO do funcionário virtual (tom humano, regras, limites, quando passar para humano)

4. CÓDIGO NODE.JS COMPLETO:
   - POST /webhook/whatsapp (recebe mensagem)
   - Integração OpenAI/Gemini com histórico
   - Envio resposta via API WhatsApp
   - Salvar lead no ${integracao}
   - Tratamento erro + rate limit

5. FLUXO n8n (se aplicável): JSON ou passos visuais

6. 10 MENSAGENS MODELO: saudação, FAQ preço, FAQ horário, qualificação, agendamento, objeção, handoff humano, follow-up 24h, reengajamento, encerramento

7. CHECKLIST GO-LIVE: testes, monitoramento, backup, custo estimado OpenAI/mês

8. COMO VENDER esse serviço para outros negócios (precificação R$297-997 setup + mensalidade)

Seja extremamente prático: onde clicar, o que colar, código comentado em português.`;
    },
    buildFinalExtraHtml(answers) {
      const tools = [
        { name: "Evolution API", url: "https://github.com/EvolutionAPI/evolution-api", desc: "API WhatsApp open-source · Docker" },
        { name: "Typebot", url: "https://typebot.io/", desc: "Fluxos visuais + WhatsApp" },
        { name: "n8n", url: "https://n8n.io/", desc: "Automação webhook → IA → CRM" },
        { name: "OpenAI API", url: "https://platform.openai.com/", desc: "Cérebro do atendimento" },
        { name: "Chatwoot", url: "https://www.chatwoot.com/", desc: "Inbox multi-canal + handoff humano" }
      ];
      return `
        <div class="glass-card rounded-xl p-5 border border-green-500/20 space-y-3 mt-4">
          <h4 class="text-sm font-bold text-green-400 uppercase tracking-wider">Ferramentas do Módulo WhatsApp</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${tools.map(t => `
              <a href="${t.url}" target="_blank" rel="noopener noreferrer" class="block p-3 rounded-lg bg-slate-950 border border-gray-800 hover:border-green-500/30 transition-colors">
                <span class="text-sm font-bold text-white">${t.name}</span>
                <p class="text-[11px] text-gray-500 mt-1">${t.desc}</p>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }
  }
};

// ─── ENGINE DO WIZARD ───

let wizardState = {
  moduleId: null,
  currentStep: 0,
  answers: {},
  collectedPrompts: []
};

function getWizardProgressKey(moduleId) {
  return `conectwm_wizard_${moduleId}`;
}

function saveWizardProgress() {
  if (!wizardState.moduleId) return;
  localStorage.setItem(getWizardProgressKey(wizardState.moduleId), JSON.stringify({
    currentStep: wizardState.currentStep,
    answers: wizardState.answers,
    collectedPrompts: wizardState.collectedPrompts
  }));
}

function loadWizardProgress(moduleId) {
  try {
    const saved = localStorage.getItem(getWizardProgressKey(moduleId));
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return null;
}

function resetWizardState(moduleId) {
  const saved = loadWizardProgress(moduleId);
  wizardState = {
    moduleId,
    currentStep: saved ? saved.currentStep : 0,
    answers: saved ? saved.answers : {},
    collectedPrompts: saved ? saved.collectedPrompts : []
  };
}

function initModuleWizard(moduleId) {
  const wizard = moduleWizardsData[moduleId];
  if (!wizard) return;

  resetWizardState(moduleId);
  renderWizardSidebar(moduleId);
  renderWizardStep();
  updateWizardProgressBar();
}

function getCurrentWizard() {
  return moduleWizardsData[wizardState.moduleId];
}

function renderWizardSidebar(moduleId) {
  const wizard = moduleWizardsData[moduleId];
  const container = document.getElementById('lessons-playlist');
  if (!container || !wizard) return;

  container.innerHTML = '';
  wizard.steps.forEach((step, index) => {
    const isActive = index === wizardState.currentStep;
    const isDone = index < wizardState.currentStep || wizardState.answers[step.field];
    const item = document.createElement('button');
    item.className = `w-full p-3 rounded-xl flex items-center gap-3 border text-left transition-all ${
      isActive ? 'bg-sky-500/10 border-sky-500/30 text-white' :
      isDone ? 'bg-green-500/5 border-green-500/20 text-green-400' :
      'bg-slate-900/50 border-gray-800 hover:border-gray-700 text-gray-400'
    }`;
    item.innerHTML = `
      <div class="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold font-outfit ${
        isDone && !isActive ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
        isActive ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400' :
        'bg-slate-950 border border-gray-800 text-gray-500'
      }">${isDone && !isActive ? '✓' : index + 1}</div>
      <div class="flex-1 min-w-0">
        <h5 class="font-bold text-[11px] truncate leading-snug">${step.title}</h5>
      </div>
    `;
    item.addEventListener('click', () => {
      if (index <= wizardState.currentStep) {
        wizardState.currentStep = index;
        renderWizardStep();
        renderWizardSidebar(moduleId);
        updateWizardProgressBar();
      }
    });
    container.appendChild(item);
  });

  // Etapa final
  const finalIdx = wizard.steps.length;
  const isFinal = wizardState.currentStep === finalIdx;
  const finalItem = document.createElement('button');
  finalItem.className = `w-full p-3 rounded-xl flex items-center gap-3 border text-left transition-all ${
    isFinal ? 'bg-purple-500/10 border-purple-500/30 text-white' :
    wizardState.currentStep > finalIdx - 1 && Object.keys(wizardState.answers).length >= wizard.steps.length ?
    'bg-slate-900/50 border-gray-800 hover:border-purple-500/30 text-gray-400' :
    'bg-slate-900/30 border-gray-800/50 text-gray-600 cursor-not-allowed'
  }`;
  finalItem.innerHTML = `
    <div class="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-purple-400 text-xs">★</div>
    <div class="flex-1 min-w-0">
      <h5 class="font-bold text-[11px] truncate">Prompt Final Personalizado</h5>
    </div>
  `;
  finalItem.addEventListener('click', () => {
    if (wizardState.currentStep >= wizard.steps.length - 1) {
      wizardState.currentStep = finalIdx;
      renderWizardStep();
      renderWizardSidebar(moduleId);
      updateWizardProgressBar();
    }
  });
  container.appendChild(finalItem);
}

function updateWizardProgressBar() {
  const wizard = getCurrentWizard();
  if (!wizard) return;
  const total = wizard.steps.length + 1;
  const current = wizardState.currentStep + 1;
  const pct = Math.min(100, Math.round((current / total) * 100));

  const bar = document.getElementById('wizard-progress-bar');
  const label = document.getElementById('wizard-progress-label');
  if (bar) bar.style.width = `${pct}%`;
  if (label) label.textContent = `Etapa ${Math.min(current, total)} de ${total} · ${pct}% concluído`;
}

function renderWizardStep() {
  const wizard = getCurrentWizard();
  if (!wizard) return;

  const container = document.getElementById('wizard-step-container');
  if (!container) return;

  // Etapa final · prompt personalizado
  if (wizardState.currentStep >= wizard.steps.length) {
    const finalPrompt = wizard.buildFinalPrompt(wizardState.answers);
    container.innerHTML = `
      <div class="wizard-step fade-in space-y-5">
        <div class="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs font-bold text-purple-400 uppercase tracking-wider">
          <span>★ Prompt Final Personalizado</span>
        </div>
        <h3 class="text-2xl font-bold font-outfit text-white">Seu Prompt Mestre está pronto!</h3>
        <p class="text-gray-400 text-sm leading-relaxed">Com base nas suas respostas, geramos um prompt completo. Copie e cole no Cursor, ChatGPT ou Claude para começar agora.</p>

        ${wizardState.collectedPrompts.length > 0 ? `
          <div class="space-y-3">
            <h4 class="text-sm font-bold text-sky-400 uppercase tracking-wider">Prompts das Etapas Anteriores</h4>
            ${wizardState.collectedPrompts.map((p, i) => `
              <div class="glass-card rounded-xl p-4 border border-gray-800 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-gray-400">Prompt ${i + 1}</span>
                  <button onclick="copyWizardPrompt(this)" data-prompt="${encodeURIComponent(p)}" class="text-xs font-bold text-sky-400 hover:text-sky-300 px-2 py-1 rounded-lg bg-sky-500/10">Copiar</button>
                </div>
                <p class="text-xs text-gray-300 font-mono leading-relaxed line-clamp-3">${escapeHtml(p.substring(0, 200))}...</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="glass-card rounded-2xl p-5 border border-purple-500/20 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold uppercase tracking-wider text-purple-300">Prompt Mestre · Copie e Use Agora</span>
            <button id="copy-final-prompt-btn" class="bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold font-outfit px-4 py-2 rounded-lg transition-colors">Copiar Prompt</button>
          </div>
          <textarea id="wizard-final-prompt" readonly class="w-full h-48 bg-slate-950 border border-gray-900 rounded-xl p-4 text-xs text-purple-200 font-mono focus:outline-none resize-none leading-relaxed">${escapeHtml(finalPrompt)}</textarea>
        </div>

        ${typeof wizard.buildFinalExtraHtml === 'function' ? wizard.buildFinalExtraHtml(wizardState.answers) : ''}

        <div class="flex gap-3">
          <button id="wizard-restart-btn" class="px-5 py-3 rounded-xl bg-slate-900 border border-gray-800 text-sm font-bold text-gray-400 hover:text-white transition-all">Recomeçar Módulo</button>
          <button id="wizard-mark-done-btn" class="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 text-sm font-bold transition-all">Marcar Módulo Concluído ✓</button>
        </div>
      </div>
    `;

    document.getElementById('copy-final-prompt-btn')?.addEventListener('click', () => {
      copyToClipboard(finalPrompt, document.getElementById('copy-final-prompt-btn'));
    });
    document.getElementById('wizard-restart-btn')?.addEventListener('click', () => {
      localStorage.removeItem(getWizardProgressKey(wizardState.moduleId));
      resetWizardState(wizardState.moduleId);
      renderWizardSidebar(wizardState.moduleId);
      renderWizardStep();
      updateWizardProgressBar();
    });
    document.getElementById('wizard-mark-done-btn')?.addEventListener('click', async () => {
      localStorage.setItem(`conectwm_module_done_${wizardState.moduleId}`, 'true');
      const btn = document.getElementById('wizard-mark-done-btn');
      if (btn) { btn.textContent = 'Módulo Concluído! ✓'; btn.classList.add('opacity-70'); }
      if (window.Certificates?.markModuleComplete) {
        await Certificates.markModuleComplete(wizardState.moduleId);
      }
    });
    return;
  }

  const step = wizard.steps[wizardState.currentStep];
  const savedAnswer = wizardState.answers[step.field];

  let inputHtml = '';

  if (step.type === 'choice') {
    inputHtml = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      ${step.options.map(opt => `
        <button type="button" class="wizard-choice-btn text-left p-4 rounded-xl border transition-all ${
          savedAnswer === opt.value
            ? 'bg-sky-500/15 border-sky-500/40 text-white ring-1 ring-sky-500/30'
            : 'bg-slate-900/60 border-gray-800 hover:border-sky-500/30 text-gray-300 hover:text-white'
        }" data-value="${opt.value}">
          <span class="text-sm font-semibold">${opt.label}</span>
        </button>
      `).join('')}
    </div>`;
  } else if (step.type === 'text') {
    inputHtml = `
      <textarea id="wizard-text-input" class="w-full h-28 mt-4 bg-slate-950 border border-gray-800 rounded-xl p-4 text-sm text-white placeholder-gray-500 input-focus-glow transition-all resize-none focus:outline-none focus:border-sky-500/50" placeholder="${step.placeholder || 'Digite aqui...'}">${savedAnswer || ''}</textarea>
    `;
  }

  const stepPrompt = getStepPrompt(step, savedAnswer);
  const optionGuide = getOptionGuide(step, savedAnswer);
  const guideHtml = renderGuideBox(optionGuide || step.guide, optionGuide ? 'Guia do App Escolhido' : 'Passo a Passo · Onde Clicar');

  container.innerHTML = `
    <div class="wizard-step fade-in space-y-4">
      <div class="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-1 text-xs font-bold text-sky-400 uppercase tracking-wider">
        ${step.title}
      </div>
      <h3 class="text-xl md:text-2xl font-bold font-outfit text-white leading-snug">${step.question}</h3>
      ${step.tip ? `<p class="text-gray-500 text-sm flex items-start gap-2"><span class="text-sky-400 shrink-0">💡</span> ${step.tip}</p>` : ''}
      ${guideHtml}
      ${inputHtml}
      ${stepPrompt ? `
        <div id="wizard-step-prompt-box" class="glass-card rounded-xl p-4 border border-sky-500/15 space-y-2 mt-4">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-sky-400 uppercase tracking-wider">Prompt Pronto para esta Etapa</span>
            <button id="copy-step-prompt-btn" class="text-xs font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 px-3 py-1.5 rounded-lg transition-colors">Copiar</button>
          </div>
          <textarea id="wizard-step-prompt" readonly class="w-full h-24 bg-slate-950 border border-gray-900 rounded-lg p-3 text-xs text-sky-200 font-mono focus:outline-none resize-none leading-relaxed">${escapeHtml(stepPrompt)}</textarea>
        </div>
      ` : '<div id="wizard-step-prompt-box" class="hidden"></div>'}
      <div class="flex justify-between items-center pt-4 border-t border-gray-900">
        <button id="wizard-prev-btn" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-gray-800 text-sm font-bold text-gray-400 hover:text-white transition-all ${wizardState.currentStep === 0 ? 'opacity-40 cursor-not-allowed' : ''}" ${wizardState.currentStep === 0 ? 'disabled' : ''}>
          ← Anterior
        </button>
        <button id="wizard-next-btn" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-sm font-bold transition-all btn-glow-tech">
          ${wizardState.currentStep === wizard.steps.length - 1 ? 'Ver Prompt Final ★' : 'Próxima Etapa →'}
        </button>
      </div>
    </div>
  `;

  // Event listeners
  container.querySelectorAll('.wizard-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.wizard-choice-btn').forEach(b => {
        b.className = 'wizard-choice-btn text-left p-4 rounded-xl border transition-all bg-slate-900/60 border-gray-800 hover:border-sky-500/30 text-gray-300 hover:text-white';
      });
      btn.className = 'wizard-choice-btn text-left p-4 rounded-xl border transition-all bg-sky-500/15 border-sky-500/40 text-white ring-1 ring-sky-500/30';
      wizardState.answers[step.field] = btn.dataset.value;

      const prompt = getStepPrompt(step, btn.dataset.value);
      const guide = getOptionGuide(step, btn.dataset.value);
      if (prompt) {
        addCollectedPrompt(prompt);
        showStepPrompt(container, prompt);
      }
      if (guide) {
        showStepGuide(container, guide);
      }
      saveWizardProgress();
    });
  });

  document.getElementById('wizard-prev-btn')?.addEventListener('click', () => {
    if (wizardState.currentStep > 0) {
      wizardState.currentStep--;
      renderWizardStep();
      renderWizardSidebar(wizardState.moduleId);
      updateWizardProgressBar();
    }
  });

  document.getElementById('wizard-next-btn')?.addEventListener('click', () => {
    if (!validateCurrentStep(step)) return;

    if (step.type === 'text') {
      const textVal = document.getElementById('wizard-text-input')?.value.trim();
      wizardState.answers[step.field] = textVal;
    }

    wizardState.currentStep++;
    saveWizardProgress();
    renderWizardStep();
    renderWizardSidebar(wizardState.moduleId);
    updateWizardProgressBar();
  });

  document.getElementById('copy-step-prompt-btn')?.addEventListener('click', () => {
    const prompt = document.getElementById('wizard-step-prompt')?.value;
    if (prompt) copyToClipboard(prompt, document.getElementById('copy-step-prompt-btn'));
  });
}

function getStepPrompt(step, value) {
  if (!value || step.type !== 'choice') return null;
  const opt = step.options.find(o => o.value === value);
  return opt?.prompt || null;
}

function showStepGuide(container, guide) {
  let box = container.querySelector('#wizard-step-guide-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'wizard-step-guide-box';
    const promptBox = container.querySelector('#wizard-step-prompt-box');
    if (promptBox) {
      promptBox.insertAdjacentElement('afterend', box);
    } else {
      const inputArea = container.querySelector('.wizard-choice-btn')?.closest('.grid') || container.querySelector('#wizard-text-input');
      inputArea?.insertAdjacentElement('afterend', box);
    }
  }
  box.innerHTML = renderGuideBox(guide, 'Guia do App Escolhido · Siga Agora');
}

function showStepPrompt(container, prompt) {
  let box = container.querySelector('#wizard-step-prompt-box');
  if (!box) return;
  box.classList.remove('hidden');
  box.innerHTML = `
    <div class="flex justify-between items-center">
      <span class="text-xs font-bold text-sky-400 uppercase tracking-wider">Prompt Pronto para esta Etapa</span>
      <button id="copy-step-prompt-btn" class="text-xs font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 px-3 py-1.5 rounded-lg transition-colors">Copiar</button>
    </div>
    <textarea id="wizard-step-prompt" readonly class="w-full h-24 bg-slate-950 border border-gray-900 rounded-lg p-3 text-xs text-sky-200 font-mono focus:outline-none resize-none leading-relaxed">${escapeHtml(prompt)}</textarea>
  `;
  document.getElementById('copy-step-prompt-btn')?.addEventListener('click', () => {
    copyToClipboard(prompt, document.getElementById('copy-step-prompt-btn'));
  });
}

function validateCurrentStep(step) {
  const answer = wizardState.answers[step.field];
  if (step.type === 'choice' && !answer) {
    alert('Selecione uma opção para continuar.');
    return false;
  }
  if (step.type === 'text') {
    const textVal = document.getElementById('wizard-text-input')?.value.trim();
    if (!textVal) {
      alert('Preencha o campo para continuar.');
      return false;
    }
  }
  return true;
}

function addCollectedPrompt(prompt) {
  if (prompt && !wizardState.collectedPrompts.includes(prompt)) {
    wizardState.collectedPrompts.push(prompt);
    saveWizardProgress();
  }
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text);
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = 'Copiado!';
    btn.classList.add('bg-green-500');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('bg-green-500'); }, 2000);
  }
}

function copyWizardPrompt(btn) {
  const prompt = decodeURIComponent(btn.dataset.prompt);
  copyToClipboard(prompt, btn);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderGuideBox(guide, title) {
  if (!guide || (Array.isArray(guide) && guide.length === 0)) return '';
  const items = Array.isArray(guide) ? guide : [guide];
  return `
    <div class="wizard-guide-box rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2 mt-3">
      <div class="flex items-center gap-2">
        <span class="text-amber-400 text-sm">📋</span>
        <span class="text-xs font-bold text-amber-300 uppercase tracking-wider">${title || 'Passo a Passo · Onde Clicar'}</span>
      </div>
      <ol class="space-y-2 list-none pl-0">
        ${items.map((item, i) => `
          <li class="flex gap-2.5 text-xs text-gray-300 leading-relaxed">
            <span class="shrink-0 h-5 w-5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-[10px]">${i + 1}</span>
            <span>${item}</span>
          </li>
        `).join('')}
      </ol>
    </div>
  `;
}

function getOptionGuide(step, value) {
  if (!value || !step.options) return null;
  const opt = step.options.find(o => o.value === value);
  return opt?.guide || null;
}
