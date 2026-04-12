'use strict';

const { cagr, futureValueSip, dcf, volatility } = require('../services/financeTools');

describe('finance tools', () => {
  test('cagr computes expected value', () => {
    const result = cagr({ startValue: 100, endValue: 121, years: 2 });
    expect(result).toBeCloseTo(0.1, 5);
  });

  test('sip future value returns positive number', () => {
    const result = futureValueSip({ monthlyContribution: 1000, annualRate: 0.12, years: 10 });
    expect(result).toBeGreaterThan(200000);
  });

  test('dcf returns number', () => {
    const result = dcf({ cashFlows: [100, 120, 140], discountRate: 0.12, terminalGrowthRate: 0.03 });
    expect(result).toBeGreaterThan(0);
  });

  test('volatility returns std dev', () => {
    const result = volatility([0.01, -0.02, 0.03, 0.015]);
    expect(result).toBeGreaterThan(0);
  });
});
