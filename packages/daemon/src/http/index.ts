import { serveStatic } from '@hono/node-server/serve-static';
import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono/quick';

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

app.route(`${config.basePath}/api/register`, register);
app.use(`${config.basePath}/api/trpc/*`, trpcServer({ router: jkidRouter }));

if (config.basePath) {
  app.get(config.basePath, (c) => c.redirect(`${config.basePath}/`));
}

// Serve static files from the "dist" directory
app.use(
  `${config.basePath}/*`,
  serveStatic({ root: '../web/dist', rewriteRequestPath: rewriteStaticPath }),
);
app.get(appPath === '/' ? '/*' : `${config.basePath}/*`, serveStatic({ path: './index.html', root: '../web/dist' }));

export default app;
