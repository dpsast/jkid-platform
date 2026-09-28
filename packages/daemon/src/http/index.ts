import { serveStatic } from '@hono/node-server/serve-static';
import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono/quick';

import config from '../config';
import register from './register';
import { jkidRouter } from './trpc';

const app = new Hono();

app.route(`${config.basePath}/api/register`, register);
app.use(`${config.basePath}/api/trpc/*`, trpcServer({ router: jkidRouter }));

// Serve static files from the "dist" directory
app.use(`${config.basePath}/*`, serveStatic({ root: '../web/dist' }));
app.get(`${config.basePath}/*`, serveStatic({ path: './index.html', root: '../web/dist' }));

export default app;
