import { createServer } from './setup/server.js';
import { loadConfig } from './setup/config.js';

async function main() {
  const config = loadConfig();
  const app = await createServer(config);

  app.listen(config.port, () => {
    console.log(`🚀 Server listening on http://localhost:${config.port}`);
  });
}

void main();
