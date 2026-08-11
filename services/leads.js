const { getDb, isFirebaseEnabled, serverTimestamp } = require('./firebase');

const memoryLeads = [];

function trimField(value, max) {
  return String(value || '').trim().slice(0, max);
}

function serializeLead(id, data) {
  const createdAt = data.createdAt?.toDate?.() || (data.createdAt ? new Date(data.createdAt) : null);
  return {
    id,
    name: data.name || '',
    email: data.email || '',
    whatsapp: data.whatsapp || '',
    companySize: data.companySize || '',
    challenge: data.challenge || '',
    origem: data.origem || 'Landing Page conectWM',
    status: data.status || 'novo',
    createdAt: createdAt ? createdAt.toISOString() : null,
  };
}

async function createLead(payload = {}) {
  const lead = {
    name: trimField(payload.name, 120),
    email: trimField(payload.email, 180).toLowerCase(),
    whatsapp: trimField(payload.whatsapp, 40),
    companySize: trimField(payload.companySize, 40),
    challenge: trimField(payload.challenge, 2000),
    origem: trimField(payload.origem, 80) || 'Landing Page conectWM',
    status: 'novo',
    createdAt: new Date().toISOString(),
  };

  if (!lead.name || !lead.email || !lead.whatsapp || !lead.companySize || !lead.challenge) {
    throw Object.assign(new Error('Campos obrigatórios do lead incompletos.'), { statusCode: 400 });
  }

  if (isFirebaseEnabled()) {
    const db = getDb();
    const ref = await db.collection('leads').add({
      ...lead,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return serializeLead(ref.id, lead);
  }

  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  memoryLeads.unshift({ id, ...lead });
  return serializeLead(id, lead);
}

async function listLeads({ limit = 100 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 300);

  if (isFirebaseEnabled()) {
    const db = getDb();
    const snap = await db.collection('leads').orderBy('createdAt', 'desc').limit(safeLimit).get();
    return snap.docs.map((doc) => serializeLead(doc.id, doc.data()));
  }

  return memoryLeads.slice(0, safeLimit).map((item) => serializeLead(item.id, item));
}

async function getLeadStats() {
  const leads = await listLeads({ limit: 300 });
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return {
    total: leads.length,
    novos: leads.filter((l) => l.status === 'novo').length,
    emContato: leads.filter((l) => l.status === 'em_contato').length,
    convertidos: leads.filter((l) => l.status === 'convertido').length,
    ultimos7dias: leads.filter((l) => l.createdAt && now - new Date(l.createdAt).getTime() <= 7 * dayMs).length,
  };
}

async function updateLeadStatus(id, status) {
  const allowed = new Set(['novo', 'em_contato', 'convertido', 'arquivado']);
  if (!allowed.has(status)) {
    throw Object.assign(new Error('Status inválido.'), { statusCode: 400 });
  }

  if (isFirebaseEnabled()) {
    const db = getDb();
    const ref = db.collection('leads').doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      throw Object.assign(new Error('Lead não encontrado.'), { statusCode: 404 });
    }
    await ref.update({ status, updatedAt: serverTimestamp() });
    return serializeLead(id, { ...snap.data(), status });
  }

  const idx = memoryLeads.findIndex((l) => l.id === id);
  if (idx < 0) {
    throw Object.assign(new Error('Lead não encontrado.'), { statusCode: 404 });
  }
  memoryLeads[idx].status = status;
  return serializeLead(id, memoryLeads[idx]);
}

module.exports = {
  createLead,
  listLeads,
  getLeadStats,
  updateLeadStatus,
};
