const checkoutService = require('./checkout');
const authService = require('./auth');

const APPROVED_EVENTS = new Set([
  'PURCHASE_COMPLETE',
  'PURCHASE_APPROVED',
  'purchase.complete',
  'purchase.approved',
]);

const CANCEL_EVENTS = new Set([
  'PURCHASE_CANCELED',
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'PURCHASE_EXPIRED',
  'SUBSCRIPTION_CANCELLATION',
  'purchase.canceled',
  'purchase.refunded',
  'purchase.chargeback',
  'subscription.cancellation',
]);

const APPROVED_STATUSES = new Set(['APPROVED', 'COMPLETE', 'COMPLETED', 'approved', 'complete']);

function verifyHotmartToken(headers, body) {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected) return true;

  const headerToken = headers['x-hotmart-hottok'] || headers['X-Hotmart-Hottok'];
  const bodyToken = body?.hottok || body?.data?.hottok;
  return headerToken === expected || bodyToken === expected;
}

function normalizeHotmartPayload(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const event = raw.event || raw.event_name || raw.status || '';
  const data = raw.data || raw;

  const buyer = data.buyer || raw.buyer || {};
  const purchase = data.purchase || raw.purchase || {};
  const product = data.product || raw.product || {};
  const subscription = data.subscription || raw.subscription || null;

  const email = buyer.email || raw.email || data.email;
  const transactionId = purchase.transaction || raw.transaction || data.transaction || raw.id;
  const status = purchase.status || raw.purchase_status || data.status;
  const priceObj = purchase.price || purchase.full_price || raw.price || {};
  const amount = priceObj.value ?? priceObj ?? raw.price ?? null;
  const currency = priceObj.currency_value || priceObj.currency || 'BRL';
  const paymentMethod = purchase.payment?.type || raw.payment_type || 'hotmart';

  return {
    event,
    eventId: raw.id || `${event}_${transactionId || Date.now()}`,
    email,
    buyerName: buyer.name || null,
    transactionId,
    status,
    amount,
    currency,
    paymentMethod,
    productId: product.id || raw.product_id || null,
    productName: product.name || raw.product_name || 'COMUCONECT',
    subscription,
    affiliate: data.affiliate || raw.affiliate || null,
    raw,
  };
}

function isApprovedPurchase(parsed) {
  if (!parsed?.email) return false;
  if (APPROVED_EVENTS.has(parsed.event)) return true;
  if (APPROVED_STATUSES.has(String(parsed.status || '').toUpperCase())) return true;
  return false;
}

function isCancelEvent(parsed) {
  return CANCEL_EVENTS.has(parsed.event);
}

function getBillingDays(parsed) {
  const sub = parsed.subscription;
  if (sub?.plan?.periodicity) {
    const p = String(sub.plan.periodicity).toUpperCase();
    if (p.includes('YEAR') || p.includes('ANNUAL')) return 365;
    if (p.includes('WEEK')) return 7;
  }
  const amount = Number(parsed.amount);
  if (amount >= 200) return 365;
  return 30;
}

async function handleHotmartWebhook(rawBody, headers = {}, options = {}) {
  if (!options.skipTokenVerify && !verifyHotmartToken(headers, rawBody)) {
    const err = new Error('Token Hotmart inválido.');
    err.statusCode = 401;
    throw err;
  }

  const parsed = normalizeHotmartPayload(rawBody);
  if (!parsed) {
    return { ok: true, action: 'ignored', reason: 'payload_invalido' };
  }

  const productFilter = process.env.HOTMART_PRODUCT_ID;
  if (productFilter && parsed.productId && String(parsed.productId) !== String(productFilter)) {
    return { ok: true, action: 'ignored', reason: 'produto_diferente', productId: parsed.productId };
  }

  console.log(`\n🔔 Hotmart webhook: ${parsed.event} | ${parsed.email || 'sem email'} | tx: ${parsed.transactionId || '—'}`);

  if (isCancelEvent(parsed)) {
    if (!parsed.email) {
      return { ok: true, action: 'ignored', reason: 'cancelamento_sem_email' };
    }
    await checkoutService.deactivateSubscription(parsed.email, parsed.event);
    return { ok: true, action: 'subscription_deactivated', email: parsed.email };
  }

  if (!isApprovedPurchase(parsed)) {
    return { ok: true, action: 'ignored', reason: 'evento_nao_aprovado', event: parsed.event, status: parsed.status };
  }

  const activation = await checkoutService.activateFromHotmartPayment({
    email: parsed.email,
    transactionId: parsed.transactionId,
    hotmartEventId: parsed.eventId,
    productId: parsed.productId,
    productName: parsed.productName,
    amount: parsed.amount,
    currency: parsed.currency,
    paymentMethod: parsed.paymentMethod,
    billingDays: getBillingDays(parsed),
    planLabel: `Comunidade conectWM — ${parsed.productName || 'Hotmart'}`,
    affiliateRef: parsed.affiliate?.code || null,
  });

  if (activation.duplicate) {
    return {
      ok: true,
      action: 'duplicate',
      email: parsed.email,
      subscription: activation.subscription,
    };
  }

  const credentials = await authService.provisionUserAccess({
    email: parsed.email,
    orderId: activation.order?.orderId,
    planLabel: activation.subscription?.planLabel,
    expiresAt: activation.subscription?.expiresAt,
    channel: 'hotmart_webhook',
  });

  const emailDispatch = await authService.dispatchWelcomeEmail(
    credentials.welcomeEmail,
    credentials.password
  );

  return {
    ok: true,
    action: credentials.existingAccount ? 'access_existing' : 'access_created',
    email: parsed.email,
    transactionId: parsed.transactionId,
    subscription: activation.subscription,
    credentials: credentials.existingAccount
      ? { email: credentials.email, existingAccount: true, emailChannel: emailDispatch.channel }
      : {
          email: credentials.email,
          mustSetPassword: true,
          emailChannel: emailDispatch.channel,
        },
    storage: activation.storage,
  };
}

async function simulateHotmartPurchase(email) {
  const fakePayload = {
    id: `SIM_${Date.now()}`,
    event: 'PURCHASE_COMPLETE',
    version: '2.0.0',
    data: {
      product: { id: process.env.HOTMART_PRODUCT_ID || 0, name: 'COMUCONECT' },
      purchase: {
        transaction: `HP_SIM_${Date.now()}`,
        status: 'APPROVED',
        price: { value: 39.99, currency_value: 'BRL' },
        payment: { type: 'CREDIT_CARD', installments_number: 1 },
      },
      buyer: { name: 'Simulação', email },
    },
  };
  return handleHotmartWebhook(fakePayload, {}, { skipTokenVerify: true });
}

module.exports = {
  handleHotmartWebhook,
  simulateHotmartPurchase,
  normalizeHotmartPayload,
  verifyHotmartToken,
};
