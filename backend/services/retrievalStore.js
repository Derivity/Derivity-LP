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

function tokenize(text) {
  return String(text || '').toLowerCase().split(/\W+/).filter(Boolean);
}

function embedText(text) {
  const vec = new Float32Array(config.embeddingDimensions);
  const tokens = tokenize(text);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let hash = 2166136261;
    for (let j = 0; j < token.length; j++) {
      hash ^= token.charCodeAt(j);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    const idx = Math.abs(hash) % vec.length;
    vec[idx] += 1;
  }
  const norm = Math.sqrt(vec.reduce((acc, x) => acc + x * x, 0)) || 1;
  return Array.from(vec, (x) => x / norm);
}

function cosineSimilarity(a, b) {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot;
}

function ingestDocument(doc) {
  const docs = readDocs();
  const id = `doc_${Date.now()}`;
  const text = `${doc.title || ''} ${doc.content || ''}`;
  docs.push({ id, ...doc, embedding: embedText(text) });
  writeDocs(docs);
  return id;
}

function retrieve(query, topK = 3) {
  const docs = readDocs();
  const queryEmbedding = embedText(query);
  return docs
    .map((d) => {
      const embedding = Array.isArray(d.embedding)
        ? d.embedding
        : embedText(`${d.title || ''} ${d.content || ''}`);
      return { ...d, embedding, _score: cosineSimilarity(queryEmbedding, embedding) };
    })
    .filter((d) => d._score > 0.05)
    .sort((a, b) => b._score - a._score)
    .slice(0, topK);
}

module.exports = {
  ingestDocument,
  retrieve,
};
