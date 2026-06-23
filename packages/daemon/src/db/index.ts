import { drizzle } from 'drizzle-orm/libsql';

import config from '../config';

export const db = drizzle(config.sqliteUrl);
