'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { config } = require('./config');

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createTraceId() {
  return crypto.randomUUID();
}

function logAudit(record) {
  ensureParentDir(config.auditLogPath);
  const payload = {
    timestamp: new Date().toISOString(),
    ...record,
  };
  fs.appendFileSync(config.auditLogPath, `${JSON.stringify(payload)}\n`);
}

module.exports = {
  createTraceId,
  logAudit,
};
