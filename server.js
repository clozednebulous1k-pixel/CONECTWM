require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');
const { initFirebase, getFirebaseStatus } = require('./services/firebase');
const checkoutService = require('./services/checkout');
const authService = require('./services/auth');
const hotmartService = require('./services/hotmart');
const certService = require('./services/certificates');
const leadsService = require('./services/leads');
const { limiters, validateChatPayload } = require('./services/rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

initFirebase();

// Bootstrap do perfil admin (clozednebulous1k@gmail.com + ADMIN_EMAILS)
authService.ensureAdminAccounts().catch((err) => {
  console.error('Falha ao preparar contas admin:', err.message);
});

app.use(cors());
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));
app.use(limiters.apiGeneral);

app.get('/api/system/status', (req, res) => {
  const firebase = getFirebaseStatus();
  res.json({
    success: true,
    firebase,
    hotmartSimulate: process.env.HOTMART_ALLOW_SIMULATE === 'true',
    appUrl: process.env.APP_URL || process.env.VERCEL_URL || null,
  });
});

app.use(express.static(path.join(__dirname, 'public')));

// Inicializar cliente OpenAI se a chave estiver configurada
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('🤖 OpenAI API configurada com sucesso.');
} else {
  console.log('⚠️ OpenAI API Key não configurada. O Chatbot usará o motor de fallback local.');
}

// ----------------------------------------------------
// 1. ENDPOINT: DIAGNÓSTICO EMPRESARIAL (WEBHOOK CRM)
// ----------------------------------------------------
app.post('/api/diagnostico', limiters.forms, async (req, res) => {
  try {
    const { name, email, whatsapp, companySize, challenge } = req.body;

    // Validação simples
    if (!name || !email || !whatsapp || !companySize || !challenge) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos do formulário de diagnóstico são obrigatórios.',
      });
    }

    console.log('\n--- Novo Diagnóstico de Automação Recebido ---');
    console.log(`👤 Nome: ${name}`);
    console.log(`📧 E-mail: ${email}`);
    console.log(`📞 WhatsApp: ${whatsapp}`);
    console.log(`🏢 Tamanho da Empresa: ${companySize}`);
    console.log(`🎯 Desafio Principal: ${challenge}`);
    console.log('--------------------------------------------\n');

    let savedLead = null;
    try {
      savedLead = await leadsService.createLead({
        name, email, whatsapp, companySize, challenge,
        origem: 'Landing Page · Diagnóstico',
      });
      console.log(`📋 Lead salvo no dashboard admin: ${savedLead.id}`);
    } catch (leadErr) {
      console.error('Erro ao salvar lead no Firestore/memória:', leadErr.message);
    }

    const webhookUrl = process.env.WEBHOOK_CRM_URL;
    let webhookStatus = savedLead ? 'salvo_dashboard' : 'simulado_com_sucesso';

    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        console.log(`Enviando payload para webhook real: ${webhookUrl}`);
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origem: 'Landing Page conectWM',
            data_envio: new Date().toISOString(),
            lead: { name, email, whatsapp, companySize, challenge }
          })
        });
        webhookStatus = 'enviado_real';
      } catch (err) {
        console.error('Erro ao enviar dados para webhook real:', err.message);
        webhookStatus = savedLead ? 'salvo_dashboard_webhook_erro' : 'erro_envio_real_fallback_local';
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Diagnóstico enviado com sucesso! Nossa equipe entrará em contato em até 24 horas no WhatsApp informado.',
      webhookStatus,
      leadId: savedLead?.id || null,
    });

  } catch (error) {
    console.error('Erro no endpoint de diagnóstico:', error);
    return res.status(500).json({
      success: false,
      message: 'Ocorreu um erro interno ao processar seu diagnóstico. Tente novamente mais tarde.',
    });
  }
});

// ----------------------------------------------------
// 2. ENDPOINTS: CHECKOUT + FIREBASE (COMPRA SIMULADA)
// ----------------------------------------------------
app.post('/api/checkout', limiters.checkout, async (req, res) => {
  try {
    const { email, type, affiliateRef } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'E-mail é necessário para iniciar o checkout.',
      });
    }

    const result = await checkoutService.createOrder({
      email,
      type: type || 'comunidade_mensal',
      affiliateRef,
    });

    console.log(`\n💳 Pedido criado: ${result.orderId} | ${email} | R$ ${result.plan.amount} | storage: ${result.storage}`);

    return res.status(200).json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      orderId: result.orderId,
      transactionId: result.transactionId,
      amount: result.plan.amount,
      pixCopyPaste: result.pixCopyPaste,
      storage: result.storage,
    });
  } catch (error) {
    console.error('Erro no endpoint de checkout:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao gerar sessão de checkout.',
    });
  }
});

app.get('/api/checkout/order/:orderId', async (req, res) => {
  try {
    const order = await checkoutService.getOrder(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar pedido.' });
  }
});

app.post('/api/checkout/confirm', async (req, res) => {
  try {
    const { orderId, paymentMethod, cardLast4 } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId é obrigatório.' });
    }

    const result = await checkoutService.confirmPayment({
      orderId,
      paymentMethod: paymentMethod || 'pix',
      cardLast4: cardLast4 || null,
    });

    let credentials = null;
    if (!result.alreadyPaid && result.subscription) {
      credentials = await authService.provisionUserAccess({
        email: result.order.email,
        orderId,
        planLabel: result.subscription.planLabel,
        expiresAt: result.subscription.expiresAt,
      });
      await authService.dispatchWelcomeEmail(credentials.welcomeEmail, credentials.password);
    } else if (result.alreadyPaid && result.order?.email) {
      const existing = await authService.getUserByEmail(result.order.email);
      if (!existing && result.subscription) {
        credentials = await authService.provisionUserAccess({
          email: result.order.email,
          orderId,
          planLabel: result.subscription.planLabel,
          expiresAt: result.subscription.expiresAt,
        });
        await authService.dispatchWelcomeEmail(credentials.welcomeEmail, credentials.password);
      } else {
        credentials = {
          email: result.order.email,
          password: null,
          welcomeEmail: {
            subject: 'Acesso já existente',
            body: 'Sua conta já foi criada. Use o e-mail e a senha enviados na compra anterior.',
            loginUrl: `/login.html?email=${encodeURIComponent(result.order.email)}`,
          },
          existingAccount: true,
        };
      }
    }

    console.log(`\n✅ Pagamento confirmado: ${orderId} | ${result.order.email} | ${paymentMethod || 'pix'} | storage: ${result.storage}`);

    return res.status(200).json({
      success: true,
      message: 'Pagamento aprovado! Assinatura ativada.',
      order: result.order,
      subscription: result.subscription,
      alreadyPaid: result.alreadyPaid,
      storage: result.storage,
      credentials,
    });
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao confirmar pagamento.',
    });
  }
});

app.get('/api/subscription/status', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Informe o e-mail.' });
    }

    const subscription = await checkoutService.getSubscription(email);

    return res.json({
      success: true,
      active: subscription?.active || false,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    res.status(500).json({ success: false, message: 'Erro ao verificar assinatura.' });
  }
});

// ----------------------------------------------------
// 3. AUTENTICAÇÃO — LOGIN APÓS COMPRA
// ----------------------------------------------------
app.get('/api/auth/first-access', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Informe o e-mail.' });
    }

    const status = await authService.getFirstAccessStatus(email);
    return res.json({ success: true, ...status });
  } catch (error) {
    console.error('Erro ao verificar primeiro acesso:', error);
    res.status(500).json({ success: false, message: 'Erro ao verificar primeiro acesso.' });
  }
});

app.post('/api/auth/set-password', limiters.authPassword, async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body;
    if (!email || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'E-mail, senha e confirmação de senha são obrigatórios.',
      });
    }

    const result = await authService.setInitialPassword({ email, password, passwordConfirm });
    if (!result.success) {
      return res.status(400).json(result);
    }

    const isAdmin = authService.isAdminEmail(result.email);
    let subscription = await checkoutService.getSubscription(result.email);
    if (isAdmin) {
      subscription = await checkoutService.ensureAdminSubscription(result.email);
    }

    if (!subscription?.active && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Assinatura inativa ou expirada. Renove seu plano para acessar.',
      });
    }

    return res.json({
      success: true,
      message: result.message,
      token: result.token,
      email: result.email,
      expiresAt: result.expiresAt,
      role: isAdmin ? 'admin' : 'student',
      subscription,
    });
  } catch (error) {
    console.error('Erro ao criar senha:', error);
    res.status(500).json({ success: false, message: 'Erro interno ao criar senha.' });
  }
});

app.post('/api/auth/login', limiters.authLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
    }

    const loginResult = await authService.loginUser({ email, password });
    if (!loginResult.success) {
      return res.status(401).json(loginResult);
    }

    const isAdmin = authService.isAdminEmail(loginResult.email);
    let subscription = await checkoutService.getSubscription(loginResult.email);
    if (isAdmin) {
      subscription = await checkoutService.ensureAdminSubscription(loginResult.email);
    }

    if (!subscription?.active && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Assinatura inativa ou expirada. Renove seu plano para acessar.',
      });
    }

    return res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token: loginResult.token,
      email: loginResult.email,
      expiresAt: loginResult.expiresAt,
      role: isAdmin ? 'admin' : 'student',
      subscription,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ success: false, message: 'Erro interno ao fazer login.' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
    const session = await authService.validateSession(token);
    if (!session) {
      return res.status(401).json({ success: false, message: 'Sessão inválida ou expirada.' });
    }

    const user = await authService.getUserByEmail(session.email);
    const role = authService.getUserRole(user, session.email);
    let subscription = await checkoutService.getSubscription(session.email);
    if (role === 'admin') {
      subscription = await checkoutService.ensureAdminSubscription(session.email);
    }

    return res.json({
      success: true,
      email: session.email,
      role,
      subscription,
      active: role === 'admin' || subscription?.active || false,
    });
  } catch (error) {
    console.error('Erro ao validar sessão:', error);
    res.status(500).json({ success: false, message: 'Erro ao validar sessão.' });
  }
});

async function requireAuth(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  const session = await authService.validateSession(token);
  if (!session) {
    res.status(401).json({ success: false, message: 'Sessão inválida ou expirada.' });
    return null;
  }
  return session;
}

async function requireAdmin(req, res) {
  const session = await requireAuth(req, res);
  if (!session) return null;

  const user = await authService.getUserByEmail(session.email);
  const role = authService.getUserRole(user, session.email);
  if (role !== 'admin') {
    res.status(403).json({ success: false, message: 'Acesso restrito ao administrador.' });
    return null;
  }
  return { ...session, role, user };
}

// ----------------------------------------------------
// 3a. ADMIN · RELATÓRIOS DE LEADS (DIAGNÓSTICO)
// ----------------------------------------------------
app.get('/api/admin/leads', async (req, res) => {
  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const [leads, stats] = await Promise.all([
      leadsService.listLeads({ limit: Number(req.query.limit) || 100 }),
      leadsService.getLeadStats(),
    ]);

    return res.json({ success: true, leads, stats });
  } catch (error) {
    console.error('Erro ao listar leads admin:', error);
    res.status(500).json({ success: false, message: 'Erro ao carregar relatórios.' });
  }
});

app.patch('/api/admin/leads/:id', async (req, res) => {
  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const status = req.body?.status;
    const lead = await leadsService.updateLeadStatus(req.params.id, status);
    return res.json({ success: true, lead });
  } catch (error) {
    const status = error.statusCode || 500;
    console.error('Erro ao atualizar lead:', error.message);
    res.status(status).json({ success: false, message: error.message || 'Erro ao atualizar lead.' });
  }
});

// ----------------------------------------------------
// 3b. CERTIFICADOS ACADEMY
// ----------------------------------------------------
app.get('/api/certificates/catalog', (req, res) => {
  res.json({ success: true, modules: certService.getCatalog(), totalModules: certService.TOTAL_MODULES });
});

app.get('/api/certificates/progress', async (req, res) => {
  try {
    const session = await requireAuth(req, res);
    if (!session) return;
    const progress = await certService.getProgress(session.email);
    const certificates = await certService.listCertificates(session.email);
    res.json({ success: true, progress, certificates });
  } catch (error) {
    console.error('Erro progresso certificados:', error);
    res.status(500).json({ success: false, message: 'Erro ao carregar progresso.' });
  }
});

app.post('/api/certificates/progress', limiters.certificatesWrite, async (req, res) => {
  try {
    const session = await requireAuth(req, res);
    if (!session) return;
    const progress = await certService.syncProgress(session.email, req.body || {});
    res.json({ success: true, progress });
  } catch (error) {
    console.error('Erro sync progresso:', error);
    res.status(500).json({ success: false, message: 'Erro ao sincronizar progresso.' });
  }
});

app.post('/api/certificates/issue', limiters.certificatesIssue, async (req, res) => {
  try {
    const session = await requireAuth(req, res);
    if (!session) return;
    const { type, moduleId } = req.body || {};
    const result = await certService.issueCertificate(session.email, { type, moduleId });
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    console.error('Erro emitir certificado:', error);
    res.status(500).json({ success: false, message: 'Erro ao emitir certificado.' });
  }
});

app.get('/api/certificates/verify/:code', limiters.certificatesVerify, async (req, res) => {
  try {
    const cert = await certService.verifyCertificate(req.params.code);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificado não encontrado.' });
    }
    res.json({
      success: true,
      valid: true,
      certificate: {
        code: cert.code,
        holderName: cert.holderName,
        title: cert.title,
        subtitle: cert.subtitle,
        workload: cert.workload,
        type: cert.type,
        moduleId: cert.moduleId || null,
        issuedAt: cert.issuedAt,
      },
    });
  } catch (error) {
    console.error('Erro verificar certificado:', error);
    res.status(500).json({ success: false, message: 'Erro ao verificar certificado.' });
  }
});

// ----------------------------------------------------
// 4. WEBHOOK HOTMART · LIBERA LOGIN APÓS COMPRA REAL
// ----------------------------------------------------
app.post('/api/webhooks/hotmart', async (req, res) => {
  try {
    const result = await hotmartService.handleHotmartWebhook(req.body, req.headers);
    console.log(`✅ Hotmart processado: ${result.action} | ${result.email || 'n/a'}`);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Erro webhook Hotmart:', error.message);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: error.message });
  }
});

/** Simula compra Hotmart (dev) — POST { "email": "..." } */
app.post('/api/webhooks/hotmart/simulate', async (req, res) => {
  try {
    const allowSim = process.env.HOTMART_ALLOW_SIMULATE === 'true' || process.env.NODE_ENV !== 'production';
    if (!allowSim) {
      return res.status(403).json({ success: false, message: 'Simulação desabilitada em produção.' });
    }

    const email = req.body?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Informe { "email": "..." }.' });
    }

    const result = await hotmartService.simulateHotmartPurchase(email);
    return res.status(200).json({
      success: true,
      message: 'Compra Hotmart simulada. Verifique login gerado.',
      ...result,
    });
  } catch (error) {
    console.error('Erro simulação Hotmart:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// 5. ENDPOINT: CHATBOT DE IA (CONECTWM ASSISTANT)
// ----------------------------------------------------
// Contexto institucional da conectWM que orienta a IA
const SYSTEM_PROMPT = `
Você é o assistente inteligente da conectWM. Seu objetivo é ajudar os visitantes a entenderem os serviços da empresa e as vantagens da comunidade.
Seja sempre amigável, tecnológico, profissional e focado em conversão. Escreva respostas concisas, de no máximo 3 parágrafos curtos.

Informações sobre a conectWM:
1. O que é a conectWM?
   É um ecossistema que atua em duas frentes: capacitação de pessoas para criarem softwares/SaaS usando IA (Comunidade conectWM) e automação inteligente de processos para empresas (Diagnóstico e Consultoria).
2. Comunidade conectWM (Alunos/Criadores):
   - O que ensina: Desenvolvimento Full-Stack auxiliado por IA (Prompt Engineering, Cursor, Copilot, No-Code/Low-Code), criação de Sites, Web Apps, MicroSaaS, estratégias de monetização, validação de ideias, tráfego pago/orgânico, kits e templates prontos.
   - Suporte: Acesso a grupo exclusivo de networking no WhatsApp e canal de suporte contínuo para dúvidas de código e arquitetura.
   - Preço simulado: R$ 47/mês ou R$ 497 anual (o usuário pode clicar em "Entrar na Comunidade" para ver o simulador de checkout).
3. Diagnóstico de Automação (Empresas/Empresários):
   - O que fazemos: Analisamos processos manuais repetitivos das empresas e implementamos automações completas, como agentes inteligentes de atendimento 24/7 (WhatsApp, site), integração de sistemas (CRMs, planilhas, ERPs) e automação de funis de vendas.
   - Diagnóstico Gratuito: O empresário preenche o formulário na página de diagnóstico e nossa equipe analisa os gargalos de graça, desenhando uma solução sob medida.
4. Programação:
   - Não é necessário saber programar para começar na comunidade! Ensinamos como domar as IAs para gerarem o código de forma simples e rápida, mesmo do zero absolute.

Instruções importantes:
- Sempre incentive o usuário a:
  * Escolher o caminho de Aluno/Criador clicando em "Quero Entrar na Comunidade" ou interagindo no card 1.
  * Escolher o caminho de Empresa preenchendo o formulário de "Diagnóstico Gratuito" no site.
- Se o usuário perguntar algo fora do contexto da conectWM ou de tecnologia/IA/automação, responda educadamente puxando o assunto de volta para como a conectWM pode ajudá-lo na criação de software ou automação de processos.
`;

app.post('/api/chat', limiters.chat, validateChatPayload, async (req, res) => {
  try {
    const { messages } = req.body;

    const lastUserMessage = messages[messages.length - 1].content;
    console.log(`\n💬 Mensagem recebida no chat: "${lastUserMessage}"`);

    // --- Caso 1: OpenAI Configurada ---
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 400
        });

        const reply = response.choices[0].message.content;
        console.log(`🤖 Resposta OpenAI: "${reply.substring(0, 60)}..."`);
        return res.status(200).json({
          success: true,
          reply: reply
        });
      } catch (err) {
        console.error('Falha ao chamar OpenAI API, utilizando fallback local:', err.message);
      }
    }

    // --- Caso 2: Fallback Local Inteligente (Sem chave OpenAI ou se houver falha) ---
    const reply = getFallbackResponse(lastUserMessage);
    console.log(`🤖 Resposta Fallback: "${reply.substring(0, 60)}..."`);
    return res.status(200).json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error('Erro no endpoint de chat:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao processar a mensagem no chatbot.',
    });
  }
});

// Mecanismo simples de correspondência de intenções para o bot de fallback
function getFallbackResponse(message) {
  const text = message.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remover acentos

  if (text.includes('comunidade') || text.includes('aluno') || text.includes('aprender') || text.includes('curso') || text.includes('escola') || text.includes('ensina') || text.includes('conteudo')) {
    return `Na **Comunidade conectWM**, você aprende a criar sites, aplicativos e SaaS (softwares como serviço) usando Inteligência Artificial como sua copiloto. 

O conteúdo inclui:
• Desenvolvimento Full-Stack auxiliado por IA (Copilot, Cursor, prompts).
• Criação de sites, Web Apps e Microsaas de alta qualidade.
• Monetização, marketing digital, tráfego pago e validação de ideias.
• Kits e templates prontos para você acelerar seus projetos.
• Grupo exclusivo de WhatsApp para suporte e networking.

Deseja começar a criar seus próprios projetos? Clique no botão **"Quero Entrar na Comunidade"** na barra de navegação ou no Card 1 para simular sua entrada!`;
  }

  if (text.includes('empresa') || text.includes('negocio') || text.includes('automacao') || text.includes('diagnostico') || text.includes('processo') || text.includes('atendimento') || text.includes('crm')) {
    return `Para empresas, a **conectWM** desenvolve projetos de automação de processos inteligentes e agentes de IA personalizados. 

Nós ajudamos a estruturar:
• Agentes inteligentes de atendimento 24 horas via WhatsApp e web.
• Integrações complexas entre CRMs (Pipedrive, Hubspot), planilhas, ERPs e e-mails.
• Automação de qualificação de leads e tarefas administrativas.

Para descobrirmos os maiores gargalos do seu negócio, recomendo preencher o formulário na seção **"Diagnóstico para Empresas"** aqui mesmo na página. O diagnóstico inicial é **100% gratuito**!`;
  }

  if (text.includes('programar') || text.includes('codigo') || text.includes('programacao') || text.includes('dificil') || text.includes('saber programar') || text.includes('iniciante') || text.includes('zero')) {
    return `Absolutamente **não precisa saber programar** para começar! 

Hoje em dia, com o auxílio de Inteligências Artificiais modernas (como ChatGPT, Claude, Cursor e Copilot) e ferramentas Low-Code/No-Code, qualquer pessoa consegue traduzir suas ideias em código funcional. 

Na comunidade, nós ensinamos o passo a passo de como "conversar" com a IA (Engenharia de Prompt) para que ela escreva a lógica do código, crie o banco de dados e resolva bugs para você. Você atua como o arquiteto/diretor do projeto!`;
  }

  if (text.includes('preco') || text.includes('valor') || text.includes('custo') || text.includes('pagamento') || text.includes('gratuito') || text.includes('gratis')) {
    return `Temos dois caminhos principais:
1. **Comunidade conectWM:** É uma assinatura de apenas R$ 47 por mês no plano mensal (ou R$ 497 anual). Oferece acesso completo a todos os módulos, kits de ferramentas, comunidade de WhatsApp e suporte técnico.
2. **Diagnóstico para Empresas:** Este serviço inicial de análise de gargalos e desenho de solução de automação é **100% gratuito**. 

Para se inscrever na comunidade ou solicitar o diagnóstico empresarial, utilize os botões e formulários disponíveis no corpo da nossa landing page!`;
  }

  if (text.includes('suporte') || text.includes('duvida') || text.includes('ajuda') || text.includes('whatsapp') || text.includes('grupo')) {
    return `O suporte na **conectWM** é diferenciado! Nós oferecemos:
• Canal de suporte direto para dúvidas técnicas sobre seus códigos e integrações na plataforma.
• Grupo exclusivo de networking no **WhatsApp**, onde você pode interagir com outros desenvolvedores, empresários e especialistas da conectWM.
• Respostas rápidas e acompanhamento personalizado para que você nunca fique travado no seu projeto.`;
  }

  if (text.includes('ola') || text.includes('oi') || text.includes('bom dia') || text.includes('boa tarde') || text.includes('boa noite') || text.includes('saudacao')) {
    return `Olá! Seja muito bem-vindo à **conectWM**. 🤖✨

Sou o assistente inteligente da plataforma. Como posso te ajudar hoje?
• Se você quer aprender a criar apps e SaaS com IA, me pergunte sobre a **Comunidade**.
• Se você tem uma empresa e quer automatizar tarefas repetitivas, pergunte sobre as nossas **Automações e Diagnóstico**.`;
  }

  // Resposta padrão caso não case com nenhuma intenção específica
  return `Fico feliz em te ajudar! Como assistente da **conectWM**, estou pronto para te dar detalhes sobre duas frentes:
1. **Comunidade conectWM:** Como pessoas comuns criam sites, apps e SaaS usando Inteligência Artificial do absoluto zero.
2. **Automações de Processos:** Como empresas economizam tempo e dinheiro automatizando tarefas manuais e integrando sistemas.

Qual das frentes é a ideal para você no momento? Sinta-se à vontade para perguntar o que quiser, ou use os formulários e botões na página para interagir direto!`;
}

// Rotas limpas para servir as páginas principais
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/checkout-simulado', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout-simulado.html'));
});

// Rota de fallback para servir o index.html em qualquer rota desconhecida
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicializar Servidor (local) ou exportar para Vercel
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor conectWM rodando na porta ${PORT}`);
    console.log(`🔗 Acesse localmente em: http://localhost:${PORT}`);
  });
}
