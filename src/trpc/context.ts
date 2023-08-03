/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { IncomingHttpHeaders } from 'http';
// import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

/**
 * CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
interface CreateContextOptions {
  // session: Session | null
  headers: IncomingHttpHeaders;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {};
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 * for API-response caching see https://trpc.io/docs/caching
 */
export async function createContext(
  opts: Partial<trpcNext.CreateNextContextOptions> &
    Pick<trpcNext.CreateNextContextOptions, 'req'>,
): Promise<Context> {
  return await createContextInner({
    headers: opts.req.headers,
  });
}

/**
 * Session Context
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
// export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
//   const session = await getServerAuthSession();

//   return {
//     session,
//     headers: opts.headers,
//   };
// };
