'use strict';

const express = require('express');
const { runFinanceQuery } = require('../services/orchestrator');
const { cagr, futureValueSip, dcf, volatility } = require('../services/financeTools');
const { ingestDocument, retrieve } = require('../services/retrievalStore');
const { parseIntentSymbol, getMarketSnapshot } = require('../services/marketAdapter');

const router = express.Router();

/**
 * POST /api/chat
 * Body:
 *  - { "message": "what is derivity" }
 *  - { "messages": [{ role, content, reasoning_details? }, ...] }
 * Response: { "reply": "...", "assistantMessage": {...}, "model": "..." }
 */
router.post('/', async (req, res) => {
  try {
    const sessionId = req.header('x-session-id') || req.body?.sessionId || 'default-session';
    const result = await runFinanceQuery({ body: req.body || {}, sessionId });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: 'Failed to process finance intelligence query.',
      details: error.message,
    });
  }
});

router.post('/finance/calc', (req, res) => {
  const { type, payload } = req.body || {};
  try {
    if (type === 'cagr') return res.json({ type, result: cagr(payload) });
    if (type === 'sip_future_value') return res.json({ type, result: futureValueSip(payload) });
    if (type === 'dcf') return res.json({ type, result: dcf(payload) });
    if (type === 'volatility') return res.json({ type, result: volatility(payload?.returns) });
    return res.status(400).json({ error: 'Unknown calc type.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/market', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const type = String(req.query.type || '').trim();
  const symbol = String(req.query.symbol || '').trim();

  const intent = type && symbol ? { type, symbol } : parseIntentSymbol(q);
  if (!intent) {
    return res.status(400).json({ error: 'Provide ?q=... or ?type=...&symbol=...' });
  }

  try {
    const snapshot = await getMarketSnapshot(intent);
    return res.json({ intent, snapshot });
  } catch (error) {
    return res.status(502).json({ error: 'Market provider failed.', details: error.message });
  }
});

router.post('/ingest', (req, res) => {
  const { title, content, source } = req.body || {};
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: '"content" is required.' });
  }
  const id = ingestDocument({ title: title || 'Untitled', content, source: source || 'manual' });
  return res.json({ id, ok: true });
});

router.get('/retrieve', (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Provide ?q=...' });
  const hits = retrieve(q, Number(req.query.k || 3));
  return res.json({ count: hits.length, hits });
});

module.exports = router;
