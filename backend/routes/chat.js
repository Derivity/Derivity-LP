'use strict';

const express = require('express');
const { findBestMatch } = require('../utils/matcher');

const router = express.Router();

const FALLBACK_REPLY =
  "I don't have a specific answer for that yet. Try asking about topics like " +
  "stocks, SIPs, mutual funds, compounding, diversification, or what Derivity does.";

/**
 * POST /api/chat
 * Body: { "message": "what is derivity" }
 * Response: { "reply": "..." }
 */
router.post('/', (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Request body must contain a non-empty "message" string.' });
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({ error: '"message" cannot be blank.' });
  }

  if (trimmed.length > 500) {
    return res.status(400).json({ error: '"message" must be 500 characters or fewer.' });
  }

  const reply = findBestMatch(trimmed) || FALLBACK_REPLY;

  return res.json({ reply });
});

module.exports = router;
