import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const projectRouter = router({
  insertOne: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        owner: z.string(),
        title: z.string(),
        url: z.string(),
        description: z.string(),
        image: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { slug, owner, title, url, description, image } = input
      try {
        await ctx.prisma.project.create({
          data: {
            slug,
            owner,
            title,
            url,
            description,
            image
          }
        })
      } catch (error) {
        console.error(error)
      }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany()
  })
})
