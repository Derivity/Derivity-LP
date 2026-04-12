'use strict';

const fs = require('fs');
const path = require('path');

const { runFinanceQuery } = require('../services/orchestrator');

async function main() {
  const casesPath = path.join(__dirname, 'cases.json');
  const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
  const results = [];
  const startedAt = Date.now();

  for (const item of cases) {
    const t0 = Date.now();
    try {
      const response = await runFinanceQuery({
        sessionId: `eval-${item.id}`,
        body: {
          message: item.prompt,
          taskType: item.taskType,
          responseFormat: 'json',
        },
      });
      results.push({
        id: item.id,
        ok: true,
        latencyMs: Date.now() - t0,
        model: response.model,
        hasStructured: Boolean(response.structured),
      });
    } catch (error) {
      results.push({
        id: item.id,
        ok: false,
        latencyMs: Date.now() - t0,
        error: error.message,
      });
    }
  }

  const summary = {
    startedAt: new Date(startedAt).toISOString(),
    total: results.length,
    pass: results.filter((x) => x.ok).length,
    fail: results.filter((x) => !x.ok).length,
    avgLatencyMs:
      Math.round(results.reduce((acc, x) => acc + x.latencyMs, 0) / Math.max(results.length, 1)),
    results,
  };

  const outPath = path.join(__dirname, `report-${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  process.stdout.write(`Eval complete. Report: ${outPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
