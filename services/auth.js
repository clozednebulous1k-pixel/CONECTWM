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

const MIN_PASSWORD_LENGTH = 6;

function needsPasswordSetup(user) {
  if (!user) return false;
  if (user.mustSetPassword === true) return true;
  if (!user.passwordHash) return true;
  // Contas antigas: senha gerada automaticamente (usuário nunca escolheu)
  if (!user.passwordSetAt) return true;
  return false;
}

function validateNewPassword(password, passwordConfirm) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Informe uma senha.' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, message: `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.` };
  }
  if (password !== passwordConfirm) {
    return { valid: false, message: 'As senhas não coincidem. Digite a mesma senha nos dois campos.' };
  }
  return { valid: true, message: null };
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

function buildWelcomeEmail({ email, planLabel, expiresAt }) {
  const loginUrl = `${getAppUrl()}/login.html?email=${encodeURIComponent(email)}&welcome=1`;
  const expires = expiresAt ? new Date(expiresAt).toLocaleDateString('pt-BR') : '';

  return {
    to: email,
    subject: '🎉 Seu acesso à conectWM Academy foi liberado!',
    body: `Olá!

Seu pagamento foi confirmado e sua conta na conectWM Academy está ativa.

━━━━━━━━━━━━━━━━━━━━
📧 E-mail: ${email}
🔑 No primeiro acesso, você cria sua própria senha
━━━━━━━━━━━━━━━━━━━━

Plano: ${planLabel || 'Comunidade conectWM'}
Válido até: ${expires}

👉 Criar senha e entrar: ${loginUrl}

Use o e-mail acima e defina uma senha segura (digite duas vezes para confirmar).

Equipe conectWM`,
    loginUrl,
  };
}

async function createUserAccess({ email, orderId, planLabel, expiresAt, channel = 'checkout_success' }) {
  const normalizedEmail = normalizeEmail(email);
  const docId = emailToDocId(normalizedEmail);
  const welcomeEmail = buildWelcomeEmail({
    email: normalizedEmail,
    planLabel,
    expiresAt,
  });

  const userData = {
    email: normalizedEmail,
    passwordHash: null,
    orderId: orderId || null,
    planLabel: planLabel || null,
    status: 'active',
    mustSetPassword: true,
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
      subject: welcomeEmail.subject,
      sentAt: serverTimestamp(),
      simulated: true,
      channel,
    });
  } else {
    memoryUsers.set(docId, userData);
  }

  return {
    email: normalizedEmail,
    password: null,
    mustSetPassword: true,
    welcomeEmail,
  };
}

/** Cria acesso novo ou reutiliza conta existente (não reseta senha). */
async function provisionUserAccess({ email, orderId, planLabel, expiresAt, channel = 'checkout_success' }) {
  const normalizedEmail = normalizeEmail(email);
  const existing = await getUserByEmail(normalizedEmail);

  if (existing) {
    const loginUrl = `${getAppUrl()}/login.html?email=${encodeURIComponent(normalizedEmail)}&welcome=1`;
    const mustSetPassword = needsPasswordSetup(existing);
    return {
      email: normalizedEmail,
      password: null,
      existingAccount: true,
      mustSetPassword,
      welcomeEmail: {
        to: normalizedEmail,
        subject: mustSetPassword
          ? 'Seu acesso conectWM Academy · crie sua senha'
          : 'Seu acesso conectWM Academy continua ativo',
        body: mustSetPassword
          ? `Olá!

Seu pagamento foi confirmado.

👉 Crie sua senha e entre: ${loginUrl}

Use o e-mail da compra e defina uma senha (digite duas vezes para confirmar).

Equipe conectWM`
          : `Olá!

Seu pagamento foi confirmado e sua assinatura foi renovada/atualizada.

Use o mesmo e-mail e senha da sua conta.

👉 Entrar: ${loginUrl}

Equipe conectWM`,
        loginUrl,
      },
    };
  }

  return createUserAccess({ email: normalizedEmail, orderId, planLabel, expiresAt, channel });
}

async function dispatchWelcomeEmail(welcomeEmail, password) {
  const webhookUrl = process.env.ACCESS_EMAIL_WEBHOOK_URL;
  const payload = {
    to: welcomeEmail.to,
    subject: welcomeEmail.subject,
    body: welcomeEmail.body,
    loginUrl: welcomeEmail.loginUrl,
    password: password || null,
    source: 'conectwm_academy',
  };

  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(`📧 Webhook de e-mail disparado para ${welcomeEmail.to}`);
      return { sent: true, channel: 'webhook' };
    } catch (err) {
      console.error('Erro ao enviar webhook de e-mail:', err.message);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 E-MAIL DE ACESSO (simulado / log servidor)');
  console.log(`Para: ${welcomeEmail.to}`);
  console.log(`Assunto: ${welcomeEmail.subject}`);
  if (password) console.log(`Senha: ${password}`);
  console.log(`Login: ${welcomeEmail.loginUrl}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return { sent: false, channel: 'log' };
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

async function getFirstAccessStatus(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return { exists: false, mustSetPassword: false };
  }

  const user = await getUserByEmail(normalizedEmail);
  if (!user) {
    return { exists: false, mustSetPassword: false, email: normalizedEmail };
  }

  return {
    exists: true,
    mustSetPassword: needsPasswordSetup(user),
    status: user.status || 'active',
    email: normalizedEmail,
  };
}

async function setInitialPassword({ email, password, passwordConfirm }) {
  const normalizedEmail = normalizeEmail(email);
  const user = await getUserByEmail(normalizedEmail);

  if (!user) {
    return { success: false, message: 'Conta não encontrada. Finalize a compra para liberar seu acesso.' };
  }

  if (user.status !== 'active') {
    return { success: false, message: 'Conta inativa. Entre em contato com o suporte.' };
  }

  if (!needsPasswordSetup(user)) {
    return { success: false, message: 'Esta conta já possui senha. Use o login normal.' };
  }

  const pwdCheck = validateNewPassword(password, passwordConfirm);
  if (!pwdCheck.valid) {
    return { success: false, message: pwdCheck.message };
  }

  const docId = emailToDocId(normalizedEmail);
  const passwordHash = hashPassword(password);

  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('users').doc(docId).update({
      passwordHash,
      mustSetPassword: false,
      passwordSetAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    const stored = memoryUsers.get(docId);
    if (stored) {
      stored.passwordHash = passwordHash;
      stored.mustSetPassword = false;
      stored.updatedAt = new Date().toISOString();
      memoryUsers.set(docId, stored);
    }
  }

  const session = await createSession(normalizedEmail);

  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('users').doc(docId).update({
      lastLoginAt: serverTimestamp(),
    });
  }

  return {
    success: true,
    token: session.token,
    email: normalizedEmail,
    expiresAt: session.expiresAt,
    message: 'Senha criada com sucesso!',
  };
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

  if (needsPasswordSetup(user)) {
    return {
      success: false,
      code: 'MUST_SET_PASSWORD',
      mustSetPassword: true,
      message: 'Primeiro acesso: crie sua senha antes de entrar.',
    };
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
  provisionUserAccess,
  dispatchWelcomeEmail,
  getFirstAccessStatus,
  setInitialPassword,
  loginUser,
  validateSession,
  getUserByEmail,
  buildWelcomeEmail,
  normalizeEmail,
};
