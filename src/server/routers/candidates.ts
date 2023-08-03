/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { router, publicProcedure } from '../trpc';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';
// this package is only for now, streaming is a bit messed in offical sdk
import { TRPCError } from '@trpc/server';
import { env } from '../env';
import CandidateModel, { Candidate } from '~/models/Candidate';
import ChatModel, { Chat } from '~/models/Chat';
// import { revalidatePath, revalidateTag } from 'next/cache';
// import { generateCacheTag } from '~/trpc/index';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const candidatesRouter = router({
  // add your API routers here
  show: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const candidate = await CandidateModel.findById(id);
      if (!candidate) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Candidate not found',
        });
      }
      return candidate;
    }),
  list: publicProcedure.query(async () => {
    const candidates = await CandidateModel.find({}, {}, {});
    return candidates;
  }),
  chatHistory: publicProcedure
    .input(
      z.object({
        candidateId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { candidateId } = input;
      const candidateDocument = await CandidateModel.findById(candidateId, {
        chats: 1,
      });

      console.log('candidateChats', candidateDocument?.chats);
      if (!candidateDocument) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Candidate not found',
        });
      }

      // if there is no chat information create one
      if (!candidateDocument?.chats) {
        const newChat = new ChatModel();
        candidateDocument.chats = [newChat];
        await candidateDocument.save();
      }

      return candidateDocument as Candidate;
    }),
  chatComplete: publicProcedure
    .input(
      z.object({
        candidateId: z.number(),
        message: z.string().min(0).max(512),
      }),
    )
    .subscription(async ({ input, ctx }) => {
      const { candidateId, message } = input;
      const candidateDocument = await CandidateModel.findById(candidateId, {
        chats: 1,
      });

      console.log('candidateChats', candidateDocument?.chats);
      if (!candidateDocument) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Candidate not found',
        });
      }

      return observable<string>((sub) => {
        (async () => {
          const random = Math.floor(Math.random() * 100) + 1;
          const content = `New votes received: ${random}`;
          sub.next(content);
          sub.complete();
        })();
      });
    }),
});
