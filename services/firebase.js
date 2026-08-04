const admin = require('firebase-admin');

let db = null;
let enabled = false;
let lastInitError = null;

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
      if (json) {
        const serviceAccount = parseServiceAccountJson(json);
        if (!serviceAccount?.client_email || !serviceAccount?.private_key) {
          throw new Error('JSON da service account incompleto (client_email ou private_key).');
        }
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id || projectId,
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
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
  return {
    enabled: state.enabled,
    storage: state.enabled ? 'firebase' : 'memory',
    error: state.error || null,
    hasServiceAccountJson: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
    projectId: process.env.FIREBASE_PROJECT_ID || null,
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
