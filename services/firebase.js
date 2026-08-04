const admin = require('firebase-admin');

let db = null;
let enabled = false;
let lastInitError = null;

function normalizePrivateKey(raw) {
  if (!raw || typeof raw !== 'string') return null;

  let key = raw.trim();

  // Aspas extras da Vercel
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }

  // \n literal → quebra de linha real
  key = key.replace(/\\n/g, '\n');

  // Chave colada em uma linha só
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

function getPrivateKeyDiagnostics() {
  const raw = process.env.FIREBASE_PRIVATE_KEY || '';
  return {
    configured: Boolean(raw),
    length: raw.length,
    hasBeginMarker: raw.includes('BEGIN PRIVATE KEY'),
    hasEndMarker: raw.includes('END PRIVATE KEY'),
    hasNewlines: raw.includes('\n') || raw.includes('\\n'),
    normalizedOk: Boolean(normalizePrivateKey(raw)),
  };
}

function parseServiceAccountJson(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let text = raw.trim();

  // Vercel às vezes salva com aspas extras escapadas
  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      text = JSON.parse(text);
    } catch {
      // mantém text original
    }
  }

  const parsed = typeof text === 'string' ? JSON.parse(text) : text;
  if (parsed?.private_key && typeof parsed.private_key === 'string') {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }
  return parsed;
}

function initFirebase() {
  if (db) return { db, enabled, error: null };

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!json && !projectId) {
    lastInitError = 'FIREBASE_SERVICE_ACCOUNT_JSON não definida na Vercel';
    console.log('⚠️ Firebase não configurado — checkout usará armazenamento em memória (dev).');
    return { db: null, enabled: false, error: lastInitError };
  }

  try {
    if (admin.apps.length === 0) {
      let initialized = false;

      if (json) {
        try {
          const serviceAccount = parseServiceAccountJson(json);
          if (serviceAccount?.client_email && serviceAccount?.private_key) {
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              projectId: serviceAccount.project_id || projectId,
            });
            initialized = true;
          }
        } catch (jsonErr) {
          console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_JSON inválido, tentando variáveis separadas:', jsonErr.message);
        }
      }

      if (!initialized && projectId && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
        if (!privateKey) {
          throw new Error(
            'FIREBASE_PRIVATE_KEY inválida. Cole a chave completa com -----BEGIN PRIVATE KEY----- e -----END PRIVATE KEY-----.'
          );
        }
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL.trim(),
            privateKey,
          }),
        });
        initialized = true;
      }

      if (!initialized) {
        throw new Error(
          json
            ? 'JSON da service account inválido na Vercel. Use o arquivo .json em uma linha ou configure FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY.'
            : 'Configure FIREBASE_SERVICE_ACCOUNT_JSON ou FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY.'
        );
      }
    }
    db = admin.firestore();
    enabled = true;
    lastInitError = null;
    console.log('🔥 Firebase Firestore conectado com sucesso.');
  } catch (err) {
    lastInitError = err.message;
    console.error('❌ Erro ao conectar Firebase:', err.message);
    db = null;
    enabled = false;
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
  const state = initFirebase();
  const keyHint = getPrivateKeyDiagnostics();
  return {
    enabled: state.enabled,
    storage: state.enabled ? 'firebase' : 'memory',
    error: state.error || null,
    hasServiceAccountJson: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
    hasSplitCredentials: Boolean(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ),
    projectId: process.env.FIREBASE_PROJECT_ID || null,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      ? process.env.FIREBASE_CLIENT_EMAIL.replace(/(.{6}).*(@.*)/, '$1***$2')
      : null,
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
