const { getDb, isFirebaseEnabled, serverTimestamp } = require('./firebase');

const PLANS = {
  comunidade_mensal: { amount: 47, billing: 'monthly', days: 30, label: 'Comunidade conectWM — Mensal' },
  comunidade: { amount: 47, billing: 'monthly', days: 30, label: 'Comunidade conectWM — Mensal' },
  comunidade_anual: { amount: 497, billing: 'annual', days: 365, label: 'Comunidade conectWM — Anual' },
};

const memoryOrders = new Map();
const memorySubscriptions = new Map();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function emailToDocId(email) {
  return normalizeEmail(email).replace(/\./g, '_dot_').replace(/@/g, '_at_');
}

function getPlan(type) {
  return PLANS[type] || PLANS.comunidade_mensal;
}

function generateTransactionId() {
  return 'tr_' + Math.random().toString(36).substring(2, 11).toUpperCase();
}

function generatePixCode(transactionId, amount) {
  return `00020126580014BR.GOV.BCB.PIX0136${transactionId}5204000053039865802BR5925CONECTWM ACADEMY6009SAO PAULO62070503***6304${String(amount).replace('.', '')}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function createOrder({ email, type, affiliateRef }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('E-mail inválido.');
  }

  const plan = getPlan(type);
  const transactionId = generateTransactionId();
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const pixCopyPaste = generatePixCode(transactionId, plan.amount);

  const orderData = {
    orderId,
    email: normalizedEmail,
    plan: type || 'comunidade_mensal',
    planLabel: plan.label,
    amount: plan.amount,
    currency: 'BRL',
    billing: plan.billing,
    status: 'pending',
    transactionId,
    pixCopyPaste,
    paymentMethod: null,
    affiliateRef: affiliateRef || null,
    createdAt: new Date().toISOString(),
    paidAt: null,
  };

  if (isFirebaseEnabled()) {
    const db = getDb();
    await db.collection('orders').doc(orderId).set({
      ...orderData,
      createdAt: serverTimestamp(),
      paidAt: null,
    });
  } else {
    memoryOrders.set(orderId, orderData);
  }

  return {
    orderId,
    transactionId,
    checkoutUrl: `/checkout-simulado.html?email=${encodeURIComponent(normalizedEmail)}&orderId=${orderId}&tr=${transactionId}&type=${encodeURIComponent(type || 'comunidade_mensal')}`,
    plan,
    pixCopyPaste,
    storage: isFirebaseEnabled() ? 'firebase' : 'memory',
  };
}

async function getOrder(orderId) {
  if (isFirebaseEnabled()) {
    const db = getDb();
    const snap = await db.collection('orders').doc(orderId).get();
    if (!snap.exists) return null;
    const data = snap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
      paidAt: data.paidAt?.toDate?.()?.toISOString?.() || data.paidAt,
    };
  }
  return memoryOrders.get(orderId) || null;
}

async function confirmPayment({ orderId, paymentMethod, cardLast4 }) {
  const order = await getOrder(orderId);
  if (!order) {
    throw new Error('Pedido não encontrado.');
  }
  if (order.status === 'paid') {
    return {
      alreadyPaid: true,
      order,
      subscription: await getSubscription(order.email),
      storage: isFirebaseEnabled() ? 'firebase' : 'memory',
    };
  }

  const plan = getPlan(order.plan);
  const paidAt = new Date();
  const expiresAt = addDays(paidAt, plan.days);

  const updatedOrder = {
    ...order,
    status: 'paid',
    paymentMethod: paymentMethod || 'pix',
    cardLast4: cardLast4 || null,
    paidAt: paidAt.toISOString(),
    simulatedPayment: true,
  };

  const subscriptionData = {
    email: order.email,
    plan: order.plan,
    planLabel: plan.label,
    status: 'active',
    amount: plan.amount,
    billing: plan.billing,
    orderId,
    transactionId: order.transactionId,
    startedAt: paidAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    updatedAt: paidAt.toISOString(),
  };

  if (isFirebaseEnabled()) {
    const db = getDb();
    const subDocId = emailToDocId(order.email);
    const batch = db.batch();

    batch.update(db.collection('orders').doc(orderId), {
      status: 'paid',
      paymentMethod: paymentMethod || 'pix',
      cardLast4: cardLast4 || null,
      paidAt: serverTimestamp(),
      simulatedPayment: true,
    });

    batch.set(db.collection('subscriptions').doc(subDocId), {
      ...subscriptionData,
      startedAt: serverTimestamp(),
      expiresAt: expiresAt,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    batch.set(db.collection('payments').doc(), {
      orderId,
      email: order.email,
      amount: plan.amount,
      currency: 'BRL',
      method: paymentMethod || 'pix',
      status: 'approved',
      transactionId: order.transactionId,
      simulated: true,
      createdAt: serverTimestamp(),
    });

    await batch.commit();
  } else {
    memoryOrders.set(orderId, updatedOrder);
    memorySubscriptions.set(emailToDocId(order.email), subscriptionData);
  }

  return {
    alreadyPaid: false,
    order: updatedOrder,
    subscription: subscriptionData,
    storage: isFirebaseEnabled() ? 'firebase' : 'memory',
  };
}

async function getSubscription(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  if (isFirebaseEnabled()) {
    const db = getDb();
    const snap = await db.collection('subscriptions').doc(emailToDocId(normalizedEmail)).get();
    if (!snap.exists) return null;
    const data = snap.data();
    const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
    const active = data.status === 'active' && expiresAt > new Date();
    return {
      ...data,
      email: normalizedEmail,
      active,
      expiresAt: expiresAt.toISOString(),
      startedAt: data.startedAt?.toDate?.()?.toISOString?.() || data.startedAt,
    };
  }

  const sub = memorySubscriptions.get(emailToDocId(normalizedEmail));
  if (!sub) return null;
  const active = sub.status === 'active' && new Date(sub.expiresAt) > new Date();
  return { ...sub, active };
}

module.exports = {
  PLANS,
  createOrder,
  getOrder,
  confirmPayment,
  getSubscription,
  normalizeEmail,
};
