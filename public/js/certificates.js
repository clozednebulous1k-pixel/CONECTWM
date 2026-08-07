/**
 * Certificados conectWM Academy
 */
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

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  function drawCertificateCanvas(cert) {
    const w = 1200;
    const h = 850;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#070a0f');
    grad.addColorStop(0.5, '#0b1220');
    grad.addColorStop(1, '#0a1628');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, w - 80, h - 80);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(52, 52, w - 104, h - 104);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('conectWM Academy', w / 2, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Syne, Space Grotesk, sans-serif';
    ctx.fillText('Certificado de Conclusão', w / 2, 200);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px Inter, sans-serif';
    ctx.fillText('Certificamos que', w / 2, 280);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Syne, Space Grotesk, sans-serif';
    ctx.fillText(cert.holderName || 'Aluno', w / 2, 350);

    ctx.fillStyle = '#7dd3fc';
    ctx.font = '26px Inter, sans-serif';
    ctx.fillText(`concluiu com êxito: ${cert.subtitle || cert.title}`, w / 2, 420);

    ctx.fillStyle = '#64748b';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText(`Carga horária: ${cert.workload || '10h'} · Emitido em ${formatDate(cert.issuedAt)}`, w / 2, 480);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.moveTo(200, 540);
    ctx.lineTo(w - 200, 540);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`Código: ${cert.code}`, w / 2, 590);
    ctx.fillStyle = '#475569';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Valide em conectwm.vercel.app/certificado.html', w / 2, 620);

    ctx.fillStyle = '#334155';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('conectWM · Conexão e Inteligência Artificial', w / 2, h - 70);

    return canvas;
  }

  function downloadCertificate(cert) {
    const canvas = drawCertificateCanvas(cert);
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
      `;
    }

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
            <div class="flex flex-col sm:flex-row gap-2 mt-auto">
              <button type="button" class="cert-download-btn flex-1 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold transition-all" data-code="${c.cert.code}">Baixar PNG</button>
              <a href="/certificado.html?codigo=${encodeURIComponent(c.cert.code)}" target="_blank" rel="noopener" class="flex-1 py-2.5 rounded-xl bg-slate-900 border border-gray-800 text-xs font-bold text-center text-gray-300 hover:text-white transition-all">Validar</a>
            </div>
          ` : canIssue ? `
            <button type="button" class="cert-issue-btn w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all mt-auto" data-type="${c.type}" ${c.moduleId ? `data-module-id="${c.moduleId}"` : ''}>Emitir certificado</button>
          ` : `
            <p class="text-xs text-gray-500 mt-auto">${c.type === 'academy' ? 'Conclua todos os módulos para desbloquear.' : 'Marque o módulo como concluído no passo a passo.'}</p>
          `}
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.cert-download-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cert = state.certificates.find((c) => c.code === btn.dataset.code);
        if (cert) downloadCertificate(cert);
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
    getState: () => state,
  };
})();

if (typeof window !== 'undefined') {
  window.Certificates = Certificates;
}
