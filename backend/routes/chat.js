'use strict';

const express = require('express');
const { findBestMatch } = require('../utils/matcher');

const router = express.Router();
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/hunter-alpha';
const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 20000);

const FALLBACK_REPLY =
  "I don't have a specific answer for that yet. Try asking about topics like " +
  "stocks, SIPs, mutual funds, compounding, diversification, or what Derivity does.";

function sanitizeAssistantReasoningDetails(reasoningDetails) {
  if (reasoningDetails === undefined) {
    return undefined;
  }

  // Reasoning details can be an object or array. We only preserve valid JSON values.
  if (
    reasoningDetails === null ||
    typeof reasoningDetails === 'string' ||
    typeof reasoningDetails === 'number' ||
    typeof reasoningDetails === 'boolean' ||
    Array.isArray(reasoningDetails) ||
    typeof reasoningDetails === 'object'
  ) {
    return reasoningDetails;
  }

  return undefined;
}

function buildMessages(body) {
  if (Array.isArray(body.messages)) {
    if (body.messages.length === 0) {
      throw new Error('"messages" cannot be an empty array.');
    }

    return body.messages.map((message, index) => {
      if (!message || typeof message !== 'object') {
        throw new Error(`"messages[${index}]" must be an object.`);
      }

      const { role, content, reasoning_details: reasoningDetails } = message;

      if (!['system', 'user', 'assistant'].includes(role)) {
        throw new Error(`"messages[${index}].role" must be system, user, or assistant.`);
      }

      if (typeof content !== 'string') {
        throw new Error(`"messages[${index}].content" must be a string.`);
      }

      const trimmedContent = content.trim();
      if (trimmedContent.length === 0) {
        throw new Error(`"messages[${index}].content" cannot be blank.`);
      }

      const safeMessage = { role, content: trimmedContent };

      if (role === 'assistant') {
        const safeReasoningDetails = sanitizeAssistantReasoningDetails(reasoningDetails);
        if (safeReasoningDetails !== undefined) {
          safeMessage.reasoning_details = safeReasoningDetails;
        }
      }

      return safeMessage;
    });
  }

  if (typeof body.message === 'string') {
    const trimmed = body.message.trim();

    if (trimmed.length === 0) {
      throw new Error('"message" cannot be blank.');
    }

    if (trimmed.length > 500) {
      throw new Error('"message" must be 500 characters or fewer.');
    }

    return [{ role: 'user', content: trimmed }];
  }

  throw new Error('Request body must include either "message" (string) or "messages" (array).');
}

async function queryOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(process.env.OPENROUTER_REFERER ? { 'HTTP-Referer': process.env.OPENROUTER_REFERER } : {}),
      ...(process.env.OPENROUTER_TITLE ? { 'X-Title': process.env.OPENROUTER_TITLE } : {}),
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      reasoning: { enabled: true },
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const providerError =
      payload?.error?.message ||
      payload?.error ||
      `OpenRouter request failed with status ${response.status}.`;
    throw new Error(providerError);
  }

  const assistantMessage = payload?.choices?.[0]?.message;
  if (!assistantMessage) {
    throw new Error('OpenRouter response did not contain an assistant message.');
  }

  return {
    assistantMessage,
    model: payload?.model || OPENROUTER_MODEL,
  };
}

function extractAssistantContent(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }

        if (part && typeof part === 'object' && typeof part.text === 'string') {
          return part.text;
        }

        return '';
      })
      .join('')
      .trim();
  }

  return '';
}

/**
 * POST /api/chat
 * Body:
 *  - { "message": "what is derivity" }
 *  - { "messages": [{ role, content, reasoning_details? }, ...] }
 * Response: { "reply": "...", "assistantMessage": {...}, "model": "..." }
 */
router.post('/', async (req, res) => {
  let messages;

  try {
    messages = buildMessages(req.body || {});
  } catch (validationError) {
    return res.status(400).json({ error: validationError.message });
  }

  try {
    const { assistantMessage, model } = await queryOpenRouter(messages);
    const reply = extractAssistantContent(assistantMessage.content);

    return res.json({
      reply,
      assistantMessage: {
        role: assistantMessage.role || 'assistant',
        content: reply,
        reasoning_details: assistantMessage.reasoning_details,
      },
      model,
    });
  } catch (error) {
    // If no API key is configured, keep the old local matcher behavior for single-message usage.
    if (error.message === 'OPENROUTER_API_KEY is not set.' && typeof req.body?.message === 'string') {
      const localReply = findBestMatch(req.body.message.trim()) || FALLBACK_REPLY;
      return res.json({
        reply: localReply,
        assistantMessage: {
          role: 'assistant',
          content: localReply,
          reasoning_details: undefined,
        },
        model: 'local-fallback',
      });
    }

    return res.status(502).json({
      error: 'Failed to generate response from OpenRouter.',
      details: error.message,
    });
  }
});

module.exports = router;
