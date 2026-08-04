// conectWM Academy — Recursos Frontend & Backend

const frontendResources = [
  {
    name: '21st.dev',
    url: 'https://21st.dev/',
    icon: 'sparkles',
    category: 'design',
    desc: 'Milhares de componentes React + Tailwind prontos. Copie prompt para Cursor/v0 e instale com shadcn CLI — ideal para elevar o visual do SaaS.'
  },
  {
    name: 'shadcn/ui',
    url: 'https://ui.shadcn.com/',
    icon: 'blocks',
    category: 'design',
    desc: 'Biblioteca de componentes acessíveis e customizáveis. Base usada por 21st.dev — copia o código para o seu projeto, não é dependência bloqueada.'
  },
  {
    name: 'Labcodes — Confetti DS',
    url: 'https://confetti.labcodes.com.br/',
    icon: 'palette',
    category: 'design',
    desc: 'Design system open-source brasileiro (Labcodes). Componentes Figma + React no Storybook — referência de UI profissional e consistente.'
  },
  {
    name: 'Labcodes Studio',
    url: 'https://labcodes.com.br/',
    icon: 'building-2',
    category: 'design',
    desc: 'Estúdio full-stack BR com foco em Product Design e UX. Inspire-se em cases reais de produtos digitais bem construídos.'
  },
  {
    name: 'Aceternity UI',
    url: 'https://ui.aceternity.com/',
    icon: 'wand-2',
    category: 'design',
    desc: 'Componentes com animações e efeitos modernos (hero sections, cards 3D, backgrounds). Perfeito para landing pages premium.'
  },
  {
    name: 'Magic UI',
    url: 'https://magicui.design/',
    icon: 'stars',
    category: 'design',
    desc: 'Biblioteca de componentes animados para React/Next.js. Marquee, bento grid, shimmer buttons — visual de startup 2025.'
  },
  {
    name: 'v0 by Vercel',
    url: 'https://v0.dev/',
    icon: 'bot',
    category: 'design',
    desc: 'Gere interfaces completas com IA a partir de texto. Exporte código React + Tailwind e cole no Cursor para refinar.'
  },
  {
    name: 'Dribbble',
    url: 'https://dribbble.com/',
    icon: 'image',
    category: 'design',
    desc: 'Inspiração visual de dashboards, landing pages e apps. Busque "SaaS dashboard dark" ou "fintech UI" para referências.'
  },
  {
    name: 'Mobbin',
    url: 'https://mobbin.com/',
    icon: 'smartphone',
    category: 'design',
    desc: 'Screens reais de apps populares (onboarding, checkout, settings). Copie padrões de UX que já funcionam no mercado.'
  },
  {
    name: 'Figma',
    url: 'https://www.figma.com/',
    icon: 'layers',
    category: 'design',
    desc: 'Prototipe layouts antes de codar. Use Community Files gratuitos de dashboards e design systems.'
  },
  {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com/',
    icon: 'wind',
    category: 'logic',
    desc: 'Framework CSS utility-first usado neste projeto. Docs oficiais para spacing, cores, responsivo e dark mode.'
  },
  {
    name: 'Lucide Icons',
    url: 'https://lucide.dev/',
    icon: 'smile',
    category: 'logic',
    desc: 'Ícones SVG leves (mesmos do dashboard conectWM). Substitua emojis por ícones consistentes em todo o SaaS.'
  },
  {
    name: 'Coolors',
    url: 'https://coolors.co/',
    icon: 'droplets',
    category: 'design',
    desc: 'Gerador de paletas de cores harmoniosas. Defina primary, accent e background do seu produto em segundos.'
  },
  {
    name: 'Fontshare',
    url: 'https://www.fontshare.com/',
    icon: 'type',
    category: 'design',
    desc: 'Fontes gratuitas de alta qualidade (ex: Satoshi, Clash Display). Diferencia tipografia do SaaS sem pagar licença.'
  },
  {
    name: 'Relume',
    url: 'https://www.relume.io/',
    icon: 'layout-template',
    category: 'design',
    desc: 'Biblioteca de wireframes e sitemap para sites/SaaS. Acelera estrutura de páginas antes do visual final.'
  },
  {
    name: 'Can I Use',
    url: 'https://caniuse.com/',
    icon: 'globe',
    category: 'logic',
    desc: 'Verifique compatibilidade de CSS/JS nos browsers. Evite usar recurso que quebra no Safari ou mobile antigo.'
  },
  {
    name: 'Web.dev',
    url: 'https://web.dev/',
    icon: 'gauge',
    category: 'logic',
    desc: 'Guia Google de performance, acessibilidade e SEO. Use Lighthouse para medir e melhorar velocidade do frontend.'
  }
];

const backendResources = [
  {
    name: 'Node.js Docs',
    url: 'https://nodejs.org/docs/',
    icon: 'server',
    category: 'logic',
    desc: 'Documentação oficial do runtime usado no conectWM. Event loop, streams, fs, crypto — base sólida do backend.'
  },
  {
    name: 'Express.js',
    url: 'https://expressjs.com/',
    icon: 'route',
    category: 'logic',
    desc: 'Framework HTTP minimalista (server.js deste projeto). Rotas, middleware, JSON API e static files.'
  },
  {
    name: 'Supabase',
    url: 'https://supabase.com/',
    icon: 'database',
    category: 'logic',
    desc: 'PostgreSQL + Auth + Storage + Realtime na nuvem. Tier free generoso — substitui backend custom em MVPs.'
  },
  {
    name: 'Firebase',
    url: 'https://firebase.google.com/',
    icon: 'flame',
    category: 'logic',
    desc: 'Auth, Firestore, Hosting e Functions 100% grátis no começo. Ideal para SaaS rápido sem gerenciar servidor.'
  },
  {
    name: 'Prisma',
    url: 'https://www.prisma.io/',
    icon: 'table-2',
    category: 'logic',
    desc: 'ORM moderno para Node.js + PostgreSQL/MySQL. Schema tipado, migrations e queries seguras contra SQL injection.'
  },
  {
    name: 'Postman',
    url: 'https://www.postman.com/',
    icon: 'send',
    category: 'logic',
    desc: 'Teste APIs REST sem frontend. Salve collections de endpoints, variáveis de ambiente e automatize testes.'
  },
  {
    name: 'Swagger / OpenAPI',
    url: 'https://swagger.io/',
    icon: 'file-json',
    category: 'logic',
    desc: 'Documente endpoints da API com padrão OpenAPI. Gera docs interativas para o time e para integrações.'
  },
  {
    name: 'n8n',
    url: 'https://n8n.io/',
    icon: 'workflow',
    category: 'logic',
    desc: 'Automação visual (webhooks, WhatsApp, e-mail, planilhas). Conecte checkout → CRM → notificação sem código pesado.'
  },
  {
    name: 'Railway',
    url: 'https://railway.app/',
    icon: 'train-front',
    category: 'logic',
    desc: 'Deploy de Node.js + PostgreSQL com poucos cliques. Alternativa simples a VPS para colocar SaaS no ar.'
  },
  {
    name: 'Render',
    url: 'https://render.com/',
    icon: 'cloud',
    category: 'logic',
    desc: 'Hospedagem gratuita para APIs Node e sites estáticos. SSL automático e deploy via GitHub.'
  },
  {
    name: 'dbdiagram.io',
    url: 'https://dbdiagram.io/',
    icon: 'git-branch',
    category: 'logic',
    desc: 'Modele banco de dados visualmente (ERD). Exporte SQL para PostgreSQL antes de implementar no Prisma/Supabase.'
  },
  {
    name: 'DrawSQL',
    url: 'https://drawsql.app/',
    icon: 'pen-tool',
    category: 'logic',
    desc: 'Diagramas de banco compartilháveis. Planeje tabelas users, subscriptions, orders antes de codar migrations.'
  },
  {
    name: 'Redis',
    url: 'https://redis.io/',
    icon: 'zap',
    category: 'logic',
    desc: 'Cache em memória para sessões, rate limiting e filas. Reduz carga no banco e acelera APIs frequentes.'
  },
  {
    name: 'Regex101',
    url: 'https://regex101.com/',
    icon: 'code-xml',
    category: 'logic',
    desc: 'Teste e debug expressões regulares (validação de e-mail, CPF, slug). Essencial para sanitizar inputs no backend.'
  },
  {
    name: 'JWT.io',
    url: 'https://jwt.io/',
    icon: 'key',
    category: 'logic',
    desc: 'Decodifique e valide tokens JWT. Entenda payload de autenticação ao implementar login e refresh tokens.'
  },
  {
    name: 'Stripe Docs',
    url: 'https://docs.stripe.com/',
    icon: 'credit-card',
    category: 'logic',
    desc: 'Pagamentos, assinaturas e webhooks. Referência para integrar checkout recorrente no SaaS com segurança PCI.'
  },
  {
    name: 'Roadmap.sh — Backend',
    url: 'https://roadmap.sh/backend',
    icon: 'map',
    category: 'logic',
    desc: 'Mapa visual do que estudar em backend (APIs, DB, cache, segurança, deploy). Organize sua evolução técnica.'
  }
];

const categoryLabels = {
  design: 'Design & UI',
  logic: 'Lógica & Código'
};

function renderResourceCard(item, section) {
  const cat = item.category || 'logic';
  const isDesign = cat === 'design';
  const badgeClass = isDesign
    ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
    : 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  const iconWrap = section === 'frontend'
    ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
    : 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  const hoverBorder = section === 'frontend'
    ? 'hover:border-violet-500/30'
    : 'hover:border-sky-500/30';
  const linkHover = section === 'frontend'
    ? 'hover:border-violet-500/30'
    : 'hover:border-sky-500/30';

  return `
    <div class="glass-card rounded-2xl p-5 border border-gray-800 ${hoverBorder} transition-all flex flex-col justify-between group">
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="h-10 w-10 rounded-lg flex items-center justify-center border shrink-0 ${iconWrap}">
            <i data-lucide="${item.icon}" class="h-5 w-5"></i>
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${badgeClass}">${categoryLabels[cat]}</span>
        </div>
        <h5 class="text-base font-bold font-outfit text-white">${item.name}</h5>
        <p class="text-xs text-gray-400 leading-relaxed">${item.desc}</p>
      </div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-gray-800 ${linkHover} text-xs font-bold transition-all">
        <span>Acessar Site</span>
        <i data-lucide="external-link" class="h-3.5 w-3.5"></i>
      </a>
    </div>
  `;
}

function renderDevResourcesGrid(containerId, items, filterId, section) {
  const container = document.getElementById(containerId);
  const filterBar = document.getElementById(filterId);
  if (!container) return;

  let activeFilter = 'all';
  const isFrontend = section === 'frontend';

  function paint() {
    const filtered = activeFilter === 'all'
      ? items
      : items.filter(i => i.category === activeFilter);

    container.innerHTML = filtered.map(i => renderResourceCard(i, section)).join('');

    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  if (filterBar) {
    filterBar.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        filterBar.querySelectorAll('[data-filter]').forEach(b => {
          b.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-gray-400 border border-gray-800 transition-all';
        });
        if (activeFilter === 'all') {
          btn.className = `px-4 py-2 rounded-xl text-xs font-bold transition-all ${isFrontend ? 'bg-violet-500 text-white' : 'bg-sky-400 text-slate-950'}`;
        } else if (activeFilter === 'design') {
          btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-violet-500 text-white transition-all';
        } else {
          btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-sky-400 text-slate-950 transition-all';
        }
        paint();
      });
    });
  }

  paint();
}

function initDevResources() {
  renderDevResourcesGrid('frontend-resources-grid', frontendResources, 'frontend-filter-bar', 'frontend');
  renderDevResourcesGrid('backend-resources-grid', backendResources, 'backend-filter-bar', 'backend');
}
