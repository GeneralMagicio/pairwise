import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const projectRouter = router({
  insertOne: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        title: z.string(),
        url: z.string(),
        description: z.string(),
        image: z.string(),
        BudgetBoxes: z
          .object({
            id: z.string()
          })
          .array()
          .optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { owner, title, url, description, image, BudgetBoxes } = input
      try {
        await ctx.prisma.project.create({
          data: {
            owner,
            title,
            url,
            description,
            image,
            BudgetBoxes: {
              connect: BudgetBoxes
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
    }),
  getManyByBudgetBoxId: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(({ ctx, input }) => {
      const { id } = input
      return ctx.prisma.project.findMany({
        where: {
          BudgetBoxes: {
            some: { id }
          }
        }
      })
    }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(({ ctx, input }) => {
      const { id } = input
      return ctx.prisma.project.findFirst({
        where: {
          id
        }
      })
    })
})
