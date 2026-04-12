'use strict';

const knowledge = require('../data/knowledge.json');
const { findBestMatch } = require('../utils/matcher');
const { callOpenRouter } = require('./llmClient');
const { memoryStore } = require('./memoryStore');
const { parseIntentSymbol, getMarketSnapshot } = require('./marketAdapter');
const { calculateFromText } = require('./financeTools');
const { retrieve } = require('./retrievalStore');
const { createTraceId, logAudit } = require('./auditLogger');
const { config } = require('./config');
const { inferTaskType, enforceSchema, tryParseJson, TASK_SCHEMAS } = require('./structuredOutput');
const { listTools, runTool } = require('./toolRegistry');

const FINANCE_SYSTEM_PROMPT = `
You are Derivity Pro Max, a finance-oriented AI analyst.
Rules:
1) Be precise, practical, and transparent about uncertainty.
2) Separate facts, assumptions, and not-financial-advice disclaimer.
3) Prefer deterministic math where possible and show formulas briefly.
4) Use market context and retrieved docs when provided.
5) Keep answers concise but high signal.
`;

function normalizeMessages(body) {
  if (Array.isArray(body.messages) && body.messages.length > 0) {
    return body.messages;
  }
  if (typeof body.message === 'string' && body.message.trim()) {
    return [{ role: 'user', content: body.message.trim() }];
  }
  throw new Error('Body must include non-empty "message" or "messages".');
}

function getLatestUserText(messages) {
  const reverse = [...messages].reverse();
  const user = reverse.find((m) => m.role === 'user');
  return user?.content || '';
}

function buildContextBlock({ marketSnapshot, retrievalHits, calcHint }) {
  const lines = [];
  if (marketSnapshot) lines.push(`Market snapshot: ${JSON.stringify(marketSnapshot)}`);
  if (retrievalHits.length > 0) {
    lines.push(
      `Retrieved context:\n${retrievalHits
        .map((d) => `- ${d.title || d.id}: ${String(d.content || '').slice(0, 300)}`)
        .join('\n')}`
    );
  }
  if (calcHint) lines.push(`Deterministic finance tool hint: ${JSON.stringify(calcHint)}`);
  return lines.join('\n\n');
}

async function runFinanceQuery({ body, sessionId }) {
  const traceId = createTraceId();
  const startedAt = Date.now();
  const incomingMessages = normalizeMessages(body);
  const latestUserText = getLatestUserText(incomingMessages);

  const memory = await memoryStore.getSession(sessionId);
  const marketIntent = parseIntentSymbol(latestUserText);
  const marketSnapshot = marketIntent ? await getMarketSnapshot(marketIntent).catch(() => null) : null;
  const retrievalHits = retrieve(latestUserText, config.retrievalTopK);
  const calcHint = calculateFromText(latestUserText);
  const taskType = body?.taskType || inferTaskType(latestUserText);
  const structuredMode = body?.responseFormat === 'json';

  const providerMessages = [
    { role: 'system', content: FINANCE_SYSTEM_PROMPT.trim() },
    ...memory,
  ];

  const contextBlock = buildContextBlock({ marketSnapshot, retrievalHits, calcHint });
  if (contextBlock) {
    providerMessages.push({
      role: 'system',
      content: `Additional context for this answer:\n${contextBlock}`,
    });
  }
  if (structuredMode) {
    providerMessages.push({
      role: 'system',
      content: `Return valid JSON only for task type "${taskType}" with required keys: ${TASK_SCHEMAS[taskType]?.required?.join(', ') || TASK_SCHEMAS.general_finance_answer.required.join(', ')}.`,
    });
  }
  providerMessages.push(...incomingMessages);

  // Tool planning loop (max 2 hops for speed and safety).
  const toolsPrompt = {
    role: 'system',
    content: `If tools are needed, output JSON exactly as {"tool":"<tool_name>","args":{...}} where tool_name is one of ${listTools().join(', ')}. Otherwise answer normally.`,
  };
  providerMessages.push(toolsPrompt);

  for (let hop = 0; hop < 2; hop += 1) {
    let planning;
    try {
      planning = await callOpenRouter(providerMessages, config.defaultModel);
    } catch (_error) {
      break;
    }
    const maybeTool = tryParseJson(planning.text);
    if (!maybeTool?.tool) break;
    if (!listTools().includes(maybeTool.tool)) break;
    const toolResult = await runTool(maybeTool.tool, maybeTool.args).catch((e) => ({ error: e.message }));
    providerMessages.push({
      role: 'assistant',
      content: planning.text,
    });
    providerMessages.push({
      role: 'system',
      content: `TOOL_RESULT ${maybeTool.tool}: ${JSON.stringify(toolResult)}`,
    });
  }

  let llmResult;
  let usedFallback = false;
  try {
    llmResult = await callOpenRouter(providerMessages, config.defaultModel);
  } catch (primaryError) {
    try {
      llmResult = await callOpenRouter(providerMessages, config.backupModel);
    } catch (backupError) {
      const localReply =
        findBestMatch(latestUserText) ||
        knowledge['what is derivity'] ||
        "I couldn't fetch live model output right now. Ask again in a few seconds.";
      usedFallback = true;
      llmResult = {
        text: localReply,
        assistantMessage: { role: 'assistant', content: localReply },
        model: 'local-fallback',
        error: `${primaryError.message} | ${backupError.message}`,
      };
    }
  }

  const assistantMessage = {
    role: 'assistant',
    content: llmResult.text,
    reasoning_details: llmResult.assistantMessage?.reasoning_details,
  };

  await memoryStore.append(sessionId, [...incomingMessages, assistantMessage]);

  let structured = null;
  if (structuredMode) {
    const parsed = tryParseJson(llmResult.text);
    const defaultByTask = {
      general_finance_answer: {
        summary: llmResult.text,
        key_points: [],
        risk_notes: [],
        disclaimer: 'Educational content only, not financial advice.',
      },
      sip_plan: {
        monthly_amount: null,
        years: null,
        assumed_annual_return: null,
        projected_value: null,
        notes: llmResult.text,
        disclaimer: 'Educational content only, not financial advice.',
      },
      portfolio_risk: {
        portfolio_summary: llmResult.text,
        risk_level: 'unknown',
        concentration_risks: [],
        improvements: [],
        disclaimer: 'Educational content only, not financial advice.',
      },
      market_brief: {
        market_summary: llmResult.text,
        drivers: [],
        risks: [],
        watchlist: [],
        disclaimer: 'Educational content only, not financial advice.',
      },
    };
    structured = enforceSchema(taskType, parsed || defaultByTask[taskType] || defaultByTask.general_finance_answer);
  }

  const result = {
    traceId,
    reply: llmResult.text,
    assistantMessage,
    model: llmResult.model,
    marketSnapshot,
    retrieved: retrievalHits.map((d) => ({ id: d.id, title: d.title || null })),
    meta: {
      usedFallback,
      latencyMs: Date.now() - startedAt,
      taskType,
    },
    ...(structuredMode ? { structured } : {}),
  };

  logAudit({
    traceId,
    sessionId: sessionId || null,
    request: { latestUserText, messageCount: incomingMessages.length },
    response: { model: result.model, usedFallback, latencyMs: result.meta.latencyMs },
  });

  return result;
}

module.exports = { runFinanceQuery };
