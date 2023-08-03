import {
  HTTPLinkOptions,
  HttpBatchLinkOptions,
  TRPCLink,
  httpBatchLink,
  httpLink,
} from '@trpc/client';
import { AnyRouter } from '@trpc/server';
import { generateCacheTag } from './index';

type NextFetchLinkOptions<TBatch extends boolean> = {
  batch?: TBatch;
} & (TBatch extends true ? HttpBatchLinkOptions : HTTPLinkOptions);

export function nextFetchLink<
  TRouter extends AnyRouter,
  TBatch extends boolean,
>(opts: NextFetchLinkOptions<TBatch>): TRPCLink<TRouter> {
  return (runtime) => {
    return (ctx) => {
      const { path, input } = ctx.op;
      const cacheTag = generateCacheTag(path, input);
      const revalidate = (ctx?.op?.context?.revalidate || false) as
        | number
        | false
        | undefined;
      const linkFactory = opts.batch ? httpBatchLink : httpLink;
      const link = linkFactory({
        url: opts.url,
        fetch: (url, fetchOpts) => {
          return fetch(url, {
            ...fetchOpts,
            next: { tags: [cacheTag], revalidate },
          });
        },
      })(runtime);

      return link(ctx);
    };
  };
}
