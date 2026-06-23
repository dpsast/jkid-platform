import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pendingUsers = sqliteTable('pending_users', {
  studentId: text('student_id').primaryKey(),
  realName: text('real_name').notNull(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull(),
  department: text('department').notNull(),
  reason: text('reason').notNull(),
});
