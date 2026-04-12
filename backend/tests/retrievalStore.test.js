'use strict';

const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'data', 'documents.json');

describe('retrieval store', () => {
  beforeEach(() => {
    fs.writeFileSync(storePath, '[]');
    jest.resetModules();
  });

  test('ingests and retrieves by semantic-ish similarity', () => {
    const { ingestDocument, retrieve } = require('../services/retrievalStore');
    ingestDocument({ title: 'SIP Basics', content: 'SIP monthly investing and compounding', source: 'test' });
    ingestDocument({ title: 'Crypto', content: 'Bitcoin and Ethereum volatility', source: 'test' });

    const hits = retrieve('how does sip compounding work', 2);
    expect(hits.length).toBeGreaterThan(0);
    expect(String(hits[0].title).toLowerCase()).toContain('sip');
  });
});
