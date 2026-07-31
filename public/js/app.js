/*
  conectWM - Frontend Application JavaScript
  Controla interações da interface, animações, formulários e o assistente de IA.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Inicializações
  initMobileMenu();
  initFAQAccordion();
  initSmoothScroll();
  initDiagnosticForm();
  initCheckoutModal();
  initChatbot();
  initModulesCarousel();
  initWhatsAppContactForm();
});

// ----------------------------------------------------
// 1. MENU MOBILE
// ----------------------------------------------------
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Fechar ao clicar em algum link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// ----------------------------------------------------
// 2. FAQ ACCORDION (SANFONA)
// ----------------------------------------------------
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Fechar todos antes de abrir o atual (efeito sanfona exclusivo)
        faqItems.forEach(i => i.classList.remove('active'));
        
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// ----------------------------------------------------
// 3. SCROLL SUAVE PARA LINKS INTERNOS
// ----------------------------------------------------
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Obter altura do header para compensação
        const headerHeight = document.querySelector('header').offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ----------------------------------------------------
// 4. FORMULÁRIO DE DIAGNÓSTICO
// ----------------------------------------------------
function initDiagnosticForm() {
  const form = document.getElementById('diagnostico-form');
  const submitBtn = document.getElementById('diagnostico-submit-btn');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-success-modal');

  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Pegar campos
      const name = document.getElementById('diag-name').value.trim();
      const email = document.getElementById('diag-email').value.trim();
      const whatsapp = document.getElementById('diag-whatsapp').value.trim();
      const companySize = document.getElementById('diag-size').value;
      const challenge = document.getElementById('diag-challenge').value.trim();

      // Validação básica extra
      if (!name || !email || !whatsapp || !companySize || !challenge) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Estado de loading no botão
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <div class="flex items-center justify-center gap-2">
          <div class="loader-spinner"></div>
          <span>Enviando dados...</span>
        </div>
      `;

      try {
        const response = await fetch('/api/diagnostico', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, whatsapp, companySize, challenge })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Mostrar Modal de Sucesso
          if (successModal) {
            successModal.classList.remove('hidden');
            successModal.classList.add('flex');
          }
          
          // Formatar mensagem e redirecionar para o WhatsApp do proprietário
          const message = `Olá conectWM! Solicitei um diagnóstico de automação pelo site.

*Dados do Diagnóstico:*
👤 *Nome:* ${name}
📧 *E-mail:* ${email}
📞 *WhatsApp:* ${whatsapp}
🏢 *Tamanho da Empresa:* ${companySize}
🎯 *Desafio Principal:* ${challenge}`;

          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://api.whatsapp.com/send?phone=5511952025568&text=${encodedMessage}`;
          
          // Abre a conversa com a mensagem preenchida em nova aba
          window.open(whatsappUrl, '_blank');
          
          form.reset();
        } else {
          alert(result.message || 'Ocorreu um erro ao enviar. Tente novamente.');
        }

      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        alert('Não foi possível se conectar ao servidor. Verifique se o backend está rodando.');
      } finally {
        // Restaurar botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // Fechar Modal
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      successModal.classList.remove('flex');
    });
  }
}

// ----------------------------------------------------
// 5. MODAL E SIMULAÇÃO DE CHECKOUT
// ----------------------------------------------------
function initCheckoutModal() {
  const checkoutTriggers = document.querySelectorAll('.trigger-checkout');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout-modal');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');

  let selectedProductType = 'comunidade_mensal';

  checkoutTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      selectedProductType = trigger.getAttribute('data-product') || 'comunidade_mensal';
      
      if (checkoutModal) {
        checkoutModal.classList.remove('hidden');
        checkoutModal.classList.add('flex');
      }
    });
  });

  if (closeCheckoutBtn && checkoutModal) {
    closeCheckoutBtn.addEventListener('click', () => {
      checkoutModal.classList.add('hidden');
      checkoutModal.classList.remove('flex');
    });
  }

  if (checkoutForm && checkoutSubmitBtn) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('checkout-email').value.trim();
      if (!email) return;

      // Estado de loading
      const originalText = checkoutSubmitBtn.innerHTML;
      checkoutSubmitBtn.disabled = true;
      checkoutSubmitBtn.innerHTML = `
        <div class="flex items-center justify-center gap-2">
          <div class="loader-spinner"></div>
          <span>Redirecionando...</span>
        </div>
      `;

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, type: selectedProductType })
        });

        const result = await response.json();

        if (response.ok && result.success && result.checkoutUrl) {
          // Redireciona para a página de checkout simulado
          window.location.href = result.checkoutUrl;
        } else {
          alert('Erro ao iniciar checkout: ' + (result.message || 'Erro desconhecido.'));
          checkoutSubmitBtn.disabled = false;
          checkoutSubmitBtn.innerHTML = originalText;
        }
      } catch (err) {
        console.error('Erro de checkout:', err);
        alert('Não foi possível contactar o servidor.');
        checkoutSubmitBtn.disabled = false;
        checkoutSubmitBtn.innerHTML = originalText;
      }
    });
  }
}

// ----------------------------------------------------
// 6. CHATBOT INTERATIVO DE IA
// ----------------------------------------------------
function initChatbot() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatTypingIndicator = document.getElementById('chat-typing');

  // Histórico de mensagens do chat (mantém contexto no servidor)
  let chatHistory = [];
  let isChatbotOpened = false;

  // Abrir / Fechar Chat
  if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
      chatbotWindow.classList.toggle('hidden');
      isChatbotOpened = !chatbotWindow.classList.contains('hidden');
      
      // Mensagem de boas-vindas na primeira abertura
      if (isChatbotOpened && chatMessages.children.length === 0) {
        sendWelcomeMessage();
      }
      
      // Rolar para o final
      scrollToBottom();
      chatInput.focus();
    });
  }

  if (chatbotClose && chatbotWindow) {
    chatbotClose.addEventListener('click', () => {
      chatbotWindow.classList.add('hidden');
    });
  }

  // Enviar Mensagem
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

    // Limpar input
    chatInput.value = '';

    // Adicionar mensagem do usuário no HTML
    addMessageBubble(text, 'user');
    scrollToBottom();

    // Adicionar ao histórico
    chatHistory.push({ role: 'user', content: text });

    // Mostrar indicador de digitando
    if (chatTypingIndicator) {
      chatTypingIndicator.classList.remove('hidden');
      scrollToBottom();
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: chatHistory })
      });

      const result = await response.json();

      // Esconder indicador
      if (chatTypingIndicator) {
        chatTypingIndicator.classList.add('hidden');
      }

      if (response.ok && result.success) {
        const botReply = result.reply;
        addMessageBubble(botReply, 'bot');
        chatHistory.push({ role: 'assistant', content: botReply });
      } else {
        addMessageBubble('Desculpe, tive um problema para me conectar à minha mente inteligente. Você pode tentar novamente mais tarde?', 'bot');
      }

    } catch (error) {
      console.error('Erro de chat:', error);
      if (chatTypingIndicator) {
        chatTypingIndicator.classList.add('hidden');
      }
      addMessageBubble('Erro de rede. Verifique se o servidor backend está rodando no terminal.', 'bot');
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
    }, 1000);
  }

  function addMessageBubble(text, sender) {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3 fade-in`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
      sender === 'user' 
        ? 'chat-bubble-user font-medium' 
        : 'chat-bubble-bot'
    }`;

    // Permitir negritos em Markdown simples (**texto**) e quebras de linha
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

// ----------------------------------------------------
// 7. CARROSSEL DE MÓDULOS (PMG ACADEMY MODEL)
// ----------------------------------------------------
function initModulesCarousel() {
  const container = document.getElementById('modules-scroll-container');
  const btnLeft = document.getElementById('slide-left-btn');
  const btnRight = document.getElementById('slide-right-btn');

  if (container && btnLeft && btnRight) {
    const cardWidth = 344; // card width (320px) + gap (24px)
    
    // Mostra/oculta botão esquerdo baseado no scroll
    container.addEventListener('scroll', () => {
      if (container.scrollLeft > 10) {
        btnLeft.classList.remove('hidden');
      } else {
        btnLeft.classList.add('hidden');
      }
    });

    btnLeft.addEventListener('click', () => {
      container.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    });

    btnRight.addEventListener('click', () => {
      container.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    });
  }
}

// ----------------------------------------------------
// 8. FORMULÁRIO DE CONTATO WHATSAPP (RODAPÉ)
// ----------------------------------------------------
function initWhatsAppContactForm() {
  const form = document.getElementById('whatsapp-contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageInput = document.getElementById('whatsapp-message');
      if (messageInput) {
        const message = messageInput.value.trim();
        if (message) {
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://api.whatsapp.com/send?phone=5511952025568&text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
          messageInput.value = '';
        }
      }
    });
  }
}

