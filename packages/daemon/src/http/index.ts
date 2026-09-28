import { serveStatic } from '@hono/node-server/serve-static';
import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono/quick';
import type { Context } from 'hono';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import config from '../config';
import register from './register';
import { jkidRouter } from './trpc';

const app = new Hono();
const appPath = config.basePath || '/';

const rewriteStaticPath = (path: string) => {
  if (!config.basePath) {
    return path;
  }
  return path.slice(config.basePath.length) || '/';
};

const indexPath = resolve(import.meta.dirname, '../../../web/dist/index.html');
const indexBasePath = config.basePath ? `${config.basePath}/` : '/';

async function serveIndex(c: Context) {
  const index = await readFile(indexPath, 'utf8');
  return c.html(index.replace('<base href="./" />', `<base href="${indexBasePath}" />`));
}

app.route(`${config.basePath}/api/register`, register);
app.use(`${config.basePath}/api/trpc/*`, trpcServer({ router: jkidRouter }));

app.get(config.basePath || '/', serveIndex);

// Serve static files from the "dist" directory
app.use(
  `${config.basePath}/*`,
  serveStatic({ root: '../web/dist', rewriteRequestPath: rewriteStaticPath }),
);
app.get(appPath === '/' ? '/*' : `${config.basePath}/*`, serveIndex);

export default app;
