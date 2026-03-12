'use strict';

const knowledge = require('../data/knowledge.json');

function normalise(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenise(text) {
  return normalise(text).split(' ').filter(Boolean);
}

function tokenOverlapScore(queryTokens, candidateTokens) {
  const candidateSet = new Set(candidateTokens);
  return queryTokens.reduce((count, token) => {
    return count + (candidateSet.has(token) ? 1 : 0);
  }, 0);
}

function bigramSimilarity(a, b) {
  if (!a || !b) return 0;

  const getBigrams = (str) => {
    const bigrams = new Set();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.slice(i, i + 2));
    }
    return bigrams;
  };

  const bigramsA = getBigrams(a);
  const bigramsB = getBigrams(b);
  let intersection = 0;
  bigramsA.forEach((bg) => {
    if (bigramsB.has(bg)) intersection++;
  });

  return (2 * intersection) / (bigramsA.size + bigramsB.size);
}

function findBestMatch(message) {
  const normalisedQuery = normalise(message);
  const queryTokens = tokenise(message);
  const entries = Object.entries(knowledge);

  if (knowledge[normalisedQuery] !== undefined) {
    return knowledge[normalisedQuery];
  }

  for (const [key, answer] of entries) {
    const normKey = normalise(key);
    if (normKey.includes(normalisedQuery) || normalisedQuery.includes(normKey)) {
      return answer;
    }
  }

  let bestBigram = null;
  let bestBigramScore = 0.35;

  for (const [key, answer] of entries) {
    const score = bigramSimilarity(normalisedQuery, normalise(key));
    if (score > bestBigramScore) {
      bestBigramScore = score;
      bestBigram = answer;
    }
  }

  if (bestBigram) return bestBigram;

  let bestOverlap = null;
  let bestOverlapScore = 0;
  const minRequired = Math.max(1, Math.ceil(queryTokens.length * 0.5));

  for (const [key, answer] of entries) {
    const candidateTokens = tokenise(key);
    const score = tokenOverlapScore(queryTokens, candidateTokens);
    if (score >= minRequired && score > bestOverlapScore) {
      bestOverlapScore = score;
      bestOverlap = answer;
    }
  }

  return bestOverlap;
}

module.exports = { findBestMatch };
