'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const chatRouter = require('./routes/chat');
const faqRouter = require('./routes/faq');
const { config } = require('./services/config');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────

// CORS — allow all origins in development.
// In production, set ALLOWED_ORIGIN env var to restrict to your frontend domain.
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Parse JSON bodies (limit to 10 kb to prevent large payload attacks)
app.use(express.json({ limit: '10kb' }));

// ── Routes ─────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: config.appEnv,
    defaultModel: config.defaultModel,
  });
});

app.use('/api/chat', chatRouter);
app.use('/api/faq', faqRouter);

// ── 404 handler ────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// ── Global error handler ───────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start ──────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Derivity API server running on http://localhost:${PORT}`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/faq`);
  console.log(`  POST /api/chat`);
  console.log(`  POST /api/chat/finance/calc`);
  console.log(`  GET  /api/chat/market`);
  console.log(`  POST /api/chat/ingest`);
  console.log(`  GET  /api/chat/retrieve`);
});
