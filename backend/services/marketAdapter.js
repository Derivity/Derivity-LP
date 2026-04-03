'use strict';

const { config } = require('./config');

const cache = new Map();

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Market request failed with ${response.status}`);
  }
  return response.json();
}

function parseIntentSymbol(query = '') {
  const upper = query.toUpperCase();
  const stock = upper.match(/\b[A-Z]{2,5}\b/);
  const forex = upper.match(/\b[A-Z]{3}\/[A-Z]{3}\b/);
  const btc = upper.includes('BTC');
  const eth = upper.includes('ETH');

  if (forex) return { type: 'forex', symbol: forex[0] };
  if (btc) return { type: 'crypto', symbol: 'bitcoin' };
  if (eth) return { type: 'crypto', symbol: 'ethereum' };
  if (stock) return { type: 'stock', symbol: stock[0] };
  return null;
}

async function fetchCryptoSnapshot(id) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
    id
  )}&vs_currencies=usd&include_24hr_change=true`;
  const data = await fetchJson(url);
  const row = data[id];
  if (!row) throw new Error('Crypto symbol not available');
  return {
    assetType: 'crypto',
    symbol: id,
    price: row.usd,
    change24hPct: row.usd_24h_change,
    currency: 'USD',
  };
}

async function fetchForexSnapshot(pair) {
  const [base, quote] = pair.split('/');
  const url = `https://api.exchangerate.host/convert?from=${base}&to=${quote}`;
  const data = await fetchJson(url);
  return {
    assetType: 'forex',
    symbol: pair,
    price: data.result,
    currency: quote,
  };
}

async function fetchStockSnapshot(symbol) {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
  const data = await fetchJson(url);
  const row = data?.quoteResponse?.result?.[0];
  if (!row) throw new Error('Stock symbol not available');
  return {
    assetType: 'stock',
    symbol: row.symbol,
    price: row.regularMarketPrice,
    change24hPct: row.regularMarketChangePercent,
    currency: row.currency || 'USD',
    exchange: row.fullExchangeName,
  };
}

async function getMarketSnapshot(intent) {
  if (!intent) return null;
  const key = `${intent.type}:${intent.symbol}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < config.marketCacheTtlMs) {
    return { ...cached.data, cached: true };
  }

  let data;
  if (intent.type === 'crypto') data = await fetchCryptoSnapshot(intent.symbol);
  else if (intent.type === 'forex') data = await fetchForexSnapshot(intent.symbol);
  else data = await fetchStockSnapshot(intent.symbol);

  cache.set(key, { data, at: Date.now() });
  return { ...data, cached: false };
}

module.exports = {
  parseIntentSymbol,
  getMarketSnapshot,
};
