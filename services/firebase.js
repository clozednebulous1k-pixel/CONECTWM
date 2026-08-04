const admin = require('firebase-admin');

let db = null;
let enabled = false;

function initFirebase() {
  if (db) return { db, enabled };

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!json && !projectId) {
    console.log('⚠️ Firebase não configurado — checkout usará armazenamento em memória (dev).');
    return { db: null, enabled: false };
  }

  try {
    if (admin.apps.length === 0) {
      if (json) {
        const serviceAccount = JSON.parse(json);
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
    console.log('🔥 Firebase Firestore conectado com sucesso.');
  } catch (err) {
    console.error('❌ Erro ao conectar Firebase:', err.message);
    db = null;
    enabled = false;
  }

  return { db, enabled };
}

function getDb() {
  if (!db) initFirebase();
  return db;
}

function isFirebaseEnabled() {
  if (!db) initFirebase();
  return enabled;
}

function serverTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

module.exports = {
  initFirebase,
  getDb,
  isFirebaseEnabled,
  serverTimestamp,
  admin,
};
