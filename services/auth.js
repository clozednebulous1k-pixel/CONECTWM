const crypto = require('crypto');
const { getDb, isFirebaseEnabled, serverTimestamp } = require('./firebase');

const memoryUsers = new Map();
const memorySessions = new Map();
const memoryResetTokens = new Map();

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

/** E-mails admin (padrão + ADMIN_EMAILS no .env, separados por vírgula). */
const DEFAULT_ADMIN_EMAILS = ['clozednebulous1k@gmail.com'];

function getAdminEmails() {
  const fromEnv = String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => normalizeEmail(e))
    .filter(Boolean);
  return [...new Set([...DEFAULT_ADMIN_EMAILS, ...fromEnv])];
}

function isAdminEmail(email) {
  return getAdminEmails().includes(normalizeEmail(email));
}

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
    role: isAdminEmail(normalizedEmail) ? 'admin' : 'student',
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

function buildResetEmail({ email, resetUrl }) {
  return {
    to: email,
    subject: '🔐 Redefinir senha · conectWM Academy',
    body: `Olá!

Recebemos um pedido para redefinir a senha da sua conta na conectWM Academy.

📧 E-mail: ${email}

👉 Criar nova senha (link válido por 1 hora):
${resetUrl}

Se você não pediu isso, ignore este e-mail. Sua senha atual continua valendo.

Equipe conectWM`,
    resetUrl,
  };
}

async function saveResetToken(token, email) {
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  const payload = {
    email: normalizeEmail(email),
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('password_resets').doc(token).set({
      email: payload.email,
      expiresAt,
      createdAt: serverTimestamp(),
    });
  } else {
    memoryResetTokens.set(token, payload);
  }

  return expiresAt;
}

async function getResetTokenRecord(token) {
  if (!token) return null;

  if (isFirebaseEnabled()) {
    const db = getDb();
    const snap = await db.collection('password_resets').doc(token).get();
    if (!snap.exists) return null;
    const data = snap.data();
    const expires = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
    if (expires < new Date()) return null;
    return { email: data.email, expiresAt: expires.toISOString() };
  }

  const record = memoryResetTokens.get(token);
  if (!record) return null;
  if (new Date(record.expiresAt) < new Date()) {
    memoryResetTokens.delete(token);
    return null;
  }
  return record;
}

async function deleteResetToken(token) {
  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('password_resets').doc(token).delete();
  } else {
    memoryResetTokens.delete(token);
  }
}

async function dispatchResetEmail(resetEmail) {
  const webhookUrl = process.env.ACCESS_EMAIL_WEBHOOK_URL;
  const payload = {
    to: resetEmail.to,
    subject: resetEmail.subject,
    body: resetEmail.body,
    resetUrl: resetEmail.resetUrl,
    source: 'conectwm_password_reset',
  };

  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(`📧 Link de redefinição enviado para ${resetEmail.to}`);
      return { sent: true, channel: 'webhook' };
    } catch (err) {
      console.error('Erro ao enviar e-mail de reset:', err.message);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 REDEFINIR SENHA (simulado / log servidor)');
  console.log(`Para: ${resetEmail.to}`);
  console.log(`Link: ${resetEmail.resetUrl}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return { sent: false, channel: 'log' };
}

async function requestPasswordReset(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return {
      success: true,
      message: 'Se este e-mail estiver cadastrado, você receberá instruções para redefinir a senha.',
    };
  }

  const user = await getUserByEmail(normalizedEmail);

  if (!user || user.status !== 'active') {
    return {
      success: true,
      message: 'Se este e-mail estiver cadastrado, você receberá instruções para redefinir a senha.',
    };
  }

  if (needsPasswordSetup(user)) {
    return {
      success: true,
      code: 'FIRST_ACCESS',
      message: 'Esta conta ainda não tem senha definida. Digite seu e-mail e crie uma senha na tela de login.',
      email: normalizedEmail,
    };
  }

  const token = 'reset_' + crypto.randomBytes(24).toString('hex');
  await saveResetToken(token, normalizedEmail);

  const resetUrl = `${getAppUrl()}/login.html?reset=${encodeURIComponent(token)}`;
  const resetEmail = buildResetEmail({ email: normalizedEmail, resetUrl });
  await dispatchResetEmail(resetEmail);

  return {
    success: true,
    message: 'Se este e-mail estiver cadastrado, você receberá instruções para redefinir a senha.',
  };
}

async function resetPasswordWithToken({ token, password, passwordConfirm }) {
  const record = await getResetTokenRecord(token);
  if (!record) {
    return { success: false, message: 'Link inválido ou expirado. Solicite uma nova redefinição de senha.' };
  }

  const pwdCheck = validateNewPassword(password, passwordConfirm);
  if (!pwdCheck.valid) {
    return { success: false, message: pwdCheck.message };
  }

  const normalizedEmail = record.email;
  const user = await getUserByEmail(normalizedEmail);
  if (!user || user.status !== 'active') {
    return { success: false, message: 'Conta não encontrada ou inativa.' };
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
      stored.passwordSetAt = new Date().toISOString();
      stored.updatedAt = new Date().toISOString();
      memoryUsers.set(docId, stored);
    }
  }

  await deleteResetToken(token);

  const session = await createSession(normalizedEmail);

  return {
    success: true,
    message: 'Senha redefinida com sucesso!',
    token: session.token,
    email: normalizedEmail,
    expiresAt: session.expiresAt,
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

async function ensureAdminAccounts() {
  const checkoutService = require('./checkout');
  const emails = getAdminEmails();
  const results = [];

  for (const email of emails) {
    const docId = emailToDocId(email);
    let user = await getUserByEmail(email);

    if (!user) {
      await createUserAccess({
        email,
        orderId: 'admin_bootstrap',
        planLabel: 'Admin conectWM',
        channel: 'admin_bootstrap',
      });
      user = await getUserByEmail(email);
    }

    if (isFirebaseEnabled()) {
      const db = getDb();
      await db.collection('users').doc(docId).set({
        role: 'admin',
        status: 'active',
        planLabel: 'Admin conectWM',
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } else if (user) {
      user.role = 'admin';
      user.status = 'active';
      user.planLabel = 'Admin conectWM';
      memoryUsers.set(docId, user);
    }

    await checkoutService.ensureAdminSubscription(email);
    const refreshed = await getUserByEmail(email);
    results.push({
      email,
      mustSetPassword: needsPasswordSetup(refreshed),
      role: 'admin',
    });
    console.log(`👑 Admin pronto: ${email}${needsPasswordSetup(refreshed) ? ' (crie a senha no login)' : ''}`);
  }

  return results;
}

function getUserRole(user, email) {
  if (user?.role === 'admin' || isAdminEmail(email || user?.email)) return 'admin';
  return user?.role || 'student';
}

module.exports = {
  createUserAccess,
  provisionUserAccess,
  dispatchWelcomeEmail,
  getFirstAccessStatus,
  setInitialPassword,
  requestPasswordReset,
  resetPasswordWithToken,
  getResetTokenRecord,
  loginUser,
  validateSession,
  getUserByEmail,
  buildWelcomeEmail,
  normalizeEmail,
  getAdminEmails,
  isAdminEmail,
  ensureAdminAccounts,
  getUserRole,
};
