'use strict';

const { config } = require('../services/config');

const buckets = new Map();

function getIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || 'unknown';
}

function authGuard(req, res, next) {
  if (!config.apiKey) return next();
  const provided = req.header('x-api-key') || '';
  if (provided !== config.apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}

function rateLimitGuard(req, res, next) {
  const key = getIp(req);
  const now = Date.now();
  const existing = buckets.get(key) || { count: 0, resetAt: now + config.rateLimitWindowMs };
  if (now > existing.resetAt) {
    existing.count = 0;
    existing.resetAt = now + config.rateLimitWindowMs;
  }
  existing.count += 1;
  buckets.set(key, existing);
  if (existing.count > config.rateLimitMax) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfterMs: Math.max(0, existing.resetAt - now),
    });
  }
  return next();
}

function requestSizeGuard(req, res, next) {
  if (typeof req.body?.message === 'string' && req.body.message.length > 5000) {
    return res.status(400).json({ error: 'message too long' });
  }
  if (Array.isArray(req.body?.messages) && req.body.messages.length > 40) {
    return res.status(400).json({ error: 'messages too long' });
  }
  return next();
}

module.exports = {
  authGuard,
  rateLimitGuard,
  requestSizeGuard,
};
