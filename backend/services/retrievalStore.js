'use strict';

const fs = require('fs');
const path = require('path');
const { config } = require('./config');

function ensureStore() {
  const dir = path.dirname(config.retrievalPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(config.retrievalPath)) fs.writeFileSync(config.retrievalPath, '[]');
}

function readDocs() {
  ensureStore();
  const raw = fs.readFileSync(config.retrievalPath, 'utf8');
  return JSON.parse(raw);
}

function writeDocs(docs) {
  ensureStore();
  fs.writeFileSync(config.retrievalPath, JSON.stringify(docs, null, 2));
}

function score(query, text) {
  const qTokens = query.toLowerCase().split(/\W+/).filter(Boolean);
  const t = text.toLowerCase();
  let s = 0;
  qTokens.forEach((token) => {
    if (t.includes(token)) s += 1;
  });
  return s;
}

function ingestDocument(doc) {
  const docs = readDocs();
  const id = `doc_${Date.now()}`;
  docs.push({ id, ...doc });
  writeDocs(docs);
  return id;
}

function retrieve(query, topK = 3) {
  const docs = readDocs();
  return docs
    .map((d) => ({ ...d, _score: score(query, `${d.title || ''} ${d.content || ''}`) }))
    .filter((d) => d._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, topK);
}

module.exports = {
  ingestDocument,
  retrieve,
};
