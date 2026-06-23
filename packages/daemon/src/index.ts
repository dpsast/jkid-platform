import { serve } from '@hono/node-server';

import config from '../config.json';
import app from './http';

serve({
  fetch: app.fetch,
  hostname: '0.0.0.0',
  port: config.http.port,
});

console.log(`Server is running at http://0.0.0.0:${config.http.port}`);
