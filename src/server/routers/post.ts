/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import dbConnect from '~/server/mongo';
import PostModel, { Post } from '~/models/Post';

dbConnect().then().finally();

export const postRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.mongodb.com/docs/atlas/atlas-search/tutorial/pagination-tutorial/
       * @see https://www.mongodb.com/docs/drivers/node/v5.7/fundamentals/crud/read-operations/skip/
       */

      const limit = input.limit ?? 50;

      const items = await PostModel.find({
        // where: {},
        orderBy: {
          createdAt: 'desc',
        },
      }).skip(limit);

      return {
        items: items.reverse(),
      };
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const post = await PostModel.findById({
        where: { id },
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return post as Post;
    }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1).max(32),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const post = await PostModel.create({
        data: input,
      });
      return post;
    }),
});
