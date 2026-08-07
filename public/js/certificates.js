/**
 * Certificados conectWM Academy
 */
const ACADEMY_PRIZE = {
  title: 'Videochamada de Alinhamento Estratégico',
  duration: '30 minutos',
  whatsapp: '5511952025568',
  description: 'Sessão ao vivo para alinhar seu projeto, SaaS, automação WhatsApp ou próximo passo na Academy.',
};

const Certificates = (() => {
  let state = {
    progress: { completedLessons: [], completedModules: [] },
    certificates: [],
    catalog: [],
  };

  function authHeaders() {
    const token = typeof getAuthToken === 'function' ? getAuthToken() : localStorage.getItem('conectwm_auth_token');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  }

  function collectLocalProgress() {
    const completedLessons = [];
    const completedModules = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('conectwm_completed_') && localStorage.getItem(key) === 'true') {
        completedLessons.push(key.replace('conectwm_completed_', ''));
      }
      if (key.startsWith('conectwm_module_done_') && localStorage.getItem(key) === 'true') {
        const id = Number(key.replace('conectwm_module_done_', ''));
        if (id) completedModules.push(id);
      }
    }

    return { completedLessons, completedModules };
  }

  async function syncProgress() {
    const local = collectLocalProgress();
    const now = Date.now();
    if (syncProgress._lastAt && now - syncProgress._lastAt < 4000) {
      return state.progress;
    }
    syncProgress._lastAt = now;
    try {
      const res = await fetch('/api/certificates/progress', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(local),
      });
      const data = await res.json();
      if (data.success) state.progress = data.progress;
    } catch {
      state.progress = {
        completedLessons: [...new Set([...(state.progress.completedLessons || []), ...local.completedLessons])],
        completedModules: [...new Set([...(state.progress.completedModules || []), ...local.completedModules])],
      };
    }
    return state.progress;
  }

  async function load() {
    try {
      const [progRes, catRes] = await Promise.all([
        fetch('/api/certificates/progress', { headers: authHeaders() }),
        fetch('/api/certificates/catalog'),
      ]);
      const progData = await progRes.json();
      const catData = await catRes.json();
      if (catData.success) state.catalog = catData.modules || [];
      if (progData.success) {
        state.certificates = progData.certificates || [];
        state.progress = progData.progress || state.progress;
      }
      await syncProgress();
    } catch (e) {
      console.warn('Certificados: modo offline parcial', e);
      state.progress = collectLocalProgress();
    }
    return state;
  }

  async function markModuleComplete(moduleId) {
    localStorage.setItem(`conectwm_module_done_${moduleId}`, 'true');
    await syncProgress();
    try {
      await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ type: 'module', moduleId }),
      });
    } catch { /* ignore */ }
    await load();
  }

  async function issue(type, moduleId) {
    const res = await fetch('/api/certificates/issue', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ type, moduleId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Não foi possível emitir.');
    await load();
    return data.certificate;
  }

  function findCert(type, moduleId) {
    if (type === 'academy') return state.certificates.find((c) => c.type === 'academy');
    return state.certificates.find((c) => c.type === 'module' && c.moduleId === moduleId);
  }

  function isModuleDone(moduleId) {
    return (state.progress.completedModules || []).includes(Number(moduleId));
  }

  function academyProgress() {
    const done = (state.progress.completedModules || []).length;
        return { done, total: state.catalog.length || 10, complete: done >= (state.catalog.length || 10) };
  }

  function getUserEmail() {
    return localStorage.getItem('conectwm_logged_in_user') || '';
  }

  function getPrizeWhatsAppUrl() {
    const email = getUserEmail();
    const ap = academyProgress();
    const academyCert = findCert('academy');
    const msg = [
      'Olá, equipe conectWM! 🎓',
      '',
      'Concluí os 10 módulos da *conectWM Academy* e quero resgatar meu prêmio:',
      `*${ACADEMY_PRIZE.title}* (${ACADEMY_PRIZE.duration})`,
      '',
      'Quero alinhar:',
      '· Meu projeto / ideia de SaaS',
      '· Automação ou funcionário virtual WhatsApp',
      '· Próximos passos para monetizar',
      '',
      email ? `E-mail da conta: ${email}` : '',
      academyCert ? `Certificado: ${academyCert.code}` : `Progresso: ${ap.done}/${ap.total} módulos`,
      '',
      'Qual melhor dia e horário para a videochamada?',
    ].filter(Boolean).join('\n');

    return `https://api.whatsapp.com/send?phone=${ACADEMY_PRIZE.whatsapp}&text=${encodeURIComponent(msg)}`;
  }

  function renderAcademyPrizeBanner(ap) {
    const banner = document.getElementById('academy-prize-banner');
    if (!banner) return;

    const pct = Math.min(100, Math.round((ap.done / ap.total) * 100));
    const academyCert = findCert('academy');
    const unlocked = ap.complete;
    const claimedKey = 'conectwm_prize_claim_started';
    const waUrl = getPrizeWhatsAppUrl();

    if (!unlocked) {
      banner.innerHTML = `
        <div class="glass-card rounded-2xl p-6 md:p-8 border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-transparent to-sky-500/5 relative overflow-hidden">
          <div class="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
          <div class="relative flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div class="flex gap-4 items-start">
              <div class="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
                <i data-lucide="gift" class="h-7 w-7"></i>
              </div>
              <div class="space-y-2">
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">Prêmio exclusivo</span>
                <h3 class="text-xl md:text-2xl font-bold font-outfit text-white">${ACADEMY_PRIZE.title}</h3>
                <p class="text-sm text-gray-400 max-w-2xl leading-relaxed">${ACADEMY_PRIZE.description} Conclua os 10 módulos para desbloquear.</p>
                <div class="pt-2 space-y-2 max-w-md">
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Seu progresso</span>
                    <span class="text-sky-400 font-bold">${ap.done}/${ap.total} módulos · ${pct}%</span>
                  </div>
                  <div class="h-2 rounded-full bg-slate-900 border border-gray-800 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-amber-500 to-sky-400 transition-all" style="width:${pct}%"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="shrink-0 rounded-xl bg-slate-950/80 border border-gray-800 px-5 py-4 text-center lg:text-right">
              <p class="text-xs text-gray-500 uppercase tracking-wider font-bold">Bloqueado</p>
              <p class="text-sm text-gray-300 mt-1">Faltam <strong class="text-amber-300">${ap.total - ap.done}</strong> módulo(s)</p>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    banner.innerHTML = `
      <div class="glass-card rounded-2xl p-6 md:p-8 border border-amber-500/35 bg-gradient-to-br from-amber-500/10 via-sky-500/5 to-transparent relative overflow-hidden prize-banner-glow">
        <div class="absolute -top-20 -left-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl pointer-events-none"></div>
        <div class="relative flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div class="flex gap-4 items-start">
            <div class="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 animate-pulse">
              <i data-lucide="video" class="h-7 w-7"></i>
            </div>
            <div class="space-y-2">
              <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/25 px-2.5 py-1 rounded-full">
                <i data-lucide="unlock" class="h-3 w-3"></i> Prêmio desbloqueado
              </span>
              <h3 class="text-xl md:text-2xl font-bold font-outfit text-white">${ACADEMY_PRIZE.title}</h3>
              <p class="text-sm text-gray-300 max-w-2xl leading-relaxed">
                Parabéns! Você concluiu a Academy. Resgate sua <strong class="text-amber-300">videochamada de ${ACADEMY_PRIZE.duration}</strong>
                para alinhar projeto, stack, automação, WhatsApp + IA ou plano de monetização.
              </p>
              <ul class="text-xs text-gray-400 space-y-1 pt-1">
                <li class="flex items-center gap-2"><i data-lucide="check" class="h-3.5 w-3.5 text-green-400"></i> Alinhar ideia de SaaS ou produto digital</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="h-3.5 w-3.5 text-green-400"></i> Definir próximos passos técnicos e comerciais</li>
                <li class="flex items-center gap-2"><i data-lucide="check" class="h-3.5 w-3.5 text-green-400"></i> Tirar dúvidas específicas do seu caso</li>
              </ul>
              ${academyCert ? `<p class="text-[11px] text-gray-500 font-mono pt-1">Certificado ${academyCert.code}</p>` : `<p class="text-xs text-amber-300/90 pt-1">Emita o certificado Academy completo abaixo antes de agendar.</p>`}
            </div>
          </div>
          <div class="flex flex-col gap-2 shrink-0 w-full lg:w-auto">
            <a href="${waUrl}" target="_blank" rel="noopener" id="academy-prize-claim-btn"
              class="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 ${academyCert ? '' : 'opacity-80'}">
              <i data-lucide="calendar-check" class="h-4 w-4"></i> Agendar videochamada
            </a>
            <p class="text-[10px] text-gray-500 text-center">Via WhatsApp · resposta em até 24h</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('academy-prize-claim-btn')?.addEventListener('click', () => {
      localStorage.setItem(claimedKey, new Date().toISOString());
    });

    if (window.lucide) lucide.createIcons();
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  let logoImageCache = null;
  let fontsReadyPromise = null;

  function loadLogoImage() {
    if (logoImageCache) return Promise.resolve(logoImageCache);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        logoImageCache = img;
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = '/images/logo.png';
    });
  }

  async function ensureCertificateFonts() {
    if (!fontsReadyPromise) {
      fontsReadyPromise = Promise.all([
        document.fonts.load('700 52px "Space Grotesk"'),
        document.fonts.load('800 56px "Syne"'),
        document.fonts.load('600 22px "Syne"'),
        document.fonts.load('400 20px "Inter"'),
        document.fonts.load('500 16px "Inter"'),
      ]).catch(() => {});
    }
    return fontsReadyPromise;
  }

  function drawGridPattern(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;
    const step = 36;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRadialGlow(ctx, cx, cy, radius, color) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }

  function drawCornerOrnament(ctx, x, y, size, flipX, flipY) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(0, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, size - 8);
    ctx.lineTo(8, 8);
    ctx.lineTo(size - 8, 8);
    ctx.stroke();
    ctx.restore();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(' ');
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight));
    return lines.length;
  }

  function drawOfficialSeal(ctx, cx, cy, r) {
    ctx.save();
    const ring = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
    ring.addColorStop(0, '#fcd34d');
    ring.addColorStop(0.5, '#f59e0b');
    ring.addColorStop(1, '#b45309');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = ring;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    const label = 'conectWM';
    for (let i = 0; i < label.length; i++) {
      const angle = (-Math.PI / 2) + (i / (label.length - 1)) * Math.PI * 0.85 - Math.PI * 0.425;
      const tx = cx + Math.cos(angle) * (r - 18);
      const ty = cy + Math.sin(angle) * (r - 18);
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(label[i], 0, 0);
      ctx.restore();
    }

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓', cx, cy + 2);
    ctx.restore();
  }

  async function drawCertificateCanvas(cert) {
    await ensureCertificateFonts();
    const logo = await loadLogoImage();

    const w = 1600;
    const h = 1130;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#04060b');
    bg.addColorStop(0.45, '#0a101c');
    bg.addColorStop(1, '#071525');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    drawRadialGlow(ctx, w / 2, 220, 420, 'rgba(56, 189, 248, 0.12)');
    drawRadialGlow(ctx, w * 0.85, h * 0.75, 280, 'rgba(251, 191, 36, 0.06)');
    drawGridPattern(ctx, w, h);

    const m = 48;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(m, m, w - m * 2, h - m * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(m + 14, m + 14, w - (m + 14) * 2, h - (m + 14) * 2);

    const ornSize = 64;
    drawCornerOrnament(ctx, m + 6, m + 6, ornSize, false, false);
    drawCornerOrnament(ctx, w - m - 6, m + 6, ornSize, true, false);
    drawCornerOrnament(ctx, m + 6, h - m - 6, ornSize, false, true);
    drawCornerOrnament(ctx, w - m - 6, h - m - 6, ornSize, true, true);

    const innerX = 96;
    const innerY = 96;
    const innerW = w - 192;
    const innerH = h - 192;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.roundRect(innerX, innerY, innerW, innerH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const logoW = 120;
    const logoH = logo ? (logo.height / logo.width) * logoW : 48;
    const logoY = innerY + 52;
    if (logo) {
      ctx.drawImage(logo, w / 2 - logoW / 2, logoY, logoW, logoH);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 36px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('conectWM', w / 2, logoY + 36);
    }

    const brandY = logoY + logoH + 28;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    const badgeW = 280;
    ctx.beginPath();
    ctx.roundRect(w / 2 - badgeW / 2, brandY - 18, badgeW, 36, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '600 14px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACADEMY · CONEXÃO E INTELIGÊNCIA ARTIFICIAL', w / 2, brandY + 5);

    const titleY = brandY + 72;
    const titleGrad = ctx.createLinearGradient(w / 2 - 320, titleY, w / 2 + 320, titleY);
    titleGrad.addColorStop(0, '#ffffff');
    titleGrad.addColorStop(0.5, '#bae6fd');
    titleGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = titleGrad;
    ctx.font = '800 56px "Syne", "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificado de Conclusão', w / 2, titleY);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 200, titleY + 28);
    ctx.lineTo(w / 2 - 12, titleY + 28);
    ctx.moveTo(w / 2 + 12, titleY + 28);
    ctx.lineTo(w / 2 + 200, titleY + 28);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(w / 2, titleY + 20);
    ctx.lineTo(w / 2 + 10, titleY + 28);
    ctx.lineTo(w / 2, titleY + 36);
    ctx.lineTo(w / 2 - 10, titleY + 28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 22px "Inter", sans-serif';
    ctx.fillText('Certificamos que', w / 2, titleY + 88);

    const nameY = titleY + 150;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 52px "Space Grotesk", sans-serif';
    const holder = cert.holderName || 'Aluno conectWM';
    const nameLines = wrapText(ctx, holder, w / 2, nameY, innerW - 120, 58);

    ctx.fillStyle = '#64748b';
    ctx.font = '400 20px "Inter", sans-serif';
    ctx.fillText('concluiu com êxito a formação', w / 2, nameY + nameLines * 58 + 16);

    const courseY = nameY + nameLines * 58 + 62;
    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 28px "Syne", "Space Grotesk", sans-serif';
    const courseTitle = cert.subtitle || cert.title || 'conectWM Academy';
    const courseLines = wrapText(ctx, courseTitle, w / 2, courseY, innerW - 160, 36);

    const metaY = courseY + courseLines * 36 + 36;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    const metaW = 520;
    const metaH = 44;
    ctx.beginPath();
    ctx.roundRect(w / 2 - metaW / 2, metaY - 28, metaW, metaH, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 16px "Inter", sans-serif';
    ctx.fillText(
      `Carga horária ${cert.workload || '10h'}  ·  Emitido em ${formatDate(cert.issuedAt)}`,
      w / 2,
      metaY
    );

    if (cert.type === 'academy') {
      const prizeY = metaY + 58;
      const prizeW = 680;
      const prizeGrad = ctx.createLinearGradient(w / 2 - prizeW / 2, prizeY, w / 2 + prizeW / 2, prizeY);
      prizeGrad.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
      prizeGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.22)');
      prizeGrad.addColorStop(1, 'rgba(251, 191, 36, 0.12)');
      ctx.fillStyle = prizeGrad;
      ctx.beginPath();
      ctx.roundRect(w / 2 - prizeW / 2, prizeY - 30, prizeW, 52, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#fcd34d';
      ctx.font = '600 15px "Inter", sans-serif';
      ctx.fillText('🏆 PRÊMIO DESBLOQUEADO · Videochamada de Alinhamento Estratégico (30 min)', w / 2, prizeY);
    }

    const codeY = (cert.type === 'academy' ? metaY + 130 : metaY + 72);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 220, codeY - 32, 440, 52, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`CÓDIGO  ${cert.code}`, w / 2, codeY);

    ctx.fillStyle = '#475569';
    ctx.font = '400 14px "Inter", sans-serif';
    ctx.fillText('Valide em conectwm.vercel.app/certificado.html', w / 2, codeY + 38);

    const sigY = h - innerY - 88;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 140, sigY);
    ctx.lineTo(w / 2 + 140, sigY);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 14px "Inter", sans-serif';
    ctx.fillText('Direção Pedagógica · conectWM Academy', w / 2, sigY + 28);

    drawOfficialSeal(ctx, w - innerX - 72, h - innerY - 72, 56);

    return canvas;
  }

  function ensurePreviewModal() {
    let modal = document.getElementById('cert-preview-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'cert-preview-modal';
    modal.className = 'fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-black/80 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="glass-card rounded-2xl border border-sky-500/25 max-w-4xl w-full max-h-[95vh] overflow-auto p-4 md:p-6 space-y-4 relative">
        <button type="button" id="cert-preview-close" class="absolute top-4 right-4 h-9 w-9 rounded-xl bg-slate-900 border border-gray-800 text-gray-400 hover:text-white flex items-center justify-center" aria-label="Fechar">
          <i data-lucide="x" class="h-4 w-4"></i>
        </button>
        <div class="text-center pr-10">
          <h3 class="text-lg font-bold font-outfit text-white">Pré-visualização do certificado</h3>
          <p class="text-xs text-gray-500 mt-1">Visualize antes de baixar em alta qualidade (PNG)</p>
        </div>
        <div id="cert-preview-canvas-wrap" class="rounded-xl overflow-hidden border border-sky-500/20 bg-slate-950 flex justify-center"></div>
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <button type="button" id="cert-preview-download" class="px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-sm font-bold transition-all">Baixar PNG</button>
          <button type="button" id="cert-preview-close-btn" class="px-6 py-3 rounded-xl bg-slate-900 border border-gray-800 text-sm font-bold text-gray-300 hover:text-white transition-all">Fechar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    };
    modal.querySelector('#cert-preview-close')?.addEventListener('click', close);
    modal.querySelector('#cert-preview-close-btn')?.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    return modal;
  }

  let previewCertRef = null;

  async function previewCertificate(cert) {
    const modal = ensurePreviewModal();
    const wrap = document.getElementById('cert-preview-canvas-wrap');
    if (!wrap) return;

    wrap.innerHTML = '<p class="text-sm text-gray-500 py-16">Gerando certificado...</p>';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();

    try {
      const canvas = await drawCertificateCanvas(cert);
      previewCertRef = cert;
      wrap.innerHTML = '';
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.style.display = 'block';
      wrap.appendChild(canvas);

      const dlBtn = document.getElementById('cert-preview-download');
      if (dlBtn) {
        dlBtn.onclick = () => downloadCertificate(previewCertRef);
      }
    } catch (err) {
      wrap.innerHTML = `<p class="text-sm text-red-400 py-8">${err.message || 'Erro ao gerar certificado.'}</p>`;
    }

    if (window.lucide) lucide.createIcons();
  }

  async function downloadCertificate(cert) {
    const canvas = await drawCertificateCanvas(cert);
    const link = document.createElement('a');
    link.download = `certificado-${cert.code}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function renderSection() {
    const grid = document.getElementById('certificates-grid');
    const summary = document.getElementById('certificates-summary');
    if (!grid) return;

    const ap = academyProgress();
    if (summary) {
      summary.innerHTML = `
        <span class="text-sky-400 font-bold">${ap.done}/${ap.total} módulos concluídos</span>
        <span class="text-gray-500">· ${state.certificates.length} certificado(s) emitido(s)</span>
        ${ap.complete ? '<span class="text-amber-300 font-bold">· Prêmio de videochamada desbloqueado</span>' : ''}
      `;
    }

    renderAcademyPrizeBanner(ap);

    const academyCert = findCert('academy');
    const cards = [];

    cards.push({
      key: 'academy',
      title: 'Certificado Academy Completo',
      subtitle: 'Todos os 10 módulos da formação',
      done: ap.complete,
      cert: academyCert,
      type: 'academy',
      moduleId: null,
      badge: ap.complete ? 'Disponível' : `${ap.done}/${ap.total} módulos`,
    });

    (state.catalog.length ? state.catalog : Array.from({ length: 10 }, (_, i) => ({ id: i + 1, title: `Módulo ${i + 1}` }))).forEach((mod) => {
      const done = isModuleDone(mod.id);
      cards.push({
        key: `mod-${mod.id}`,
        title: `Módulo ${mod.id}: ${mod.title}`,
        subtitle: mod.workload ? `Carga horária ${mod.workload}` : 'Conclusão do passo a passo',
        done,
        cert: findCert('module', mod.id),
        type: 'module',
        moduleId: mod.id,
        badge: done ? 'Concluído' : 'Em andamento',
      });
    });

    grid.innerHTML = cards.map((c) => {
      const hasCert = Boolean(c.cert);
      const canIssue = c.done && !hasCert;
      return `
        <div class="glass-card rounded-2xl p-6 border ${c.done ? 'border-sky-500/25' : 'border-gray-800'} flex flex-col gap-4">
          <div class="flex items-start justify-between gap-3">
            <div class="h-11 w-11 rounded-xl ${c.done ? 'bg-sky-500/15 border-sky-500/30 text-sky-400' : 'bg-slate-900 border-gray-800 text-gray-500'} border flex items-center justify-center shrink-0">
              <i data-lucide="${c.type === 'academy' ? 'award' : 'badge-check'}" class="h-5 w-5"></i>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${c.done ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-500'}">${c.badge}</span>
          </div>
          <div>
            <h4 class="font-bold font-outfit text-white">${c.title}</h4>
            <p class="text-xs text-gray-500 mt-1">${c.subtitle}</p>
          </div>
          ${hasCert ? `
            <p class="text-[11px] text-gray-400 font-mono">Código ${c.cert.code}</p>
            ${c.type === 'academy' ? `
              <a href="${getPrizeWhatsAppUrl()}" target="_blank" rel="noopener"
                class="w-full py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold text-center transition-all flex items-center justify-center gap-2">
                <i data-lucide="video" class="h-3.5 w-3.5"></i> Resgatar videochamada de alinhamento
              </a>
            ` : ''}
            <div class="flex flex-col sm:flex-row gap-2 mt-auto">
              <button type="button" class="cert-preview-btn flex-1 py-2.5 rounded-xl bg-slate-900 border border-sky-500/30 text-sky-300 hover:text-white hover:border-sky-400/50 text-xs font-bold transition-all" data-code="${c.cert.code}">Visualizar</button>
              <button type="button" class="cert-download-btn flex-1 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold transition-all" data-code="${c.cert.code}">Baixar PNG</button>
              <a href="/certificado.html?codigo=${encodeURIComponent(c.cert.code)}" target="_blank" rel="noopener" class="flex-1 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-xs font-bold text-center text-gray-300 hover:text-white transition-all">Validar</a>
            </div>
          ` : canIssue ? `
            <button type="button" class="cert-issue-btn w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all mt-auto" data-type="${c.type}" ${c.moduleId ? `data-module-id="${c.moduleId}"` : ''}>Emitir certificado</button>
          ` : `
            <p class="text-xs text-gray-500 mt-auto">${c.type === 'academy' ? 'Conclua todos os módulos para desbloquear o certificado e a videochamada de alinhamento.' : 'Marque o módulo como concluído no passo a passo.'}</p>
          `}
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.cert-download-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const cert = state.certificates.find((c) => c.code === btn.dataset.code);
        if (cert) {
          btn.disabled = true;
          const prev = btn.textContent;
          btn.textContent = 'Gerando...';
          try {
            await downloadCertificate(cert);
          } finally {
            btn.disabled = false;
            btn.textContent = prev;
          }
        }
      });
    });

    grid.querySelectorAll('.cert-preview-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const cert = state.certificates.find((c) => c.code === btn.dataset.code);
        if (cert) await previewCertificate(cert);
      });
    });

    grid.querySelectorAll('.cert-issue-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = 'Emitindo...';
        try {
          await issue(btn.dataset.type, btn.dataset.moduleId ? Number(btn.dataset.moduleId) : undefined);
          renderSection();
          if (window.lucide) lucide.createIcons();
        } catch (err) {
          alert(err.message);
          btn.disabled = false;
          btn.textContent = 'Emitir certificado';
        }
      });
    });

    if (window.lucide) lucide.createIcons();
  }

  async function init() {
    await load();
    renderSection();
  }

  return {
    init,
    load,
    syncProgress,
    markModuleComplete,
    renderSection,
    downloadCertificate,
    previewCertificate,
    drawCertificateCanvas,
    getPrizeWhatsAppUrl,
    getState: () => state,
  };
})();

if (typeof window !== 'undefined') {
  window.Certificates = Certificates;
}
