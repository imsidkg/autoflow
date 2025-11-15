import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import z from "zod";
import { PAGINATION } from "@/config/consants";
import { CredentialType } from "@/lib/generated/prisma";

export const credentialsRouter = createTRPCRouter({
  // for this change protectedProcedure to premium after integrating better auth
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      })
    )
    .mutation(({ input, ctx }) => {
      const { name, type, value } = input;

      return prisma.credential.create({
        data: {
          name,
          userId: ctx.auth.user.id,
          type,
          value, // to be added as encrypted value
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
      return prisma.credential.delete({
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, type, value } = input;

      const credential = await prisma.credential.findUniqueOrThrow({
        where: { id, userId: ctx.auth.user.id },
      });

      return prisma.credential.update({
        where: { id, userId: ctx.auth.user.id },
        data: {
          name,
          type,
          value, // to be added as encrypted value
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
      return prisma.credential.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        page,
        totalCount,
        pageSize,
      };
    }),

  getByType: protectedProcedure
    .input(z.object({ type: z.enum(CredentialType) }))
    .query(({ input, ctx }) => {
      const { type } = input;
      return prisma.credential.findMany({
        where: { type: type, userId: ctx.auth.user.id },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});
