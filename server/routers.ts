import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { deleteNote, getNotes, insertNote } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 笺 - shared note board
  notes: router({
    list: publicProcedure.query(async () => {
      const rows = await getNotes();
      // Return in ascending order (oldest first) for chat-like display
      return rows.reverse();
    }),
    add: publicProcedure
      .input(z.object({
        sender: z.enum(["me", "you"]),
        text: z.string().min(1).max(2000),
      }))
      .mutation(async ({ input }) => {
        await insertNote({ sender: input.sender, text: input.text });
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteNote(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
