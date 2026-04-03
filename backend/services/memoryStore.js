'use strict';

const { config } = require('./config');

class MemoryStore {
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

const memoryStore = new MemoryStore();

module.exports = { memoryStore };
