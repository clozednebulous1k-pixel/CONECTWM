// conectWM Academy - Chatbot Widget Script
// Responsável por injetar e controlar o assistente virtual em todas as páginas

document.addEventListener('DOMContentLoaded', () => {
  injectChatbotMarkup();
  initChatbot();
});

// 1. INJEÇÃO DO HTML DO CHATBOT COM O LOGO OFICIAL
function injectChatbotMarkup() {
  if (document.getElementById('chatbot-toggle')) return;

  const chatMarkup = `
    <!-- Botão Flutuante -->
    <button id="chatbot-toggle" class="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-sky-400 hover:bg-sky-300 text-slate-950 flex items-center justify-center shadow-lg transition-all hover:scale-110 btn-glow-tech" aria-label="Abrir Assistente de IA">
      <img src="images/logo.png" alt="conectWM Logo" class="h-8 w-auto object-contain">
    </button>

    <!-- Janela de Chat -->
    <div id="chatbot-window" class="hidden fixed bottom-24 right-6 z-50 w-[90%] sm:w-[380px] h-[500px] glass-card rounded-[2rem] flex flex-col overflow-hidden chat-window-glow border border-sky-500/20">
      
      <!-- Chat Header -->
      <div class="bg-slate-950 p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 p-1.5 overflow-hidden">
              <img src="images/logo.png" alt="conectWM Logo" class="h-full w-auto object-contain">
            </div>
            <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-slate-950"></span>
          </div>
          <div>
            <h4 class="font-bold text-sm text-white font-outfit leading-none">conectWM Assistente</h4>
            <span class="text-xs text-gray-500 font-medium">Agente inteligente online</span>
          </div>
        </div>
        <button id="chatbot-close" class="text-gray-400 hover:text-white p-1">
          <i data-lucide="x" class="h-5 w-5"></i>
        </button>
      </div>

      <!-- Chat Messages -->
      <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0d14]">
        <!-- Mensagens inseridas via JS -->
      </div>

      <!-- Indicador de Digitou/Pensando -->
      <div id="chat-typing" class="hidden px-4 py-2 text-xs text-gray-500 flex items-center gap-2 bg-[#0a0d14]">
        <div class="loader-spinner !w-3.5 !h-3.5 !border-[2px]"></div>
        <span>Assistente está pensando...</span>
      </div>

      <!-- Chat Input Form -->
      <div class="p-3 bg-slate-950 border-t border-gray-800 flex gap-2">
        <input type="text" id="chat-input" maxlength="800" class="flex-1 bg-slate-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 input-focus-glow transition-all" placeholder="Escreva sua dúvida... (máx. 800 caracteres)">
        <button id="chat-send-btn" class="h-10 w-10 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 flex items-center justify-center transition-all">
          <i data-lucide="send-horizontal" class="h-4.5 w-4.5"></i>
        </button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  container.innerHTML = chatMarkup;
  document.body.appendChild(container);

  // Recriar ícones do Lucide para o botão de fechar e enviar
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// 2. INICIALIZAÇÃO E LÓGICA DO CHATBOT
function initChatbot() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatTypingIndicator = document.getElementById('chat-typing');

  let chatHistory = [];
  let isChatbotOpened = false;
  let lastSendAt = 0;
  const CHAT_MIN_INTERVAL_MS = 2500;
  const CHAT_MAX_HISTORY = 10;

  function trimChatHistory() {
    if (chatHistory.length > CHAT_MAX_HISTORY) {
      chatHistory = chatHistory.slice(-CHAT_MAX_HISTORY);
    }
  }

  if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
      chatbotWindow.classList.toggle('hidden');
      isChatbotOpened = !chatbotWindow.classList.contains('hidden');
      
      if (isChatbotOpened && chatMessages.children.length === 0) {
        sendWelcomeMessage();
      }
      
      scrollToBottom();
      chatInput.focus();
    });
  }

  if (chatbotClose && chatbotWindow) {
    chatbotClose.addEventListener('click', () => {
      chatbotWindow.classList.add('hidden');
    });
  }

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
  }

  async function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    if (text.length > 800) {
      addMessageBubble('Mensagem muito longa. Use no máximo 800 caracteres.', 'bot');
      return;
    }

    const now = Date.now();
    if (now - lastSendAt < CHAT_MIN_INTERVAL_MS) {
      addMessageBubble('Aguarde alguns segundos antes de enviar outra mensagem.', 'bot');
      return;
    }
    lastSendAt = now;

    chatInput.value = '';
    addMessageBubble(text, 'user');
    scrollToBottom();

    chatHistory.push({ role: 'user', content: text });
    trimChatHistory();

    if (chatTypingIndicator) {
      chatTypingIndicator.classList.remove('hidden');
      scrollToBottom();
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      const result = await response.json();

      if (chatTypingIndicator) {
        chatTypingIndicator.classList.add('hidden');
      }

      if (response.status === 429) {
        const wait = result.retryAfter ? ` Aguarde ~${result.retryAfter}s.` : '';
        addMessageBubble(`⏳ ${result.message || 'Limite de mensagens atingido.'}${wait}`, 'bot');
        chatHistory.pop();
        return;
      }

      if (response.ok && result.success) {
        const botReply = result.reply;
        addMessageBubble(botReply, 'bot');
        chatHistory.push({ role: 'assistant', content: botReply });
        trimChatHistory();
      } else if (response.status === 400) {
        addMessageBubble(result.message || 'Mensagem inválida. Tente encurtar o texto.', 'bot');
        chatHistory.pop();
      } else {
        const botReply = getFrontendFallbackResponse(text);
        addMessageBubble(botReply, 'bot');
        chatHistory.push({ role: 'assistant', content: botReply });
        trimChatHistory();
      }
    } catch (error) {
      console.warn('Erro de rede ao conectar à API do chat, usando fallback local...', error);
      
      if (chatTypingIndicator) {
        chatTypingIndicator.classList.add('hidden');
      }

      // Fallback local se o servidor estiver offline (ex: abertura por arquivo file://)
      setTimeout(() => {
        const botReply = getFrontendFallbackResponse(text);
        addMessageBubble(botReply, 'bot');
        chatHistory.push({ role: 'assistant', content: botReply });
        scrollToBottom();
      }, 600);
    }

    scrollToBottom();
  }

  function sendWelcomeMessage() {
    if (chatTypingIndicator) {
      chatTypingIndicator.classList.remove('hidden');
    }
    
    setTimeout(() => {
      if (chatTypingIndicator) {
        chatTypingIndicator.classList.add('hidden');
      }
      const welcomeText = `Olá! Sou o assistente de IA da **conectWM** 🤖✨.

Como posso te ajudar hoje? 
- Se quiser saber mais sobre a **Comunidade conectWM** (ensino full-stack com IA para criar seus apps), digite "Comunidade".
- Se quiser entender como ajudamos sua **Empresa** com automação inteligente e agentes de IA, digite "Automação".`;
      addMessageBubble(welcomeText, 'bot');
      chatHistory.push({ role: 'assistant', content: welcomeText });
      scrollToBottom();
    }, 800);
  }

  function addMessageBubble(text, sender) {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3 fade-in items-start gap-2.5`;

    // Adiciona o logotipo como avatar para as mensagens do bot
    if (sender === 'bot') {
      const avatar = document.createElement('img');
      avatar.src = 'images/logo.png';
      avatar.alt = 'conectWM Logo';
      avatar.className = 'h-7 w-7 rounded-lg bg-sky-500/10 border border-sky-500/20 p-1 flex-shrink-0 object-contain';
      bubbleWrapper.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = `max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
      sender === 'user' 
        ? 'chat-bubble-user font-medium' 
        : 'chat-bubble-bot'
    }`;

    // Formatação simples do Markdown
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•\s(.*?)\n/g, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, '<br>');

    bubble.innerHTML = formattedText;
    bubbleWrapper.appendChild(bubble);
    chatMessages.appendChild(bubbleWrapper);
  }

  function scrollToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

// 3. MOTOR DE RESPOSTA LOCAL PARA FALLBACK OFFLINE/LOCAL FILE
function getFrontendFallbackResponse(message) {
  const text = message.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (text.includes('comunidade') || text.includes('aluno') || text.includes('aprender') || text.includes('curso') || text.includes('escola') || text.includes('ensina') || text.includes('conteudo')) {
    return `Na **Comunidade conectWM**, você aprende a criar sites, aplicativos e SaaS (softwares como serviço) usando Inteligência Artificial como sua copiloto. 

O conteúdo inclui:
• Desenvolvimento Full-Stack auxiliado por IA (Copilot, Cursor, prompts).
• Criação de sites, Web Apps e Microsaas de alta qualidade.
• Monetização, marketing digital, tráfego pago e validação de ideias.
• Kits e templates prontos para você acelerar seus projetos.
• Grupo exclusivo de WhatsApp para suporte e networking.

Deseja começar a criar seus próprios projetos? Clique no botão **"Quero Entrar na Comunidade"** na barra de navegação para iniciar!`;
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
    return `Temos dois caminhos principais na conectWM:
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

  if (text.includes('ola') || text.includes('oi') || text.includes('bom dia') || text.includes('boa tarde') || text.includes('boa noite')) {
    return `Olá! Seja muito bem-vindo à **conectWM**. 🤖✨

Sou o assistente inteligente da plataforma. Como posso te ajudar hoje?
• Se você quer aprender a criar apps e SaaS com IA, me pergunte sobre a **Comunidade**.
• Se você tem uma empresa e quer automatizar tarefas repetitivas, pergunte sobre as nossas **Automações e Diagnóstico**.`;
  }

  return `Fico feliz em te ajudar! Como assistente da **conectWM**, estou pronto para te dar detalhes sobre duas frentes:
1. **Comunidade conectWM:** Como pessoas comuns criam sites, apps e SaaS usando Inteligência Artificial do absoluto zero.
2. **Automações de Processos:** Como empresas economizam tempo e dinheiro automatizando tarefas manuais e integrando sistemas.

Qual das frentes é a ideal para você no momento? Sinta-se à vontade para perguntar o que quiser, ou use os formulários e botões na página para interagir direto!`;
}
