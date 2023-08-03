/**
 * This file contains the root router of your tRPC-backend
 */
import dbConnect from '~/server/mongo';
import { publicProcedure, router } from '../trpc';
import { postRouter } from './post';
import { candidatesRouter } from './candidates';

dbConnect().then().finally();

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  candidates: candidatesRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
