import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const budgetBoxRouter = router({
  insertOne: publicProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        creator: z.string(),
        title: z.string(),
        image: z.string(),
        description: z.string(),
        dampingFactor: z.number().min(0).max(1)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        startDate,
        endDate,
        creator,
        title,
        image,
        description,
        dampingFactor
      } = input
      try {
        await ctx.prisma.budgetBox.create({
          data: {
            startDate,
            endDate,
            creator,
            title,
            image,
            description,
            dampingFactor
          }
        })
      } catch (error) {
        console.error(error)
      }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.budgetBox.findMany()
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(({ ctx, input }) => {
      const { id } = input
      return ctx.prisma.budgetBox.findFirst({
        where: {
          id
        }
      })
    })
})
