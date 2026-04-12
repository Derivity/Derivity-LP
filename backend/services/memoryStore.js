'use strict';

const { config } = require('./config');
let pg;
let createClient;
try {
  ({ Client: pg } = require('pg'));
} catch (_error) {}
try {
  ({ createClient } = require('redis'));
} catch (_error) {}

class InMemoryStore {
  constructor() {
    this.sessions = new Map();
  }

  getSession(sessionId) {
    if (!sessionId) return [];
    const existing = this.sessions.get(sessionId);
    if (!existing) return [];
    if (Date.now() - existing.updatedAt > config.memoryTtlMs) {
      this.sessions.delete(sessionId);
      return [];
    }
    return existing.messages;
  }

  append(sessionId, messages) {
    if (!sessionId || !Array.isArray(messages) || messages.length === 0) return;
    const current = this.getSession(sessionId);
    const merged = [...current, ...messages].slice(-config.memoryMaxTurns);
    this.sessions.set(sessionId, { messages: merged, updatedAt: Date.now() });
  }
}

class RedisStore {
  constructor() {
    this.client = null;
  }

  async init() {
    if (!createClient || !config.redisUrl) return false;
    this.client = createClient({ url: config.redisUrl });
    this.client.on('error', () => {});
    await this.client.connect();
    return true;
  }

  async getSession(sessionId) {
    if (!sessionId || !this.client) return [];
    const raw = await this.client.get(`session:${sessionId}`);
    return raw ? JSON.parse(raw) : [];
  }

  async append(sessionId, messages) {
    if (!sessionId || !this.client) return;
    const current = await this.getSession(sessionId);
    const merged = [...current, ...messages].slice(-config.memoryMaxTurns);
    await this.client.set(`session:${sessionId}`, JSON.stringify(merged), {
      PX: config.memoryTtlMs,
    });
  }
}

class PostgresStore {
  constructor() {
    this.client = null;
  }

  async init() {
    if (!pg || !config.postgresUrl) return false;
    this.client = new pg({ connectionString: config.postgresUrl });
    await this.client.connect();
    await this.client.query(
      'CREATE TABLE IF NOT EXISTS chat_sessions (session_id TEXT PRIMARY KEY, payload JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())'
    );
    return true;
  }

  async getSession(sessionId) {
    if (!sessionId || !this.client) return [];
    const result = await this.client.query('SELECT payload FROM chat_sessions WHERE session_id=$1', [sessionId]);
    return result.rows[0]?.payload || [];
  }

  async append(sessionId, messages) {
    if (!sessionId || !this.client) return;
    const current = await this.getSession(sessionId);
    const merged = [...current, ...messages].slice(-config.memoryMaxTurns);
    await this.client.query(
      'INSERT INTO chat_sessions(session_id, payload, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (session_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()',
      [sessionId, JSON.stringify(merged)]
    );
  }
}

const inMemory = new InMemoryStore();
let activeStore = inMemory;

async function initMemoryStore() {
  if (config.memoryBackend === 'redis') {
    const redisStore = new RedisStore();
    if (await redisStore.init().catch(() => false)) activeStore = redisStore;
    return;
  }
  if (config.memoryBackend === 'postgres') {
    const postgresStore = new PostgresStore();
    if (await postgresStore.init().catch(() => false)) activeStore = postgresStore;
  }
}

const memoryStore = {
  getSession: async (sessionId) => activeStore.getSession(sessionId),
  append: async (sessionId, messages) => activeStore.append(sessionId, messages),
};

module.exports = { memoryStore, initMemoryStore };
