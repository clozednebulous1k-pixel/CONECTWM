const crypto = require('crypto');
const { getDb, isFirebaseEnabled, serverTimestamp } = require('./firebase');

const TOTAL_MODULES = 10;

const MODULE_CATALOG = [
  { id: 1, title: 'Criando um SaaS', workload: '12h' },
  { id: 2, title: 'Aplicativos Secretos', workload: '10h' },
  { id: 3, title: 'Tráfego Orgânico', workload: '10h' },
  { id: 4, title: 'Funil de Vendas & E-mail Marketing', workload: '10h' },
  { id: 5, title: 'Métricas Financeiras', workload: '8h' },
  { id: 6, title: 'Criando Anúncios Vencedores', workload: '10h' },
  { id: 7, title: 'Gestão de Cobrança', workload: '8h' },
  { id: 8, title: 'Mídias Sociais', workload: '10h' },
  { id: 9, title: 'Lançamento & Escala', workload: '10h' },
  { id: 10, title: 'WhatsApp + IA · Funcionário Virtual', workload: '14h' },
];

const memoryProgress = new Map();
const memoryCertificates = new Map();
const memoryByCode = new Map();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function emailToDocId(email) {
  return normalizeEmail(email).replace(/\./g, '_dot_').replace(/@/g, '_at_');
}

function generateCode() {
  const part = () => crypto.randomBytes(2).toString('hex').toUpperCase();
  return `CWMA-${part()}-${part()}`;
}

function holderFromEmail(email) {
  const local = normalizeEmail(email).split('@')[0] || 'Aluno';
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Aluno conectWM';
}

function normalizeProgress(input = {}) {
  const lessons = Array.isArray(input.completedLessons)
    ? [...new Set(input.completedLessons.map(String))]
    : [];
  const modules = Array.isArray(input.completedModules)
    ? [...new Set(input.completedModules.map(Number).filter((n) => n >= 1 && n <= TOTAL_MODULES))]
    : [];
  return { completedLessons: lessons, completedModules: modules };
}

async function getProgress(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return normalizeProgress({});

  if (isFirebaseEnabled()) {
    const db = getDb();
    const snap = await db.collection('academy_progress').doc(emailToDocId(normalized)).get();
    if (!snap.exists) return normalizeProgress({});
    const data = snap.data() || {};
    return normalizeProgress(data);
  }

  return normalizeProgress(memoryProgress.get(normalized) || {});
}

async function saveProgress(email, progress) {
  const normalized = normalizeEmail(email);
  const payload = {
    ...normalizeProgress(progress),
    email: normalized,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('academy_progress').doc(emailToDocId(normalized)).set(
      { ...payload, updatedAt: serverTimestamp() },
      { merge: true }
    );
    return payload;
  }

  memoryProgress.set(normalized, payload);
  return payload;
}

async function syncProgress(email, body) {
  const current = await getProgress(email);
  const incoming = normalizeProgress(body);

  const merged = normalizeProgress({
    completedLessons: [...current.completedLessons, ...incoming.completedLessons],
    completedModules: [...current.completedModules, ...incoming.completedModules],
  });

  return saveProgress(email, merged);
}

function isModuleComplete(progress, moduleId) {
  return progress.completedModules.includes(Number(moduleId));
}

function isAcademyComplete(progress) {
  return MODULE_CATALOG.every((m) => progress.completedModules.includes(m.id));
}

function buildCertRecord(email, type, moduleId) {
  const holderName = holderFromEmail(email);
  const issuedAt = new Date().toISOString();
  const code = generateCode();

  if (type === 'academy') {
    return {
      code,
      type: 'academy',
      email: normalizeEmail(email),
      holderName,
      title: 'Certificado de Conclusão · conectWM Academy',
      subtitle: 'Formação completa em SaaS, IA e Automação',
      workload: '88h',
      issuedAt,
    };
  }

  const mod = MODULE_CATALOG.find((m) => m.id === Number(moduleId));
  if (!mod) return null;

  return {
    code,
    type: 'module',
    moduleId: mod.id,
    email: normalizeEmail(email),
    holderName,
    title: `Certificado · Módulo ${mod.id}`,
    subtitle: mod.title,
    workload: mod.workload,
    issuedAt,
  };
}

async function listCertificates(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return [];

  if (isFirebaseEnabled()) {
    const db = getDb();
    const snap = await db
      .collection('certificates')
      .where('email', '==', normalized)
      .get();
    return snap.docs.map((d) => d.data()).sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
  }

  return (memoryCertificates.get(normalized) || []).slice();
}

async function findExisting(email, type, moduleId) {
  const list = await listCertificates(email);
  if (type === 'academy') {
    return list.find((c) => c.type === 'academy') || null;
  }
  return list.find((c) => c.type === 'module' && c.moduleId === Number(moduleId)) || null;
}

async function issueCertificate(email, { type, moduleId }) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { success: false, message: 'E-mail inválido.' };
  }

  const progress = await getProgress(normalized);

  if (type === 'module') {
    const id = Number(moduleId);
    if (!MODULE_CATALOG.some((m) => m.id === id)) {
      return { success: false, message: 'Módulo inválido.' };
    }
    if (!isModuleComplete(progress, id)) {
      return { success: false, message: 'Conclua o módulo antes de emitir o certificado.' };
    }
    const existing = await findExisting(normalized, 'module', id);
    if (existing) return { success: true, certificate: existing, alreadyIssued: true };
    const record = buildCertRecord(normalized, 'module', id);
    await storeCertificate(record);
    return { success: true, certificate: record, alreadyIssued: false };
  }

  if (type === 'academy') {
    if (!isAcademyComplete(progress)) {
      return {
        success: false,
        message: `Conclua os ${TOTAL_MODULES} módulos para receber o certificado da Academy.`,
      };
    }
    const existing = await findExisting(normalized, 'academy');
    if (existing) return { success: true, certificate: existing, alreadyIssued: true };
    const record = buildCertRecord(normalized, 'academy');
    await storeCertificate(record);
    return { success: true, certificate: record, alreadyIssued: false };
  }

  return { success: false, message: 'Tipo de certificado inválido.' };
}

async function storeCertificate(record) {
  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('certificates').doc(record.code).set({
      ...record,
      createdAt: serverTimestamp(),
    });
    return;
  }

  const list = memoryCertificates.get(record.email) || [];
  list.push(record);
  memoryCertificates.set(record.email, list);
  memoryByCode.set(record.code, record);
}

async function verifyCertificate(code) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return null;

  if (isFirebaseEnabled()) {
    const db = getDb();
    const snap = await db.collection('certificates').doc(normalized).get();
    return snap.exists ? snap.data() : null;
  }

  return memoryByCode.get(normalized) || null;
}

function getCatalog() {
  return MODULE_CATALOG;
}

module.exports = {
  TOTAL_MODULES,
  MODULE_CATALOG,
  getProgress,
  syncProgress,
  issueCertificate,
  listCertificates,
  verifyCertificate,
  getCatalog,
  isModuleComplete,
  isAcademyComplete,
};
