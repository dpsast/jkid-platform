import { serveStatic } from '@hono/node-server/serve-static';
import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono/quick';

import register from './register';
import { jkidRouter } from './trpc';

const app = new Hono();

app.route('/api/register', register);
app.use('/api/trpc/*', trpcServer({ router: jkidRouter }));

// Serve static files from the "dist" directory
app.use('*', serveStatic({ root: '../web/dist' }));
app.get('*', serveStatic({ path: './index.html', root: '../web/dist' }));

export default app;
