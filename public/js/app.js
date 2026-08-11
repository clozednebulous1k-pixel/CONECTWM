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
  initModulesCarousel();
  initWhatsAppContactForm();
  initScrollNavbar();
  initScrollProgress();
  initMobilePathLock();
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
function buildDiagnosticoWhatsAppUrl({ name, email, whatsapp, companySize, challenge }) {
  const message = `Olá conectWM! Solicitei um diagnóstico de automação pelo site.

*Dados do Diagnóstico:*
👤 *Nome:* ${name}
📧 *E-mail:* ${email}
📞 *WhatsApp:* ${whatsapp}
🏢 *Tamanho da Empresa:* ${companySize}
🎯 *Desafio Principal:* ${challenge}`;

  return `https://wa.me/5511952025568?text=${encodeURIComponent(message)}`;
}

function openWhatsAppUrl(url) {
  // Clique em <a> costuma passar pelo bloqueador de pop-up melhor que window.open pós-await
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function isLoggedInAdmin() {
  const token = typeof getAuthToken === 'function'
    ? getAuthToken()
    : localStorage.getItem('conectwm_auth_token');
  if (!token) return false;

  if (typeof fetchAuthMe === 'function') {
    try {
      const me = await fetchAuthMe();
      if (me?.role === 'admin') {
        localStorage.setItem('conectwm_user_role', 'admin');
        return true;
      }
    } catch {
      /* fallback abaixo */
    }
  }

  return localStorage.getItem('conectwm_user_role') === 'admin';
}

async function redirectAdminToReportsPanel() {
  if (!(await isLoggedInAdmin())) return false;
  window.location.href = '/dashboard.html?section=relatorios';
  return true;
}

function initDiagnosticForm() {
  const form = document.getElementById('diagnostico-form');
  const submitBtn = document.getElementById('diagnostico-submit-btn');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-success-modal');
  const successWhatsAppBtn = document.getElementById('success-whatsapp-btn');
  const successAdminPanelBtn = document.getElementById('success-admin-panel-btn');

  isLoggedInAdmin().then((isAdmin) => {
    if (successAdminPanelBtn) {
      successAdminPanelBtn.classList.toggle('hidden', !isAdmin);
      successAdminPanelBtn.classList.toggle('flex', isAdmin);
    }
  });

  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('diag-name').value.trim();
      const email = document.getElementById('diag-email').value.trim();
      const whatsapp = document.getElementById('diag-whatsapp').value.trim();
      const companySize = document.getElementById('diag-size').value;
      const challenge = document.getElementById('diag-challenge').value.trim();

      if (!name || !email || !whatsapp || !companySize || !challenge) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const whatsappUrl = buildDiagnosticoWhatsAppUrl({ name, email, whatsapp, companySize, challenge });

      // Abre aba vazia AINDA no clique do usuário (evita bloqueio de pop-up após o fetch)
      const waTab = window.open('about:blank', '_blank');

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
          if (await redirectAdminToReportsPanel()) return;

          if (successWhatsAppBtn) successWhatsAppBtn.href = whatsappUrl;

          if (successModal) {
            successModal.classList.remove('hidden');
            successModal.classList.add('flex');
            if (window.lucide?.createIcons) window.lucide.createIcons();
          }

          if (waTab && !waTab.closed) {
            waTab.location.href = whatsappUrl;
          } else {
            openWhatsAppUrl(whatsappUrl);
          }

          form.reset();
        } else {
          if (waTab && !waTab.closed) waTab.close();
          alert(result.message || 'Ocorreu um erro ao enviar. Tente novamente.');
        }

      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        if (waTab && !waTab.closed) waTab.close();
        // Mesmo se a API falhar, permite falar no WhatsApp
        if (successWhatsAppBtn) successWhatsAppBtn.href = whatsappUrl;
        openWhatsAppUrl(whatsappUrl);
        alert('Não foi possível salvar no servidor, mas o WhatsApp foi aberto com sua mensagem.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      successModal.classList.remove('flex');
    });
  }
}

// ----------------------------------------------------
// 5. CHECKOUT HOTMART + URGÊNCIA
// ----------------------------------------------------
function initScarcityCounters() {
  if (typeof getSpotsRemaining !== 'function') return;
  const spots = getSpotsRemaining();

  ['spots-remaining', 'spots-remaining-card', 'spots-remaining-modal'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(spots);
  });
}

function initCheckoutModal() {
  const checkoutTriggers = document.querySelectorAll('.trigger-checkout');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout-modal');
  const hotmartBtn = document.getElementById('checkout-hotmart-btn');

  initScarcityCounters();

  checkoutTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (trigger.getAttribute('href')?.includes('pay.hotmart.com')) {
        e.preventDefault();
        if (typeof goToCheckout === 'function') goToCheckout();
        else window.location.href = 'https://pay.hotmart.com/O107022826R';
      }
    });
  });

  if (closeCheckoutBtn && checkoutModal) {
    closeCheckoutBtn.addEventListener('click', () => {
      checkoutModal.classList.add('hidden');
      checkoutModal.classList.remove('flex');
    });
  }

  if (hotmartBtn) {
    hotmartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof goToCheckout === 'function') goToCheckout();
    });
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

// ----------------------------------------------------
// 9. BARRA DE PROGRESSO DO SCROLL (landing)
// ----------------------------------------------------
function initScrollProgress() {
  const fill = document.getElementById('scroll-progress-fill');
  if (!fill) return;

  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = maxScroll > 0 ? Math.min(100, (scrollTop / maxScroll) * 100) : 0;
    fill.style.width = `${pct}%`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// ----------------------------------------------------
// 10. NAVBAR SCROLL EFFECT
// ----------------------------------------------------
function initScrollNavbar() {
  const header = document.querySelector('header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY >= 50) {
        header.classList.add('nav-scrolled');
      } else {
        header.classList.remove('nav-scrolled');
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
  }
}

// ----------------------------------------------------
// 11. MOBILE PATH LOCK SYSTEM
// ----------------------------------------------------
function initMobilePathLock() {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    document.body.classList.add('mobile-locked');
    
    // Encontrar os botões dos dois caminhos no Hero
    const path1Btn = document.querySelector('#caminhos a.trigger-checkout, #caminhos a[href*="pay.hotmart.com"]');
    const path2Btn = document.querySelector('#caminhos a[href="#diagnostico"]');
    
    if (path1Btn) {
      path1Btn.addEventListener('click', (e) => {
        if (document.body.classList.contains('mobile-locked')) {
          document.body.classList.remove('mobile-locked');
        }
      }, true);
    }
    
    if (path2Btn) {
      path2Btn.addEventListener('click', (e) => {
        if (document.body.classList.contains('mobile-locked')) {
          e.preventDefault();
          
          // Destravar a tela
          document.body.classList.remove('mobile-locked');
          
          setTimeout(() => {
            const targetSection = document.getElementById('diagnostico');
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      });
    }
    
    // Destravar em qualquer clique do menu/header
    const navLinks = document.querySelectorAll('header a, #mobile-menu a, header button');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('mobile-locked');
      });
    });
  }
}

