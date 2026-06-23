import { defineConfig } from 'drizzle-kit';

const sqliteUrl = process.env.SQLITE_URL;
if (!sqliteUrl) {
  throw new Error('SQLITE_URL environment variable is not set');
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: sqliteUrl,
  },
});
