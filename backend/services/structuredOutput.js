'use strict';

const TASK_SCHEMAS = {
  general_finance_answer: {
    required: ['summary', 'key_points', 'risk_notes', 'disclaimer'],
  },
  sip_plan: {
    required: ['monthly_amount', 'years', 'assumed_annual_return', 'projected_value', 'notes', 'disclaimer'],
  },
  portfolio_risk: {
    required: ['portfolio_summary', 'risk_level', 'concentration_risks', 'improvements', 'disclaimer'],
  },
  market_brief: {
    required: ['market_summary', 'drivers', 'risks', 'watchlist', 'disclaimer'],
  },
};

function inferTaskType(text = '') {
  const q = text.toLowerCase();
  if (q.includes('sip') && (q.includes('plan') || q.includes('future value'))) return 'sip_plan';
  if (q.includes('portfolio') && q.includes('risk')) return 'portfolio_risk';
  if (q.includes('market') && (q.includes('today') || q.includes('brief') || q.includes('analysis'))) {
    return 'market_brief';
  }
  return 'general_finance_answer';
}

function enforceSchema(taskType, payload) {
  const schema = TASK_SCHEMAS[taskType] || TASK_SCHEMAS.general_finance_answer;
  if (!payload || typeof payload !== 'object') {
    throw new Error('Structured payload must be a JSON object.');
  }
  const missing = schema.required.filter((key) => payload[key] === undefined);
  if (missing.length > 0) {
    throw new Error(`Structured payload missing required keys: ${missing.join(', ')}`);
  }
  return payload;
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (_error) {
    return null;
  }
}

module.exports = {
  TASK_SCHEMAS,
  inferTaskType,
  enforceSchema,
  tryParseJson,
};
