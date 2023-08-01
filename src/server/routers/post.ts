/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import dbConnect from '~/server/mongo';
import PostModel, { Post } from '~/models/Post';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';

dbConnect().then().finally();

export const postRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        page: z.number().min(1).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.mongodb.com/docs/atlas/atlas-search/tutorial/pagination-tutorial/
       * @see https://www.mongodb.com/docs/drivers/node/v5.7/fundamentals/crud/read-operations/skip/
       */
      console.log('input', input);
      console.log('ctx', ctx);
      const limit = input.limit ?? 25;
      const page = input.page ?? 1;
      const skip = input.cursor ? page * limit : 0;

      const filter: FilterQuery<Post> = {};
      const projection: ProjectionType<Post> = {};
      const options: QueryOptions<Post> = {
        sort: { createdAt: -1 },
        skip,
        limit,
      };
      const items = await PostModel.find(filter, projection, options);

      console.log(`Found ${items.length} Posts`);

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
      const post = await PostModel.findById(id);
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
        ...input,
      });
      return post;
    }),
});
