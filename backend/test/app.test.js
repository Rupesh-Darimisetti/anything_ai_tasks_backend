const path = require('path');
const assert = require('node:assert/strict');
const test = require('node:test');

// Load the same env file as `server.js` so `config/env.js` can validate.
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const request = require('supertest');
const app = require('../app');

test('GET /health returns ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});
