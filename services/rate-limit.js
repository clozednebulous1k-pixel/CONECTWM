/**
 * Rate limiting em memória · protege APIs, chat e banco (Firebase)
 * Em produção com múltiplas instâncias, prefira Redis (Upstash) compartilhado.
 */

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function createRateLimiter(options = {}) {
  const {
    windowMs = 60_000,
    max = 60,
    message = 'Muitas requisições. Aguarde um momento e tente novamente.',
    keyGenerator = (req) => getClientIp(req),
    skip = () => false,
  } = options;

  const hits = new Map();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits.entries()) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, Math.max(windowMs, 60_000));

  if (typeof cleanup.unref === 'function') cleanup.unref();

  return (req, res, next) => {
    if (skip(req)) return next();

    const key = keyGenerator(req);
    const now = Date.now();
    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    const remaining = Math.max(0, max - entry.count);
    const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      res.setHeader('Retry-After', String(retryAfterSec));
      return res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSec,
      });
    }

    return next();
  };
}

const limiters = {
  chat: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Limite do chat atingido. Aguarde alguns minutos antes de enviar novas mensagens.',
  }),
  authLogin: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 12,
    message: 'Muitas tentativas de login. Aguarde 15 minutos e tente novamente.',
  }),
  authPassword: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 8,
    message: 'Muitas tentativas de alteração de senha. Tente novamente mais tarde.',
  }),
  certificatesWrite: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 40,
    message: 'Muitas atualizações de certificado. Aguarde antes de sincronizar novamente.',
  }),
  certificatesIssue: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 15,
    message: 'Limite de emissão de certificados atingido. Tente novamente em breve.',
  }),
  certificatesVerify: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 80,
    message: 'Muitas verificações seguidas. Aguarde um momento.',
  }),
  forms: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Limite de envios do formulário atingido. Tente novamente mais tarde.',
  }),
  checkout: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 15,
    message: 'Muitas tentativas de checkout. Aguarde antes de tentar novamente.',
  }),
  apiGeneral: createRateLimiter({
    windowMs: 60 * 1000,
    max: 120,
    message: 'Tráfego elevado detectado. Aguarde alguns segundos.',
    skip: (req) => !req.path.startsWith('/api/'),
  }),
};

function validateChatPayload(req, res, next) {
  const { messages } = req.body || {};
  const MAX_MESSAGES = 12;
  const MAX_MSG_CHARS = 800;
  const MAX_TOTAL_CHARS = 6000;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'A lista de mensagens está vazia ou é inválida.',
    });
  }

  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({
      success: false,
      message: `Histórico muito longo. Envie no máximo ${MAX_MESSAGES} mensagens por requisição.`,
    });
  }

  let totalChars = 0;
  for (const msg of messages) {
    if (!msg || typeof msg.content !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Formato de mensagem inválido.',
      });
    }
    const role = msg.role;
    if (role !== 'user' && role !== 'assistant' && role !== 'system') {
      return res.status(400).json({
        success: false,
        message: 'Papel de mensagem inválido.',
      });
    }
    const len = msg.content.length;
    if (len > MAX_MSG_CHARS) {
      return res.status(400).json({
        success: false,
        message: `Mensagem muito longa (máx. ${MAX_MSG_CHARS} caracteres).`,
      });
    }
    totalChars += len;
  }

  if (totalChars > MAX_TOTAL_CHARS) {
    return res.status(400).json({
      success: false,
      message: 'Payload do chat excede o tamanho permitido.',
    });
  }

  req.body.messages = messages.slice(-MAX_MESSAGES);
  return next();
}

module.exports = {
  createRateLimiter,
  getClientIp,
  limiters,
  validateChatPayload,
};
