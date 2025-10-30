import request from 'supertest';
import { createServer } from '../../setup/server.js';
import { loadConfig } from '../../setup/config.js';

describe('index routes', () => {
  it('responds with hello message', async () => {
    const app = await createServer(loadConfig());
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Hello from the Tako Node service template!',
    });
  });
});
