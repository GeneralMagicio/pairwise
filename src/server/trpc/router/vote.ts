import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const voteRouter = router({
  insertOne: publicProcedure
    .input(
      z.object({
        voter: z.string().min(1),
        budgetBoxId: z.string().min(1),
        preferences: z
          .object({
            preference: z.number(),
            alphaId: z.string(),
            betaId: z.string()
          })
          .array()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { voter, budgetBoxId, preferences } = input
      try {
        await ctx.prisma.vote.create({
          data: {
            voter,
            budgetBoxId,
            Preferences: {
              create: preferences
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
    }),
  getManyByVoter: publicProcedure
    .input(
      z.object({
        voter: z.string().min(1)
      })
    )
    .query(({ ctx, input }) => {
      const { voter } = input
      return ctx.prisma.vote.findMany({
        where: {
          voter
        }
      })
    })
})
