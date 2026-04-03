'use strict';

function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function cagr({ startValue, endValue, years }) {
  if (startValue <= 0 || endValue <= 0 || years <= 0) {
    throw new Error('CAGR requires positive start/end values and years.');
  }
  return round((endValue / startValue) ** (1 / years) - 1, 6);
}

function futureValueSip({ monthlyContribution, annualRate, years }) {
  const r = annualRate / 12;
  const n = years * 12;
  if (n <= 0) throw new Error('Years must be positive.');
  if (r === 0) return round(monthlyContribution * n, 2);
  const fv = monthlyContribution * (((1 + r) ** n - 1) / r) * (1 + r);
  return round(fv, 2);
}

function dcf({ cashFlows, discountRate, terminalGrowthRate }) {
  if (!Array.isArray(cashFlows) || cashFlows.length === 0) {
    throw new Error('DCF requires a non-empty cashFlows array.');
  }
  if (discountRate <= terminalGrowthRate) {
    throw new Error('Discount rate must be greater than terminal growth rate.');
  }

  let pv = 0;
  cashFlows.forEach((cf, i) => {
    pv += cf / (1 + discountRate) ** (i + 1);
  });

  const last = cashFlows[cashFlows.length - 1];
  const terminalValue = (last * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
  const pvTerminal = terminalValue / (1 + discountRate) ** cashFlows.length;
  return round(pv + pvTerminal, 2);
}

function volatility(returns) {
  if (!Array.isArray(returns) || returns.length < 2) {
    throw new Error('Volatility requires at least 2 returns.');
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (returns.length - 1);
  return round(Math.sqrt(variance), 6);
}

function calculateFromText(message) {
  const text = message.toLowerCase();
  if (text.includes('sip') && text.includes('future')) {
    return {
      tool: 'futureValueSip',
      note: 'Send structured payload to /api/finance/calc for exact calculation.',
    };
  }
  return null;
}

module.exports = {
  cagr,
  futureValueSip,
  dcf,
  volatility,
  calculateFromText,
};
