import { drizzle } from 'drizzle-orm/libsql';

import config from '../../config.json';

export const db = drizzle(config.sqliteUrl);
