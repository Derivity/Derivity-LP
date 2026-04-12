'use strict';

const { getMarketSnapshot } = require('./marketAdapter');
const { retrieve } = require('./retrievalStore');
const { cagr, futureValueSip, dcf, volatility } = require('./financeTools');

const TOOLS = {
  market_snapshot: async (args) => getMarketSnapshot(args),
  retrieve_docs: async (args) => retrieve(String(args?.query || ''), Number(args?.k || 3)),
  calc_cagr: async (args) => cagr(args),
  calc_sip_future_value: async (args) => futureValueSip(args),
  calc_dcf: async (args) => dcf(args),
  calc_volatility: async (args) => volatility(args?.returns || []),
};

function listTools() {
  return Object.keys(TOOLS);
}

async function runTool(name, args) {
  const fn = TOOLS[name];
  if (!fn) throw new Error(`Unknown tool: ${name}`);
  return fn(args || {});
}

module.exports = {
  listTools,
  runTool,
};
