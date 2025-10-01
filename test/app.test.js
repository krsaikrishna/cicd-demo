const request = require('supertest');
const app = require('../index');

describe('GET /', () => {
  it('responds with JSON message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Hello from CI\/CD demo app/);
  });
});
