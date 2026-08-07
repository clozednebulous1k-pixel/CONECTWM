// conectWM Academy · APRENDER + · Fundamentos de programação

const APRENDER_CATEGORIES = {
  all: 'Todos',
  fundamentos: 'Fundamentos',
  linguagens: 'Linguagens',
  conceitos: 'Conceitos',
  saas: 'Seu SaaS',
};

const aprenderTopics = [
  {
    id: 'programar',
    category: 'fundamentos',
    icon: 'lightbulb',
    title: 'O que é programar?',
    tagline: 'Dar instruções claras para o computador resolver problemas.',
    blocks: [
      'Programar não é decorar código · é **decompor um problema** em passos que a máquina executa sem erro.',
      'Você escreve regras (código). O navegador ou servidor **interpreta** essas regras e produz resultado: tela, banco, e-mail, WhatsApp, pagamento.',
      'Com IA (Cursor, ChatGPT), você descreve o objetivo em português e a IA gera o código · mas **entender o básico** evita bugs, custos e projetos que não escalam.',
    ],
    analogy: 'Como uma receita de bolo: ingredientes (dados), ordem dos passos (lógica), forno (servidor). Se faltar um passo, o bolo falha.',
    whenUse: 'Antes de qualquer módulo · base mental para tudo na Academy.',
  },
  {
    id: 'stack',
    category: 'fundamentos',
    icon: 'layers',
    title: 'Como um app/SaaS funciona por dentro',
    tagline: 'Frontend · Backend · Banco · APIs · IA',
    blocks: [
      '**Frontend** · o que o usuário vê (HTML, CSS, JavaScript no navegador). Ex: dashboard, landing, botões.',
      '**Backend** · o cérebro no servidor (Node.js, Express). Valida login, salva dados, chama OpenAI, protege segredos.',
      '**Banco de dados** · memória permanente (Firebase Firestore, PostgreSQL/Supabase). Usuários, pedidos, certificados.',
      '**API** · pontes HTTP (rotas como `/api/chat`). Frontend pede · backend responde JSON.',
      '**IA** · serviço externo (OpenAI) chamado pelo backend · nunca exponha a chave no frontend.',
    ],
    analogy: 'Restaurante: salão (frontend), cozinha (backend), estoque (banco), garçom levando pedidos (API).',
    whenUse: 'Módulos 1 (SaaS), 7 (cobrança), 10 (WhatsApp+IA).',
  },
  {
    id: 'html',
    category: 'linguagens',
    icon: 'code-2',
    title: 'HTML · Estrutura da página',
    tagline: 'Esqueleto · títulos, botões, formulários, imagens.',
    blocks: [
      'HTML **não é linguagem de programação** · é markup (marcação). Diz *o que existe* na tela: `<h1>`, `<button>`, `<form>`.',
      'Cada tag tem significado semântico: `<header>`, `<main>`, `<section>` ajudam SEO e acessibilidade.',
      'Arquivos `.html` são a base de sites estáticos e SPAs. O conectWM usa HTML + Tailwind nas páginas `public/`.',
    ],
    analogy: 'Armazém vazio com prateleiras etiquetadas · ainda não tem pintura nem movimento.',
    whenUse: 'Landing, login, dashboard · todo módulo que mexe em interface.',
  },
  {
    id: 'css',
    category: 'linguagens',
    icon: 'palette',
    title: 'CSS · Visual e layout',
    tagline: 'Cores, fontes, espaçamento, responsivo, dark mode.',
    blocks: [
      'CSS controla **aparência**: cor de fundo, tamanho, grid, animações, mobile vs desktop.',
      '**Tailwind CSS** (usado aqui) são classes utilitárias (`bg-sky-400`, `rounded-xl`) em vez de escrever CSS puro em outro arquivo.',
      'Responsivo = `@media` ou classes `md:` / `sm:` · o layout se adapta ao celular.',
    ],
    analogy: 'Pintura, decoração e placa “proibido estacionar” no armazém HTML.',
    whenUse: 'Frontend, módulos de funil, anúncios, mídias sociais (criativos).',
  },
  {
    id: 'javascript',
    category: 'linguagens',
    icon: 'file-json',
    title: 'JavaScript (JS) · Lógica na web',
    tagline: 'A linguagem que faz o site “acordar”.',
    blocks: [
      'JS roda no **navegador** (cliques, fetch, validação) e no **servidor** via Node.js.',
      'Conceitos chave: `variável`, `função`, `if/else`, `loop`, `array`, `objeto`, `async/await`, `fetch`.',
      'No conectWM: `dashboard.js`, `chatbot.js`, wizards · tudo que reage ao usuário.',
      'Peça à IA: “Explique este trecho linha por linha como se eu fosse iniciante”.',
    ],
    analogy: 'Eletricista que liga interruptores, sensores e automações no prédio HTML.',
    whenUse: '100% dos módulos · principal linguagem da Academy.',
  },
  {
    id: 'typescript',
    category: 'linguagens',
    icon: 'shield',
    title: 'TypeScript · JavaScript com tipos',
    tagline: 'Menos bugs · autocomplete melhor no editor.',
    blocks: [
      'TypeScript = JS + **tipos** (`string`, `number`, `{ email: string }`). Erros aparecem antes de rodar.',
      'Muito usado em React, Next.js e projetos SaaS maiores. Compila para JavaScript.',
      'Se o Cursor gerar `.ts` / `.tsx`, você ainda está em JavaScript por baixo · só mais seguro.',
    ],
    analogy: 'Formulário com campos obrigatórios preenchidos · não deixa enviar dados errados.',
    whenUse: 'SaaS escalável, apps React/Next, integrações complexas.',
  },
  {
    id: 'nodejs',
    category: 'linguagens',
    icon: 'server',
    title: 'Node.js · Backend em JavaScript',
    tagline: 'Servidor, APIs, webhooks, integração com IA.',
    blocks: [
      'Node.js executa JS **fora do navegador** · no VPS, Railway, Vercel serverless.',
      '**Express** é o framework HTTP leve (`app.post`, `app.get`) · usado no `server.js` do conectWM.',
      'Aqui ficam: autenticação, rate limit, OpenAI, Firebase Admin, webhooks Hotmart.',
      'Regra de ouro: **segredos só no `.env` no servidor**, nunca no frontend.',
    ],
    analogy: 'Cozinha industrial · recebe pedidos da API e consulta o estoque (banco).',
    whenUse: 'Módulos 1, 7, 10 · qualquer SaaS com login e pagamento.',
  },
  {
    id: 'python',
    category: 'linguagens',
    icon: 'file-code',
    title: 'Python · Scripts, dados e IA',
    tagline: 'Automatizar tarefas, IA, análise · menos comum no frontend.',
    blocks: [
      'Python é excelente para **automação**, scraping, notebooks de IA, APIs com FastAPI/Flask.',
      'Muitos modelos e tutoriais de ML usam Python · mas sites/SaaS web costumam usar JS/TS no stack full-stack.',
      'Use quando: robô interno, planilha, integração de dados · ou quando a IA sugerir script `.py` pontual.',
    ],
    analogy: 'Ferramenta de oficina especializada · não substitui o restaurante inteiro, complementa.',
    whenUse: 'Automação avançada, data/IA · opcional na Academy.',
  },
  {
    id: 'sql',
    category: 'linguagens',
    icon: 'table-2',
    title: 'SQL · Banco relacional',
    tagline: 'Tabelas, linhas, consultas · PostgreSQL, MySQL.',
    blocks: [
      'SQL pergunta ao banco: `SELECT`, `INSERT`, `UPDATE`, `DELETE`. Dados em **tabelas** com relações (user → pedidos).',
      '**Supabase** expõe PostgreSQL na nuvem · ideal para SaaS com regras RLS (quem vê o quê).',
      'ORMs (**Prisma**) geram SQL por você a partir de modelos TypeScript.',
    ],
    analogy: 'Planilha Excel gigante com abas ligadas por ID · consultas são filtros poderosos.',
    whenUse: 'SaaS com assinaturas, relatórios, CRM · Módulo 1 e 5.',
  },
  {
    id: 'nosql',
    category: 'linguagens',
    icon: 'database',
    title: 'NoSQL · Firestore / documentos',
    tagline: 'Coleções JSON flexíveis · Firebase.',
    blocks: [
      'Em vez de tabelas rígidas, guarda **documentos** (objetos JSON) em coleções: `users`, `certificates`.',
      '**Firebase Firestore** · usado no conectWM para checkout, progresso, certificados.',
      'Escalável e rápido para MVPs · cuidado com leituras em excesso (custo e rate limit).',
    ],
    analogy: 'Pasta de arquivos JSON numerados · cada arquivo é um registro.',
    whenUse: 'Módulo 1 (Firebase grátis), certificados, auth.',
  },
  {
    id: 'json',
    category: 'linguagens',
    icon: 'braces',
    title: 'JSON · Formato de troca de dados',
    tagline: 'Como APIs conversam entre si.',
    blocks: [
      'JSON = texto estruturado `{ "nome": "Ana", "modulos": [1,2,3] }`. Padrão universal de APIs REST.',
      'No browser: `JSON.stringify()` ao enviar · `response.json()` ao receber.',
      'Webhooks (Hotmart, WhatsApp) enviam JSON · n8n manipula esses fluxos visualmente.',
    ],
    analogy: 'Envelope padronizado que qualquer sistema sabe abrir.',
    whenUse: 'Toda integração: chat, checkout, certificados, n8n.',
  },
  {
    id: 'terminal',
    category: 'linguagens',
    icon: 'terminal',
    title: 'Terminal · Bash / PowerShell / CMD',
    tagline: 'Comandos para rodar projeto, Git, deploy.',
    blocks: [
      'Comandos básicos: `cd`, `ls`/`dir`, `npm install`, `npm start`, `git status`, `git push`.',
      'O servidor **não tem botões** · deploy e logs passam pelo terminal ou painel (Vercel, Railway).',
      'No Windows use PowerShell · no Mac/Linux, Bash. A IA pode traduzir comandos para seu SO.',
    ],
    analogy: 'Painel de controle do prédio · luzes, elevador, alarmes por comandos textuais.',
    whenUse: 'Publicar SaaS, Docker, Evolution API, GitHub.',
  },
  {
    id: 'git',
    category: 'linguagens',
    icon: 'git-branch',
    title: 'Git & GitHub · Versionamento',
    tagline: 'Histórico, backup e deploy do código.',
    blocks: [
      'Git guarda **versões** do projeto. GitHub hospeda na nuvem e conecta com Vercel/Railway.',
      'Fluxo básico: `git add` → `git commit` → `git push`. Branches para features sem quebrar produção.',
      'Repositório conectWM: base para clonar e estudar estrutura real de SaaS.',
    ],
    analogy: 'Ctrl+Z infinito + cópia na nuvem compartilhada com o time.',
    whenUse: 'Todo projeto · Recursos & Prompts (repo conectWM).',
  },
  {
    id: 'variavel',
    category: 'conceitos',
    icon: 'box',
    title: 'Variável',
    tagline: 'Caixa com nome que guarda um valor.',
    blocks: [
      '`const email = "aluno@email.com"` · `let contador = 0` · o nome referencia o valor depois.',
      'Constantes (`const`) não devem ser reatribuídas · `let` pode mudar (contadores, estados).',
    ],
    analogy: 'Gaveta etiquetada “email do cliente”.',
    whenUse: 'Todo código JS/TS.',
  },
  {
    id: 'funcao',
    category: 'conceitos',
    icon: 'square-function',
    title: 'Função',
    tagline: 'Bloco reutilizável que faz uma tarefa.',
    blocks: [
      '`function login() { ... }` ou `const salvar = async () => { ... }` · evita repetir código.',
      'Funções recebem **parâmetros** e podem **retornar** resultado. APIs são funções no servidor.',
    ],
    analogy: 'Receita específica “montar hambúrguer” chamada sempre que precisar.',
    whenUse: 'Organizar dashboard, services, wizards.',
  },
  {
    id: 'api-rest',
    category: 'conceitos',
    icon: 'globe',
    title: 'API & REST',
    tagline: 'Contrato HTTP entre frontend e backend.',
    blocks: [
      '**GET** lê dados · **POST** cria/envia · **PUT/PATCH** atualiza · **DELETE** remove.',
      'URL + método + body JSON. Status: 200 OK, 400 erro cliente, 401 não auth, 429 rate limit, 500 erro servidor.',
      'Exemplos conectWM: `POST /api/chat`, `GET /api/certificates/progress`.',
    ],
    analogy: 'Cardápio fixo do restaurante · garçom só aceita pedidos do cardápio.',
    whenUse: 'Módulos 1, 7, 10 · integrações externas.',
  },
  {
    id: 'webhook',
    category: 'conceitos',
    icon: 'webhook',
    title: 'Webhook',
    tagline: 'O sistema externo avisa seu servidor quando algo acontece.',
    blocks: [
      'Hotmart avisa “pagamento aprovado” · WhatsApp avisa “nova mensagem” · seu `server.js` recebe POST.',
      'Diferente de polling (ficar perguntando a cada 5s) · webhook é **evento push** · mais eficiente.',
    ],
    analogy: 'Campainha da porta · alguém toca quando chega encomenda.',
    whenUse: 'Módulo 7 (Hotmart), 10 (WhatsApp Evolution).',
  },
  {
    id: 'deploy',
    category: 'saas',
    icon: 'rocket',
    title: 'Deploy & Hospedagem',
    tagline: 'Colocar o projeto na internet.',
    blocks: [
      '**Estático** (HTML/JS): Firebase Hosting, Vercel, Netlify · grátis no começo.',
      '**Backend Node**: Railway, Render, VPS + PM2, Vercel serverless.',
      'Fluxo: código no GitHub → plataforma faz build → URL pública · configure `.env` nos painéis.',
    ],
    analogy: 'Inaugurar a loja física depois de montar tudo no galpão.',
    whenUse: 'Módulo 1, 9 (escala), 10 (bot 24h).',
  },
  {
    id: 'ia-cursor',
    category: 'saas',
    icon: 'bot',
    title: 'IA + Cursor · Como usar sem se perder',
    tagline: 'Você dirige · a IA acelera.',
    blocks: [
      'Descreva **objetivo**, **stack** e **arquivo** afetado. Peça diff pequeno, não “refaça tudo”.',
      'Leia o código gerado · pergunte “o que esta linha faz?”. Aprenda padrões, não só copie.',
      'Use os **prompts dos wizards** da Academy · já vêm contextualizados por módulo.',
    ],
    analogy: 'Copiloto de avião · você ainda precisa entender o painel e a rota.',
    whenUse: 'Todos os módulos · Recursos & Prompts.',
  },
];

function renderAprenderIntro() {
  return `
    <div class="glass-card rounded-2xl p-6 md:p-8 border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-transparent to-sky-500/5 space-y-5">
      <div class="flex flex-col md:flex-row md:items-start gap-5">
        <div class="h-14 w-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
          <i data-lucide="graduation-cap" class="h-7 w-7"></i>
        </div>
        <div class="space-y-2 flex-1">
          <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded-full">APRENDER +</span>
          <h3 class="text-xl md:text-2xl font-bold font-outfit text-white">Fundamentos antes do código com IA</h3>
          <p class="text-sm text-gray-400 leading-relaxed max-w-3xl">
            Esta trilha explica <strong class="text-white">para que serve cada linguagem</strong>, como frontend, backend e banco conversam,
            e o que você está de fato construindo em cada módulo. Leia antes de codar · volte quando tiver dúvida.
          </p>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-[11px]">
        ${[
          { icon: 'layout', label: 'Frontend', sub: 'HTML CSS JS' },
          { icon: 'server', label: 'Backend', sub: 'Node Express' },
          { icon: 'database', label: 'Banco', sub: 'SQL NoSQL' },
          { icon: 'globe', label: 'API', sub: 'REST JSON' },
          { icon: 'bot', label: 'IA', sub: 'OpenAI Cursor' },
        ].map((s) => `
          <div class="rounded-xl bg-slate-950/80 border border-gray-800 p-3">
            <i data-lucide="${s.icon}" class="h-4 w-4 text-sky-400 mx-auto mb-1"></i>
            <p class="font-bold text-white">${s.label}</p>
            <p class="text-gray-500">${s.sub}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function formatBlocks(blocks) {
  return blocks.map((p) => {
    const html = p.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
    return `<p class="text-xs text-gray-400 leading-relaxed">${html}</p>`;
  }).join('');
}

function renderAprenderCard(topic) {
  return `
    <article class="aprender-card glass-card rounded-2xl border border-gray-800 hover:border-indigo-500/25 transition-all overflow-hidden" data-topic-id="${topic.id}">
      <button type="button" class="aprender-toggle w-full text-left p-5 space-y-3 focus:outline-none" aria-expanded="false">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
              <i data-lucide="${topic.icon}" class="h-5 w-5"></i>
            </div>
            <div>
              <h4 class="text-base font-bold font-outfit text-white">${topic.title}</h4>
              <p class="text-xs text-indigo-300/90 mt-0.5">${topic.tagline}</p>
            </div>
          </div>
          <i data-lucide="chevron-down" class="aprender-chevron h-5 w-5 text-gray-500 shrink-0 transition-transform"></i>
        </div>
        <span class="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-gray-800 text-gray-500">${APRENDER_CATEGORIES[topic.category]}</span>
      </button>
      <div class="aprender-detail hidden px-5 pb-5 space-y-3 border-t border-gray-800/80 pt-4">
        <div class="space-y-2">${formatBlocks(topic.blocks)}</div>
        <div class="rounded-xl bg-amber-500/5 border border-amber-500/15 p-3">
          <p class="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">Analogia</p>
          <p class="text-xs text-gray-400 leading-relaxed">${topic.analogy}</p>
        </div>
        <div class="rounded-xl bg-sky-500/5 border border-sky-500/15 p-3">
          <p class="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1">Quando usar na Academy</p>
          <p class="text-xs text-gray-400">${topic.whenUse}</p>
        </div>
        <button type="button" class="aprender-copy-prompt w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-gray-800 text-xs font-bold text-gray-300 hover:text-white transition-all" data-topic-id="${topic.id}">
          Copiar prompt para IA · “Me explique como iniciante”
        </button>
      </div>
    </article>
  `;
}

function buildExplainPrompt(topic) {
  return `Aja como professor paciente de programação para iniciantes absolutos.

Explique o tema "${topic.title}" em português do Brasil:
- ${topic.tagline}
- Use a analogia: ${topic.analogy}
- Contexto: estou na conectWM Academy construindo SaaS com IA
- Dê 1 exemplo prático de código simples
- Diga em quais módulos da Academy isso aparece: ${topic.whenUse}
- Máximo 8 parágrafos curtos, sem jargão desnecessário`;
}

function initAprenderPlus() {
  const intro = document.getElementById('aprender-intro');
  const grid = document.getElementById('aprender-topics-grid');
  const filterBar = document.getElementById('aprender-filter-bar');
  if (!grid) return;

  if (intro) intro.innerHTML = renderAprenderIntro();

  let activeFilter = 'all';

  function paint() {
    const filtered = activeFilter === 'all'
      ? aprenderTopics
      : aprenderTopics.filter((t) => t.category === activeFilter);
    grid.innerHTML = filtered.map(renderAprenderCard).join('');

    grid.querySelectorAll('.aprender-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.aprender-card');
        const detail = card?.querySelector('.aprender-detail');
        const chevron = card?.querySelector('.aprender-chevron');
        const open = detail?.classList.contains('hidden');
        grid.querySelectorAll('.aprender-detail').forEach((d) => d.classList.add('hidden'));
        grid.querySelectorAll('.aprender-chevron').forEach((c) => c.classList.remove('rotate-180'));
        grid.querySelectorAll('.aprender-toggle').forEach((b) => b.setAttribute('aria-expanded', 'false'));
        if (open && detail) {
          detail.classList.remove('hidden');
          chevron?.classList.add('rotate-180');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    grid.querySelectorAll('.aprender-copy-prompt').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const topic = aprenderTopics.find((t) => t.id === btn.dataset.topicId);
        if (!topic) return;
        navigator.clipboard.writeText(buildExplainPrompt(topic));
        const prev = btn.textContent;
        btn.textContent = 'Prompt copiado!';
        setTimeout(() => { btn.textContent = prev; }, 1500);
      });
    });

    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  if (filterBar) {
    filterBar.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        filterBar.querySelectorAll('[data-filter]').forEach((b) => {
          b.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-gray-400 border border-gray-800 transition-all';
        });
        if (activeFilter === 'all') {
          btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 text-white transition-all';
        } else {
          btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500/80 text-white transition-all';
        }
        paint();
      });
    });
  }

  paint();
}
