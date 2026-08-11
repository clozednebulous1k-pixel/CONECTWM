// Dashboard Admin · relatórios de leads do formulário de diagnóstico

const STATUS_LABELS = {
  novo: 'Novo',
  em_contato: 'Em contato',
  convertido: 'Convertido',
  arquivado: 'Arquivado',
};

function formatLeadDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function waLink(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '#';
  const full = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${full}`;
}

async function fetchAdminLeads() {
  const token = typeof getAuthToken === 'function' ? getAuthToken() : localStorage.getItem('conectwm_auth_token');
  if (!token) throw new Error('Sessão inválida');

  const res = await fetch('/api/admin/leads', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Falha ao carregar leads');
  }
  return data;
}

async function patchLeadStatus(id, status) {
  const token = typeof getAuthToken === 'function' ? getAuthToken() : localStorage.getItem('conectwm_auth_token');
  const res = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Falha ao atualizar status');
  }
  return data.lead;
}

function renderLeadStats(stats = {}) {
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value ?? 0);
  };
  set('stat-leads-total', stats.total);
  set('stat-leads-novos', stats.novos);
  set('stat-leads-contato', stats.emContato);
  set('stat-leads-semana', stats.ultimos7dias);
}

function renderLeadsTable(leads = []) {
  const tbody = document.getElementById('admin-leads-tbody');
  if (!tbody) return;

  if (!leads.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-10 text-center text-gray-500">
          Nenhum lead ainda. Quando alguém enviar o diagnóstico na landing, aparece aqui.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = leads.map((lead) => {
    const statusOptions = Object.entries(STATUS_LABELS)
      .map(([value, label]) => `<option value="${value}" ${lead.status === value ? 'selected' : ''}>${label}</option>`)
      .join('');

    return `
      <tr class="hover:bg-white/[0.02]">
        <td class="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">${escapeHtml(formatLeadDate(lead.createdAt))}</td>
        <td class="px-4 py-3">
          <div class="font-semibold text-white">${escapeHtml(lead.name)}</div>
          <div class="text-[11px] text-gray-500">${escapeHtml(lead.origem || '')}</div>
        </td>
        <td class="px-4 py-3">
          <a href="mailto:${escapeHtml(lead.email)}" class="block text-sky-400 hover:underline text-xs">${escapeHtml(lead.email)}</a>
          <a href="${waLink(lead.whatsapp)}" target="_blank" rel="noopener noreferrer" class="block text-green-400 hover:underline text-xs mt-1">${escapeHtml(lead.whatsapp)}</a>
        </td>
        <td class="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">${escapeHtml(lead.companySize)}</td>
        <td class="px-4 py-3 text-xs text-gray-400 max-w-[220px]">
          <p class="line-clamp-3" title="${escapeHtml(lead.challenge)}">${escapeHtml(lead.challenge)}</p>
        </td>
        <td class="px-4 py-3">
          <select data-lead-id="${escapeHtml(lead.id)}" class="admin-lead-status bg-slate-900 border border-gray-800 rounded-lg px-2 py-1.5 text-xs text-white">
            ${statusOptions}
          </select>
        </td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('.admin-lead-status').forEach((select) => {
    select.addEventListener('change', async () => {
      const id = select.getAttribute('data-lead-id');
      const prev = select.dataset.prev || select.value;
      select.disabled = true;
      try {
        await patchLeadStatus(id, select.value);
        select.dataset.prev = select.value;
        await loadAdminLeads();
      } catch (err) {
        alert(err.message || 'Erro ao atualizar');
        select.value = prev;
      } finally {
        select.disabled = false;
      }
    });
    select.dataset.prev = select.value;
  });
}

async function loadAdminLeads() {
  const tbody = document.getElementById('admin-leads-tbody');
  try {
    const data = await fetchAdminLeads();
    renderLeadStats(data.stats);
    renderLeadsTable(data.leads);
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-4 py-10 text-center text-red-400">${escapeHtml(err.message)}</td>
        </tr>`;
    }
  }
}

function showAdminNav() {
  const nav = document.getElementById('nav-admin-relatorios');
  if (!nav) return;
  nav.classList.remove('hidden');
  nav.classList.add('flex');
}

function initAdminLeads(me) {
  if (!me || me.role !== 'admin') return;

  showAdminNav();

  const subBadge = document.querySelector('#user-profile-toggle .inline-flex');
  if (subBadge) {
    subBadge.className = 'inline-flex items-center gap-1 rounded bg-amber-500/10 text-amber-400 text-[9px] px-1.5 py-0.5 mt-0.5 font-bold uppercase tracking-wider';
    subBadge.textContent = 'Admin';
  }

  const refreshBtn = document.getElementById('admin-leads-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadAdminLeads());
  }

  // Carrega ao abrir a seção
  document.querySelectorAll('.nav-link[data-target="sec-relatorios"]').forEach((link) => {
    link.addEventListener('click', () => {
      loadAdminLeads();
    });
  });

  // Pré-carrega em background
  loadAdminLeads();
}

window.AdminLeads = { initAdminLeads, loadAdminLeads };
