'use strict';

const { config } = require('./config');

function extractAssistantContent(content) {
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim();
  }
  return '';
}

async function callOpenRouter(messages, model = config.defaultModel) {
  if (!config.openRouterApiKey) {
    throw new Error('OPENROUTER_API_KEY is not set.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.llmTimeoutMs);
  const response = await fetch(config.openRouterApiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.openRouterApiKey}`,
      'Content-Type': 'application/json',
      ...(config.openRouterReferer ? { 'HTTP-Referer': config.openRouterReferer } : {}),
      ...(config.openRouterTitle ? { 'X-Title': config.openRouterTitle } : {}),
    },
    body: JSON.stringify({
      model,
      messages,
      reasoning: { enabled: true },
      temperature: 0.2,
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = payload?.error?.message || payload?.error || `Model call failed (${response.status})`;
    throw new Error(msg);
  }

  const assistantMessage = payload?.choices?.[0]?.message;
  if (!assistantMessage) throw new Error('No assistant message in provider response.');

  return {
    text: extractAssistantContent(assistantMessage.content),
    assistantMessage,
    model: payload?.model || model,
  };
}

module.exports = { callOpenRouter };
