'use strict';

const path = require('path');

const config = {
  appEnv: process.env.NODE_ENV || 'development',
  defaultModel: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
  backupModel: process.env.OPENROUTER_BACKUP_MODEL || 'openai/gpt-4o-mini',
  llmTimeoutMs: Number(process.env.OPENROUTER_TIMEOUT_MS || 30000),
  openRouterApiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openRouterReferer: process.env.OPENROUTER_REFERER || '',
  openRouterTitle: process.env.OPENROUTER_TITLE || 'Derivity Finance Intelligence',
  memoryTtlMs: Number(process.env.MEMORY_TTL_MS || 30 * 60 * 1000),
  memoryMaxTurns: Number(process.env.MEMORY_MAX_TURNS || 24),
  marketCacheTtlMs: Number(process.env.MARKET_CACHE_TTL_MS || 60 * 1000),
  retrievalPath: process.env.RETRIEVAL_STORE_PATH || path.join(process.cwd(), 'data', 'documents.json'),
  auditLogPath: process.env.AUDIT_LOG_PATH || path.join(process.cwd(), 'data', 'audit.log'),
};

module.exports = { config };
