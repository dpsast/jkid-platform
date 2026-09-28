import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { JkidRouter } from 'jkid-daemon/src/http/trpc';

const trpc = createTRPCClient<JkidRouter>({
  links: [httpBatchLink({ url: new URL('api/trpc', document.baseURI).toString() })],
});

export default trpc;
