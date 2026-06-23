import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { JkidRouter } from 'jkid-daemon/src/http/trpc';

const trpc = createTRPCClient<JkidRouter>({
  links: [httpBatchLink({ url: '/api/trpc' })],
});

export default trpc;
