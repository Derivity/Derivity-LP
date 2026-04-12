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
  memoryBackend: process.env.MEMORY_BACKEND || 'memory',
  redisUrl: process.env.REDIS_URL || '',
  postgresUrl: process.env.POSTGRES_URL || '',
  marketCacheTtlMs: Number(process.env.MARKET_CACHE_TTL_MS || 60 * 1000),
  retrievalPath: process.env.RETRIEVAL_STORE_PATH || path.join(process.cwd(), 'data', 'documents.json'),
  auditLogPath: process.env.AUDIT_LOG_PATH || path.join(process.cwd(), 'data', 'audit.log'),
  apiKey: process.env.DERIVITY_API_KEY || '',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 90),
  retrievalTopK: Number(process.env.RETRIEVAL_TOP_K || 4),
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS || 256),
};

module.exports = { config };
