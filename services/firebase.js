const crypto = require('crypto');
const admin = require('firebase-admin');

let db = null;
let enabled = false;
let lastInitError = null;
let lastInitStep = null;

function normalizePrivateKey(raw) {
  if (!raw || typeof raw !== 'string') return null;

  let key = raw.trim();

  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }

  key = key.replace(/\\n/g, '\n').replace(/\r/g, '');

  if (!key.includes('\n') && key.includes('-----BEGIN PRIVATE KEY-----')) {
    key = key
      .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
      .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n')
      .trim();
  }

  if (!key.includes('-----BEGIN PRIVATE KEY-----') || !key.includes('-----END PRIVATE KEY-----')) {
    return null;
  }

  return key;
}

function validatePemPrivateKey(pem) {
  try {
    crypto.createPrivateKey(pem);
    return { valid: true, error: null };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

function getPrivateKeyDiagnostics() {
  const raw = process.env.FIREBASE_PRIVATE_KEY || '';
  const normalized = normalizePrivateKey(raw);
  const pemCheck = normalized ? validatePemPrivateKey(normalized) : { valid: false, error: 'normalize_failed' };

  return {
    configured: Boolean(raw),
    length: raw.length,
    hasBeginMarker: raw.includes('BEGIN PRIVATE KEY'),
    hasEndMarker: raw.includes('END PRIVATE KEY'),
    hasNewlines: raw.includes('\n') || raw.includes('\\n'),
    normalizedOk: Boolean(normalized),
    pemCryptoValid: pemCheck.valid,
    pemError: pemCheck.error,
  };
}

function parseServiceAccountJson(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let text = raw.trim();

  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      text = JSON.parse(text);
    } catch {
      // mantém text original
    }
  }

  const parsed = typeof text === 'string' ? JSON.parse(text) : text;
  if (parsed?.private_key && typeof parsed.private_key === 'string') {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n').replace(/\r/g, '');
  }
  return parsed;
}

function buildServiceAccountFromEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY || '');

  if (!projectId || !clientEmail || !privateKey) return null;

  if (!clientEmail.includes('@') || !clientEmail.endsWith('.iam.gserviceaccount.com')) {
    throw new Error(
      'FIREBASE_CLIENT_EMAIL inválido. Deve ser algo como firebase-adminsdk-xxxxx@conectwm.iam.gserviceaccount.com'
    );
  }

  const pemCheck = validatePemPrivateKey(privateKey);
  if (!pemCheck.valid) {
    throw new Error(`FIREBASE_PRIVATE_KEY rejeitada pelo Node crypto: ${pemCheck.error}`);
  }

  return {
    type: 'service_account',
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey,
  };
}

function resetFirebaseApps() {
  // Evita delete() assíncrono que pode quebrar cold starts na Vercel
  db = null;
  enabled = false;
}

function initFirebase() {
  if (db) return { db, enabled, error: null };

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();

  if (!json && !projectId) {
    lastInitError = 'Configure FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY na Vercel.';
    console.log('⚠️ Firebase não configurado — checkout usará armazenamento em memória (dev).');
    return { db: null, enabled: false, error: lastInitError };
  }

  try {
    lastInitStep = 'initializeApp';

    if (admin.apps.length === 0) {
      let serviceAccount = null;

      if (json) {
        try {
          serviceAccount = parseServiceAccountJson(json);
        } catch (jsonErr) {
          console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_JSON inválido:', jsonErr.message);
        }
      }

      if (!serviceAccount?.client_email || !serviceAccount?.private_key) {
        serviceAccount = buildServiceAccountFromEnv();
      }

      if (!serviceAccount) {
        throw new Error('Credenciais Firebase incompletas. Verifique PROJECT_ID, CLIENT_EMAIL e PRIVATE_KEY.');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
      });
    }

    lastInitStep = 'firestore';
    const app = admin.apps[0] || admin.app();
    db = admin.firestore(app);
    enabled = true;
    lastInitError = null;
    console.log('🔥 Firebase Firestore conectado com sucesso.');
  } catch (err) {
    lastInitError = `${lastInitStep}: ${err.message}`;
    console.error('❌ Erro ao conectar Firebase:', lastInitError);
    db = null;
    enabled = false;
    resetFirebaseApps();
  }

  return { db, enabled, error: lastInitError };
}

function getDb() {
  if (!db) initFirebase();
  return db;
}

function isFirebaseEnabled() {
  if (!db) initFirebase();
  return enabled;
}

function getFirebaseStatus() {
  const keyHint = getPrivateKeyDiagnostics();
  const state = initFirebase();

  return {
    enabled: state.enabled,
    storage: state.enabled ? 'firebase' : 'memory',
    error: state.error || null,
    initStep: lastInitStep,
    hasServiceAccountJson: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
    hasSplitCredentials: Boolean(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ),
    projectId: process.env.FIREBASE_PROJECT_ID?.trim() || null,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      ? process.env.FIREBASE_CLIENT_EMAIL.trim().replace(/(.{6}).*(@.*)/, '$1***$2')
      : null,
    clientEmailLooksValid: Boolean(
      process.env.FIREBASE_CLIENT_EMAIL?.includes('@') &&
      process.env.FIREBASE_CLIENT_EMAIL?.endsWith('.iam.gserviceaccount.com')
    ),
    privateKeyHint: keyHint,
  };
}

function serverTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

module.exports = {
  initFirebase,
  getDb,
  isFirebaseEnabled,
  getFirebaseStatus,
  serverTimestamp,
  admin,
};
