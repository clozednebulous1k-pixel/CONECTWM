const crypto = require('crypto');
const { getDb, isFirebaseEnabled, serverTimestamp } = require('./firebase');

const memoryUsers = new Map();
const memorySessions = new Map();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function emailToDocId(email) {
  return normalizeEmail(email).replace(/\./g, '_dot_').replace(/@/g, '_at_');
}

function generateAccessPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let pwd = 'CW';
  for (let i = 0; i < 8; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !password) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(test, 'hex'));
  } catch {
    return false;
  }
}

function generateSessionToken() {
  return 'sess_' + crypto.randomBytes(24).toString('hex');
}

function getAppUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

function buildWelcomeEmail({ email, password, planLabel, expiresAt }) {
  const loginUrl = `${getAppUrl()}/login.html?email=${encodeURIComponent(email)}&welcome=1`;
  const expires = expiresAt ? new Date(expiresAt).toLocaleDateString('pt-BR') : '—';

  return {
    to: email,
    subject: '🎉 Seu acesso à conectWM Academy foi liberado!',
    body: `Olá!

Seu pagamento foi confirmado e sua conta na conectWM Academy está ativa.

━━━━━━━━━━━━━━━━━━━━
📧 E-mail: ${email}
🔑 Senha de acesso: ${password}
━━━━━━━━━━━━━━━━━━━━

Plano: ${planLabel || 'Comunidade conectWM'}
Válido até: ${expires}

👉 Entrar agora: ${loginUrl}

Guarde esta senha em local seguro. Recomendamos alterá-la após o primeiro acesso.

Equipe conectWM`,
    loginUrl,
  };
}

async function createUserAccess({ email, orderId, planLabel, expiresAt }) {
  const normalizedEmail = normalizeEmail(email);
  const password = generateAccessPassword();
  const passwordHash = hashPassword(password);
  const docId = emailToDocId(normalizedEmail);

  const userData = {
    email: normalizedEmail,
    passwordHash,
    orderId: orderId || null,
    planLabel: planLabel || null,
    status: 'active',
    mustChangePassword: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('users').doc(docId).set({
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    await db.collection('access_emails').add({
      email: normalizedEmail,
      orderId: orderId || null,
      subject: buildWelcomeEmail({ email: normalizedEmail, password, planLabel, expiresAt }).subject,
      sentAt: serverTimestamp(),
      simulated: true,
      channel: 'checkout_success',
    });
  } else {
    memoryUsers.set(docId, userData);
  }

  const welcomeEmail = buildWelcomeEmail({
    email: normalizedEmail,
    password,
    planLabel,
    expiresAt,
  });

  return {
    email: normalizedEmail,
    password,
    welcomeEmail,
  };
}

async function getUserByEmail(email) {
  const docId = emailToDocId(normalizeEmail(email));
  if (isFirebaseEnabled()) {
    const db = getDb();
    const snap = await db.collection('users').doc(docId).get();
    if (!snap.exists) return null;
    return { id: docId, ...snap.data() };
  }
  return memoryUsers.get(docId) || null;
}

async function createSession(email) {
  const normalizedEmail = normalizeEmail(email);
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const sessionData = {
    email: normalizedEmail,
    token,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('sessions').doc(token).set({
      email: normalizedEmail,
      expiresAt,
      createdAt: serverTimestamp(),
    });
  } else {
    memorySessions.set(token, sessionData);
  }

  return sessionData;
}

async function validateSession(token) {
  if (!token) return null;

  if (isFirebaseEnabled()) {
    const db = getDb();
    const snap = await db.collection('sessions').doc(token).get();
    if (!snap.exists) return null;
    const data = snap.data();
    const expires = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
    if (expires < new Date()) return null;
    return { email: data.email, token };
  }

  const session = memorySessions.get(token);
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) return null;
  return session;
}

async function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const user = await getUserByEmail(normalizedEmail);

  if (!user) {
    return { success: false, message: 'Conta não encontrada. Finalize a compra para receber seu login por e-mail.' };
  }

  if (user.status !== 'active') {
    return { success: false, message: 'Conta inativa. Entre em contato com o suporte.' };
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return { success: false, message: 'E-mail ou senha incorretos.' };
  }

  const session = await createSession(normalizedEmail);

  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('users').doc(emailToDocId(normalizedEmail)).update({
      lastLoginAt: serverTimestamp(),
    });
  }

  return {
    success: true,
    token: session.token,
    email: normalizedEmail,
    expiresAt: session.expiresAt,
  };
}

module.exports = {
  createUserAccess,
  loginUser,
  validateSession,
  getUserByEmail,
  buildWelcomeEmail,
  normalizeEmail,
};
