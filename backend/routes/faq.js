'use strict';

const express = require('express');
const knowledge = require('../data/knowledge.json');

const router = express.Router();

/**
 * GET /api/faq
 * Returns all questions and answers from the knowledge base.
 * Response: { "count": N, "faqs": [ { "question": "...", "answer": "..." }, ... ] }
 */
router.get('/', (req, res) => {
  const faqs = Object.entries(knowledge).map(([question, answer]) => ({
    question,
    answer,
  }));

  return res.json({ count: faqs.length, faqs });
});

module.exports = router;
