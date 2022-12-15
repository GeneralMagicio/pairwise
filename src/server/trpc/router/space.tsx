import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const spaceRouter = router({
  insertOne: publicProcedure
    .input(
      z.object({
        title: z.string(),
        creator: z.string(),
        slug: z.string(),
        address: z.string(),
        image: z.string(),
        description: z.string(),
        url: z.string().optional(),
        admins: z.string().array()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, creator, slug, address, image, description, url, admins } =
        input
      try {
        await ctx.prisma.space.create({
          data: {
            title,
            creator,
            slug,
            address,
            image,
            description,
            url,
            admins
          }
        })
      } catch (error) {
        console.error(error)
      }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({
      include: {
        Categories: true
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
      return ctx.prisma.space.findFirst({
        where: {
          id
        },
        include: {
          Categories: true
        }
      })
    }),
  getOneByAddress: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(({ ctx, input }) => {
      const { address } = input
      return ctx.prisma.space.findFirst({
        where: {
          address
        }
      })
    }),
  getOneBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .query(({ ctx, input }) => {
      const { slug } = input
      return ctx.prisma.space.findFirst({
        where: {
          slug
        },
        include: {
          Categories: true
        }
      })
    })
})
