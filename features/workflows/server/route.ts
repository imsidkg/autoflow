import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import z from "zod";
import { queryKeys } from "inngest";

export const workflowsRouter = createTRPCRouter({
  // for this change protectedProcedure to protected after integrating better auth
  create: protectedProcedure.mutation(({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: "TODO",
        userId: ctx.auth.user.id,
      },
    });
  }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return prisma.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  getMany: protectedProcedure.query(({ ctx }) => {
    queryKeys : ['fadaf'] 
    return prisma.workflow.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
  }),
});
