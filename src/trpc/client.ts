'use client';

import { httpBatchLink, loggerLink, splitLink } from '@trpc/client';
import {
  experimental_createActionHook,
  experimental_createTRPCNextAppDirClient,
  experimental_serverActionLink,
} from '@trpc/next/app-dir/client';
import type { AppRouter } from '~/server/routers/_app';
import { httpSSELink } from './stream-link';
import { nextFetchLink } from './next-fetch-link';
import { getUrl } from './index';
import { transformer } from './transformer';

export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      transformer,
      links: [
        // loggerLink({
        //   enabled: (op) =>
        //     process.env.NODE_ENV === "development" ||
        //     (op.direction === "down" && op.result instanceof Error),
        // }),
        splitLink({
          condition(op) {
            return op.type === 'subscription';
          },
          true: httpSSELink({
            baseUrl: getUrl(),
          }),
          false: nextFetchLink({
            batch: false,
            url: getUrl(),
            headers(ctx) {
              console.log(ctx.op.context);
              return {
                'x-trpc-source': 'client',
              };
            },
          }),
        }),
      ],
    };
  },
});

export const streamApi = experimental_createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      transformer,
      links: [
        httpSSELink({
          baseUrl: getUrl(true),
        }),
      ],
    };
  },
});
export const useAction = experimental_createActionHook({
  links: [loggerLink(), experimental_serverActionLink()],
  transformer,
});

/** Export type helpers */
export type * from './index';
