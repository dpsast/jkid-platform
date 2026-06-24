import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import config from '../config';
import { db } from '../db';
import { pendingUsers } from '../db/schema';
import { giteaCreateUser } from '../gitea';
import { requestStorage } from '../storage';

const t = initTRPC.create();

export const jkidRouter = t.router({
  register: {
    submit: t.procedure
      .input(
        z.object({
          requestId: z.uuid(),
          password: z.string().max(64),
          department: z.string().max(64),
          reason: z.string().max(256),
        }),
      )
      .mutation(async ({ input }) => {
        const userInfo = requestStorage.get(input.requestId);
        if (!userInfo) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Invalid request ID',
          });
        }
        await db.insert(pendingUsers).values({
          studentId: userInfo.studentId,
          realName: userInfo.realName,
          username: userInfo.username,
          password: input.password,
          email: userInfo.email,
          department: input.department,
          reason: input.reason,
        });
        requestStorage.delete(input.requestId);
      }),
  },
  admin: {
    listPendingUsers: t.procedure
      .input(
        z.object({
          adminToken: z.string(),
        }),
      )
      .query(async ({ input }) => {
        if (input.adminToken !== config.adminToken) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        return await db.select().from(pendingUsers);
      }),
    approveUser: t.procedure
      .input(
        z.object({
          adminToken: z.string(),
          studentId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        if (input.adminToken !== config.adminToken) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const user = await db.select().from(pendingUsers).where(eq(pendingUsers.studentId, input.studentId)).get();
        if (!user) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }
        await giteaCreateUser({
          username: user.username,
          password: user.password,
          email: user.email,
          mustChangePassword: false,
        });
        await db.delete(pendingUsers).where(eq(pendingUsers.studentId, input.studentId));
      }),
    rejectUser: t.procedure
      .input(
        z.object({
          adminToken: z.string(),
          studentId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        if (input.adminToken !== config.adminToken) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const result = await db.delete(pendingUsers).where(eq(pendingUsers.studentId, input.studentId));
        if (result.rowsAffected === 0) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }
      }),
  },
});

export type JkidRouter = typeof jkidRouter;
